#!/usr/bin/env python3
"""Limpeza diária de cache de inteiro teor expirado.

Roda via cron diário às 3h. Remove linhas de jurisprudencia_inteiro_teor_cache
onde expira_em < now() e status = 'ativo'. As decisões (metadados + ementa)
permanecem intactas.
"""
from __future__ import annotations
import logging
import os
import sys
from datetime import datetime, timezone

try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass

from services.supabase_client import SupabaseClient


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] cleanup — %(message)s",
)
logger = logging.getLogger("cleanup")


def run() -> int:
    try:
        client = SupabaseClient()
    except RuntimeError as e:
        logger.error("Supabase não configurado: %s", e)
        return 2

    now_iso = datetime.now(timezone.utc).isoformat()
    logger.info("Limpando cache expirado (corte: %s)", now_iso)

    try:
        # Conta antes (informativo)
        expirados = client.count(
            "jurisprudencia_inteiro_teor_cache",
            filters={"expira_em": f"lt.{now_iso}", "status": "eq.ativo"},
        )
        logger.info("Caches expirados encontrados: %d", expirados)

        if expirados == 0:
            logger.info("Nada pra limpar.")
            return 0

        # Apaga
        client.delete(
            "jurisprudencia_inteiro_teor_cache",
            filters={"expira_em": f"lt.{now_iso}", "status": "eq.ativo"},
        )
        logger.info("Cleanup concluído. Removidos %d caches.", expirados)
        return 0
    except Exception:
        logger.exception("Erro durante cleanup")
        return 1


if __name__ == "__main__":
    sys.exit(run())
