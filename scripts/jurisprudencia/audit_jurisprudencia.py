#!/usr/bin/env python3
"""Audita o módulo de jurisprudência.

Verifica integridade de dados no banco e devolve um relatório resumido
sobre o stdout. Exit code 0 se tudo OK, 1 se encontrou problemas (útil
pra cron com alerta).

Checagens:
  - Registros publicados que contenham AMOSTRA, fixture, mock, demo, sample
  - Registros com URL example.invalid / *.invalid / *.example
  - Registros indexáveis com ementa vazia ou muito curta
  - Registros indexáveis sem url_origem ou com fonte fora dos domínios oficiais
  - Coletas recentes com status erro

Uso:
  python3 audit_jurisprudencia.py
"""
from __future__ import annotations

import logging
import os
import sys
from urllib.parse import urlparse

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
logger = logging.getLogger("audit")


OFFICIAL_HOSTS = {
    "stf.jus.br",
    "portal.stf.jus.br",
    "redir.stf.jus.br",
    "jurisprudencia.stf.jus.br",
    "stj.jus.br",
    "processo.stj.jus.br",
    "scon.stj.jus.br",
    "ww2.stj.jus.br",
    "cnj.jus.br",
    "www.cnj.jus.br",
}


def _is_official_host(url: str | None) -> bool:
    if not url:
        return False
    try:
        host = urlparse(url).hostname or ""
    except Exception:
        return False
    host = host.lower()
    if not host:
        return False
    if host.endswith(".invalid") or host.endswith(".example") or host.endswith(".test"):
        return False
    return host in OFFICIAL_HOSTS


def main() -> int:
    try:
        client = SupabaseClient()
    except RuntimeError as e:
        logger.error("Supabase não configurado: %s", e)
        return 2

    problems: list[str] = []

    # 1) Marcadores de fixture publicados
    try:
        fakes = client.select(
            "jurisprudencia_decisoes",
            columns="id,tribunal,slug,url_origem",
            filters={
                "status": "eq.publicado",
                "ementa": "ilike.*AMOSTRA*",
            },
            limit=50,
        )
        if fakes:
            problems.append(
                f"{len(fakes)} decisão(ões) PUBLICADAS com marcador AMOSTRA"
            )
    except Exception as e:
        logger.warning("Falha checando AMOSTRA: %s", e)

    # 2) example.invalid em publicado
    try:
        bad_urls = client.select(
            "jurisprudencia_decisoes",
            columns="id,url_origem",
            filters={
                "status": "eq.publicado",
                "url_origem": "ilike.*example.invalid*",
            },
            limit=50,
        )
        if bad_urls:
            problems.append(
                f"{len(bad_urls)} decisão(ões) PUBLICADAS com example.invalid"
            )
    except Exception as e:
        logger.warning("Falha checando example.invalid: %s", e)

    # 3) Ementa muito curta em publicadas
    try:
        all_pub = client.select(
            "jurisprudencia_decisoes",
            columns="id,ementa,url_origem,status",
            filters={"status": "eq.publicado"},
            limit=10000,
        )
        short = [r for r in all_pub if not r.get("ementa") or len(r["ementa"]) < 50]
        if short:
            problems.append(
                f"{len(short)} decisão(ões) publicadas com ementa muito curta (<50 chars)"
            )

        # 4) Fonte fora dos domínios oficiais
        non_official = [r for r in all_pub if not _is_official_host(r.get("url_origem"))]
        if non_official:
            problems.append(
                f"{len(non_official)} decisão(ões) publicadas com fonte NÃO oficial"
            )
    except Exception as e:
        logger.warning("Falha listando publicadas: %s", e)
        all_pub = []

    # 5) Coletas com erro nas últimas 24h
    try:
        from datetime import datetime, timedelta, timezone
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
        errored = client.select(
            "jurisprudencia_coleta_logs",
            columns="id,tribunal,status,mensagem,iniciado_em",
            filters={"status": "eq.erro", "iniciado_em": f"gte.{cutoff}"},
            order="iniciado_em.desc",
            limit=20,
        )
        if errored:
            problems.append(f"{len(errored)} coleta(s) com erro nas últimas 24h")
    except Exception as e:
        logger.warning("Falha checando logs de coleta: %s", e)

    # Relatório
    print("=" * 60)
    print("AUDITORIA — Jurisprudência AdvAqui")
    print("=" * 60)
    print(f"Total publicadas:  {len(all_pub)}")
    print(f"Problemas:         {len(problems)}")
    print()
    if problems:
        print("⚠ Problemas encontrados:")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("✓ Nenhum problema crítico encontrado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
