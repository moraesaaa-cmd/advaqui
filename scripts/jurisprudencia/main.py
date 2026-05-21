#!/usr/bin/env python3
"""Orquestrador da coleta de jurisprudência.

Lê config do .env, instancia coletores, busca decisões, normaliza, gera
slugs/SEO, salva no Supabase via UPSERT (idempotente), registra logs.

Uso:
  # No VPS, com .venv ativo e .env configurado:
  python3 main.py

Variáveis de env relevantes (ver .env.example):
  JURIS_MODE                 fixtures | real-stf | real-stj | hybrid
  JURIS_IMPORT_BATCH_SIZE    Quantidade por tribunal (default 100)
  JURIS_CONTACT_EMAIL        E-mail no User-Agent
"""
from __future__ import annotations
import logging
import os
import sys
import traceback
from datetime import datetime, timezone

from collectors.base import DecisaoBruta
from collectors.fixtures import FixturesCollector
from collectors.stf import STFCollector
from collectors.stj import STJCollector

from services.slug_service import build_slug, ensure_unique
from services.seo_service import build_seo_title, build_seo_description
from services.text_cleaner import clean_ementa
from services.topic_extractor import extract_topics, compute_content_hash
from services.supabase_client import SupabaseClient


# Carrega .env se presente (dotenv é opcional — em produção pode usar env do sistema)
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


def _collect_for_tribunal(tribunal: str, batch_size: int, mode: str, contact_email: str) -> list[DecisaoBruta]:
    """Decide qual coletor usar baseado no modo + tribunal."""
    if mode == "fixtures":
        return FixturesCollector(tribunal=tribunal).collect(batch_size)
    if mode == "hybrid":
        return FixturesCollector(tribunal=tribunal).collect(batch_size)
    if mode == f"real-{tribunal.lower()}":
        if tribunal == "STF":
            return STFCollector(contact_email=contact_email).collect(batch_size)
        if tribunal == "STJ":
            return STJCollector(contact_email=contact_email).collect(batch_size)
    return []


def _to_payload(d: DecisaoBruta, existing_slugs: set[str]) -> tuple[dict, set[str]]:
    """Converte DecisaoBruta + slugs existentes em payload pra Supabase.

    Retorna (payload_dict, slugs_atualizado).
    """
    ementa_clean = clean_ementa(d.ementa)
    temas, palavras, area = extract_topics(ementa_clean, d.tese)
    slug_base = build_slug(d.classe, d.numero, temas, ementa_clean)
    slug = ensure_unique(slug_base, existing_slugs)
    existing_slugs.add(slug)
    seo_title = build_seo_title(d.tribunal, d.classe, d.numero, temas)
    seo_desc = build_seo_description(d.tribunal, d.classe, d.relator, temas, ementa_clean)
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


def run() -> int:
    mode = os.environ.get("JURIS_MODE", "fixtures")
    batch_size = int(os.environ.get("JURIS_IMPORT_BATCH_SIZE", "100"))
    contact_email = os.environ.get("JURIS_CONTACT_EMAIL", "contato@advaqui.com.br")

    logger.info("Início da coleta — modo=%s, batch_size=%d", mode, batch_size)

    try:
        client = SupabaseClient()
    except RuntimeError as e:
        logger.error("Supabase não configurado: %s", e)
        return 2

    # Slugs existentes pra evitar colisão
    try:
        existing = client.select(
            "jurisprudencia_decisoes",
            columns="slug",
            limit=10000,
        )
        existing_slugs = {row.get("slug") for row in existing if row.get("slug")}
        logger.info("Slugs já no banco: %d", len(existing_slugs))
    except Exception as e:
        logger.warning("Não consegui carregar slugs existentes: %s. Seguindo vazio.", e)
        existing_slugs = set()

    total_inserido = 0
    total_erro = 0

    for tribunal in ("STF", "STJ"):
        started_at = datetime.now(timezone.utc).isoformat()
        try:
            decisoes = _collect_for_tribunal(tribunal, batch_size, mode, contact_email)
            logger.info("Coletor %s retornou %d decisões", tribunal, len(decisoes))

            payloads: list[dict] = []
            for d in decisoes:
                try:
                    payload, existing_slugs = _to_payload(d, existing_slugs)
                    payloads.append(payload)
                except Exception as ex:
                    total_erro += 1
                    logger.warning("Falha convertendo decisão %s: %s", d.numero, ex)

            inseridos = 0
            if payloads:
                # Upsert em lotes de 50 pra não estourar payload HTTP
                for i in range(0, len(payloads), 50):
                    chunk = payloads[i:i + 50]
                    try:
                        result = client.upsert("jurisprudencia_decisoes", chunk, on_conflict="url_origem")
                        inseridos += len(result)
                    except Exception as ex:
                        total_erro += len(chunk)
                        logger.error("Falha no upsert lote %d-%d: %s", i, i + len(chunk), ex)
            total_inserido += inseridos

            # Log de coleta
            try:
                client.insert("jurisprudencia_coleta_logs", [{
                    "fonte": f"{mode}/{tribunal.lower()}",
                    "tribunal": tribunal,
                    "status": "sucesso" if inseridos == len(payloads) else "parcial",
                    "mensagem": f"Coleta {tribunal} concluída",
                    "quantidade_encontrada": len(decisoes),
                    "quantidade_inserida": inseridos,
                    "quantidade_atualizada": 0,
                    "quantidade_erro": len(decisoes) - inseridos,
                    "iniciado_em": started_at,
                    "finalizado_em": datetime.now(timezone.utc).isoformat(),
                }])
            except Exception as ex:
                logger.warning("Falha ao registrar log de coleta: %s", ex)

        except Exception:
            total_erro += 1
            logger.exception("Erro fatal coletando %s", tribunal)
            try:
                client.insert("jurisprudencia_coleta_logs", [{
                    "fonte": f"{mode}/{tribunal.lower()}",
                    "tribunal": tribunal,
                    "status": "erro",
                    "mensagem": traceback.format_exc()[:500],
                    "quantidade_encontrada": 0,
                    "quantidade_inserida": 0,
                    "quantidade_atualizada": 0,
                    "quantidade_erro": 1,
                    "iniciado_em": started_at,
                    "finalizado_em": datetime.now(timezone.utc).isoformat(),
                }])
            except Exception:
                pass

    logger.info("Concluído. Inseridas/atualizadas: %d. Erros: %d.", total_inserido, total_erro)
    return 0 if total_erro == 0 else 1


if __name__ == "__main__":
    sys.exit(run())
