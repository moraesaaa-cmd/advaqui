#!/usr/bin/env python3
"""Orquestrador da coleta de jurisprudência.

Lê config do .env e/ou CLI args, instancia coletores, busca decisões reais,
normaliza, gera slugs/SEO, salva no Supabase via UPSERT (idempotente),
registra logs.

USO MAIS COMUM:

  # Coleta real do STJ via Portal de Dados Abertos:
  python3 main.py --source=stj-ckan --mode=main --limit=200

  # Modo teste (limit pequeno, apenas conta):
  python3 main.py --source=stj-ckan --mode=test --limit=20 --force

CLI args:
  --source   stj-ckan | stf | all  (default: stj-ckan)
  --mode     main | afternoon | test    (default: main)
  --limit    Quantas decisões por execução (default: 200)
  --force    Ignora JURIS_MODE=disabled (default: false)

Variáveis env relevantes (ver .env.example):
  JURIS_MODE                 disabled (default) | enabled
  JURIS_CONTACT_EMAIL        E-mail no User-Agent
  STJ_CKAN_DATASETS          (opcional) lista separada por vírgula

Princípios:
  - Sem dados sintéticos. Coletores só publicam dados reais oficiais.
  - Em produção, o padrão é JURIS_MODE=disabled. Coletor só roda quando
    explicitamente habilitado OU com --force.
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
import traceback
from datetime import datetime, timezone

from collectors.base import DecisaoBruta
from collectors.stj_ckan import STJCkanCollector

from services.slug_service import build_slug, ensure_unique
from services.seo_service import build_seo_title, build_seo_description
from services.text_cleaner import clean_ementa
from services.topic_extractor import extract_topics, compute_content_hash
from services.supabase_client import SupabaseClient


# Carrega .env se presente
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("main")


# ---------------------------------------------------------------------------
# Detecção de conteúdo sensível (mesma lista que o validador do front)
# ---------------------------------------------------------------------------
import re

_SENSITIVE_RE = re.compile(
    r"\bsegredo\s+de\s+justi[çc]a\b"
    r"|\bsigilo(so)?\b"
    r"|\btramita[çc][ãa]o\s+sigilosa\b"
    r"|\bprocesso\s+sigiloso\b"
    r"|\beca\b|\bestatuto\s+da\s+crian[çc]a\s+e\s+do\s+adolescente\b"
    r"|\bviol[êe]ncia\s+sexual\b|\babuso\s+sexual\b"
    r"|\bestupro\s+de\s+vulner[áa]vel\b"
    r"|\bcrime\s+sexual\s+contra\s+menor\b"
    r"|\bado[çc][ãa]o\s+(sigilosa|de\s+menor)\b"
    r"|\bguarda\s+de\s+menor\b"
    r"|\bdesti(t|tuiç)[ãa]o\s+do\s+poder\s+familiar\b",
    re.IGNORECASE,
)


def _is_sensitive(d: DecisaoBruta) -> bool:
    haystack = " ".join([
        d.ementa or "",
        d.tese or "",
        d.relator or "",
        d.orgao_julgador or "",
    ])
    return bool(_SENSITIVE_RE.search(haystack))


# ---------------------------------------------------------------------------
# Coletor dispatch
# ---------------------------------------------------------------------------
def _collect(source: str, batch_size: int, contact_email: str) -> list[DecisaoBruta]:
    if source == "stj-ckan":
        return STJCkanCollector(contact_email=contact_email).collect(batch_size)
    if source == "stf":
        logger.warning(
            "Coletor STF não implementado (portal protegido por AWS WAF). "
            "Veja docs/stf-jurisprudencia-fontes.md para roadmap."
        )
        return []
    if source == "all":
        out = STJCkanCollector(contact_email=contact_email).collect(batch_size)
        # STF retornaria aqui se implementado
        return out
    logger.error("Source desconhecido: %s", source)
    return []


# ---------------------------------------------------------------------------
# Conversão DecisaoBruta → payload Supabase
# ---------------------------------------------------------------------------
def _to_payload(d: DecisaoBruta, existing_slugs: set[str]) -> tuple[dict, set[str]]:
    ementa_clean = clean_ementa(d.ementa)
    temas, palavras, area = extract_topics(ementa_clean, d.tese)
    slug_base = build_slug(d.classe, d.numero, temas, ementa_clean)
    slug = ensure_unique(slug_base, existing_slugs)
    existing_slugs.add(slug)
    seo_title = build_seo_title(d.tribunal, d.classe, d.numero, temas)
    seo_desc = build_seo_description(
        d.tribunal, d.classe, d.relator, temas, ementa_clean
    )
    extra = d.extra or {}
    payload = {
        "tribunal": d.tribunal,
        "classe": d.classe,
        "numero": d.numero,
        "processo": d.processo,
        "relator": d.relator,
        "orgao_julgador": d.orgao_julgador,
        "data_julgamento": d.data_julgamento.isoformat() if d.data_julgamento else None,
        "data_publicacao": d.data_publicacao.isoformat() if d.data_publicacao else None,
        "ementa": ementa_clean,
        "tese": d.tese,
        "resumo_informativo": extra.get("decisao_resumo"),
        "temas": temas,
        "palavras_chave": palavras,
        "area_relacionada": area,
        "url_origem": d.url_origem,
        "slug": slug,
        "hash_conteudo": compute_content_hash(ementa_clean, d.classe, d.numero),
        "seo_title": seo_title,
        "seo_description": seo_desc,
        "status": "publicado",
        "indexavel": True,
    }
    return payload, existing_slugs


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Coletor de jurisprudência AdvAqui")
    p.add_argument(
        "--source",
        choices=["stj-ckan", "stf", "all"],
        default="stj-ckan",
        help="Fonte da coleta",
    )
    p.add_argument(
        "--mode",
        choices=["main", "afternoon", "test"],
        default="main",
        help="Modo: main (coleta+grava), afternoon (mesma coisa, log marcado), test (não grava)",
    )
    p.add_argument(
        "--limit",
        type=int,
        default=200,
        help="Quantidade máxima de decisões a coletar nesta execução",
    )
    p.add_argument(
        "--force",
        action="store_true",
        help="Ignora JURIS_MODE=disabled (só pra execução manual)",
    )
    return p.parse_args()


def run() -> int:
    args = _parse_args()
    juris_mode = (os.environ.get("JURIS_MODE", "disabled") or "disabled").lower().strip()
    contact_email = os.environ.get("JURIS_CONTACT_EMAIL", "contato@advaqui.com.br")

    logger.info(
        "Início — source=%s mode=%s limit=%d JURIS_MODE=%s force=%s",
        args.source, args.mode, args.limit, juris_mode, args.force,
    )

    if juris_mode == "disabled" and not args.force:
        logger.info(
            "JURIS_MODE=disabled. Coletor inativo. "
            "Para ativar coleta automática diária, defina JURIS_MODE=enabled no .env. "
            "Para executar manualmente, use --force."
        )
        return 0

    try:
        client = SupabaseClient()
    except RuntimeError as e:
        logger.error("Supabase não configurado: %s", e)
        return 2

    started_at = datetime.now(timezone.utc).isoformat()

    # Slugs existentes (deduplicação)
    try:
        existing = client.select(
            "jurisprudencia_decisoes",
            columns="slug",
            limit=20000,
        )
        existing_slugs = {row.get("slug") for row in existing if row.get("slug")}
        logger.info("Slugs já no banco: %d", len(existing_slugs))
    except Exception as e:
        logger.warning("Falha carregando slugs existentes: %s", e)
        existing_slugs = set()

    # URLs já existentes (deduplicação por url_origem)
    try:
        existing_urls_rows = client.select(
            "jurisprudencia_decisoes",
            columns="url_origem",
            limit=20000,
        )
        existing_urls = {
            row.get("url_origem")
            for row in existing_urls_rows
            if row.get("url_origem")
        }
        logger.info("URLs já no banco: %d", len(existing_urls))
    except Exception as e:
        logger.warning("Falha carregando url_origens: %s", e)
        existing_urls = set()

    # -------------------------------------------------------
    # Coleta
    # -------------------------------------------------------
    decisoes = _collect(args.source, args.limit, contact_email)
    encontradas = len(decisoes)
    logger.info("Decisões coletadas (cruas): %d", encontradas)

    # -------------------------------------------------------
    # Validação + filtros (sensibilidade, deduplicação)
    # -------------------------------------------------------
    validas: list[DecisaoBruta] = []
    rejeitadas_sensiveis = 0
    rejeitadas_sem_ementa = 0
    duplicadas = 0

    for d in decisoes:
        if not d.ementa or len(d.ementa.strip()) < 50:
            rejeitadas_sem_ementa += 1
            continue
        if _is_sensitive(d):
            rejeitadas_sensiveis += 1
            continue
        if d.url_origem in existing_urls:
            duplicadas += 1
            continue
        validas.append(d)

    logger.info(
        "Filtro: %d válidas | %d sem ementa | %d sensíveis | %d duplicadas",
        len(validas), rejeitadas_sem_ementa, rejeitadas_sensiveis, duplicadas,
    )

    if args.mode == "test":
        logger.info("MODE=test → não gravando no Supabase.")
        if validas[:3]:
            logger.info("Amostra das 3 primeiras válidas:")
            for d in validas[:3]:
                logger.info(
                    "  - [%s] %s %s | rel=%s | ementa=%s",
                    d.tribunal, d.classe, d.numero,
                    (d.relator or "—")[:40],
                    (d.ementa or "")[:100],
                )
        return 0

    # -------------------------------------------------------
    # Build payloads + UPSERT
    # -------------------------------------------------------
    payloads: list[dict] = []
    erros_payload = 0
    for d in validas:
        try:
            payload, existing_slugs = _to_payload(d, existing_slugs)
            payloads.append(payload)
        except Exception as ex:
            erros_payload += 1
            logger.warning("Falha convertendo %s/%s: %s", d.classe, d.numero, ex)

    inseridas = 0
    erros_upsert = 0
    if payloads:
        for i in range(0, len(payloads), 50):
            chunk = payloads[i:i + 50]
            try:
                result = client.upsert(
                    "jurisprudencia_decisoes",
                    chunk,
                    on_conflict="url_origem",
                )
                inseridas += len(result)
            except Exception as ex:
                erros_upsert += len(chunk)
                logger.error(
                    "UPSERT lote %d-%d falhou: %s",
                    i, i + len(chunk), ex,
                )

    # Log de coleta
    try:
        client.insert("jurisprudencia_coleta_logs", [{
            "fonte": f"{args.source}/{args.mode}",
            "tribunal": "STJ" if args.source == "stj-ckan" else "STF",
            "status": "sucesso" if (erros_payload + erros_upsert) == 0 else "parcial",
            "mensagem": (
                f"source={args.source} mode={args.mode} limit={args.limit} "
                f"encontradas={encontradas} validas={len(validas)} "
                f"inseridas={inseridas} sem_ementa={rejeitadas_sem_ementa} "
                f"sensiveis={rejeitadas_sensiveis} duplicadas={duplicadas}"
            )[:480],
            "quantidade_encontrada": encontradas,
            "quantidade_inserida": inseridas,
            "quantidade_atualizada": 0,
            "quantidade_erro": erros_payload + erros_upsert,
            "iniciado_em": started_at,
            "finalizado_em": datetime.now(timezone.utc).isoformat(),
        }])
    except Exception as ex:
        logger.warning("Falha ao registrar log de coleta: %s", ex)

    # -------------------------------------------------------
    # Relatório
    # -------------------------------------------------------
    print("=" * 60)
    print("COLETA — Jurisprudência AdvAqui")
    print("=" * 60)
    print(f"Source:               {args.source}")
    print(f"Mode:                 {args.mode}")
    print(f"Limit:                {args.limit}")
    print(f"Encontradas (cruas):  {encontradas}")
    print(f"Válidas:              {len(validas)}")
    print(f"Rejeitadas s/ ementa: {rejeitadas_sem_ementa}")
    print(f"Rejeitadas sensíveis: {rejeitadas_sensiveis}")
    print(f"Duplicadas:           {duplicadas}")
    print(f"Inseridas/upserted:   {inseridas}")
    print(f"Erros payload:        {erros_payload}")
    print(f"Erros upsert:         {erros_upsert}")
    print("=" * 60)

    return 0 if (erros_payload + erros_upsert) == 0 else 1


if __name__ == "__main__":
    sys.exit(run())
