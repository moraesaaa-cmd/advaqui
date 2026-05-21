#!/usr/bin/env python3
"""Gera resumos informativos para decisões já importadas que ainda não têm.

Uso:
  python3 generate_summaries.py --limit=200
  python3 generate_summaries.py --limit=50 --force  # regera mesmo se já tem
  python3 generate_summaries.py --dry-run           # não grava

Princípios:
  - Roda em lotes pra não estourar carga.
  - Não derruba decisões existentes. Só preenche campos resumo_*.
  - Sem dependência de LLM. Tudo via regras em summary_generator.py.
"""
from __future__ import annotations

import argparse
import logging
import os
import sys

from services.supabase_client import SupabaseClient
from services.summary_generator import generate_jurisprudencia_summary


try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("generate_summaries")


def main() -> int:
    p = argparse.ArgumentParser(description="Gera resumos informativos de jurisprudência.")
    p.add_argument("--limit", type=int, default=200, help="Máximo de decisões processadas")
    p.add_argument("--force", action="store_true", help="Regera mesmo se já tem resumo_status")
    p.add_argument("--dry-run", action="store_true", help="Não grava no banco")
    args = p.parse_args()

    try:
        client = SupabaseClient()
    except RuntimeError as e:
        logger.error("Supabase não configurado: %s", e)
        return 2

    # Busca decisões publicadas. Se --force, todas; caso contrário só sem resumo.
    filters = {"status": "eq.publicado"}
    if not args.force:
        filters["resumo_status"] = "is.null"

    try:
        rows = client.select(
            "jurisprudencia_decisoes",
            columns="id,ementa,tese,classe,orgao_julgador,relator,resumo_status",
            filters=filters,
            limit=args.limit,
            order="id.desc",
        )
    except Exception as e:
        logger.error("Falha buscando decisões: %s", e)
        return 3

    if not rows:
        print("=" * 60)
        print("Nenhuma decisão pendente de resumo encontrada.")
        print(f"Filtros: status=publicado{' (e sem resumo)' if not args.force else ''}")
        print("=" * 60)
        return 0

    logger.info("Processando %d decisão(ões)...", len(rows))

    gerados = 0
    indisponiveis = 0
    erros = 0
    atualizados_no_banco = 0
    exemplos: list[dict] = []

    for row in rows:
        try:
            resumo = generate_jurisprudencia_summary(row)
            status = resumo.get("resumo_status")
            if status == "gerado":
                gerados += 1
            elif status == "erro":
                erros += 1
            else:
                indisponiveis += 1

            if len(exemplos) < 5 and status == "gerado":
                exemplos.append({
                    "id": row.get("id"),
                    "tema": resumo.get("resumo_tema"),
                    "decisao": resumo.get("resumo_decisao"),
                    "entendimento": resumo.get("resumo_entendimento"),
                    "pontos": resumo.get("resumo_pontos"),
                })

            if not args.dry_run:
                try:
                    client.update(
                        "jurisprudencia_decisoes",
                        filters={"id": f"eq.{row['id']}"},
                        values=resumo,
                    )
                    atualizados_no_banco += 1
                except Exception as ex:
                    erros += 1
                    logger.warning("Falha update id=%s: %s", row.get("id"), ex)
        except Exception as ex:
            erros += 1
            logger.warning("Falha processando id=%s: %s", row.get("id"), ex)

    # Relatório
    print("=" * 60)
    print("GERAÇÃO DE RESUMOS — Jurisprudência AdvAqui")
    print("=" * 60)
    print(f"Processadas:          {len(rows)}")
    print(f"Geradas (status=ok):  {gerados}")
    print(f"Indisponíveis:        {indisponiveis}")
    print(f"Erros:                {erros}")
    print(f"Gravadas no banco:    {atualizados_no_banco}")
    print(f"Modo:                 {'DRY-RUN' if args.dry_run else 'GRAVAÇÃO'}")
    if exemplos:
        print()
        print("Amostra de 5 resumos gerados:")
        for i, ex in enumerate(exemplos, 1):
            print(f"  {i}. id={ex['id']}")
            if ex.get("tema"):
                print(f"     Tema: {ex['tema'][:100]}")
            if ex.get("decisao"):
                print(f"     Decisão: {ex['decisao'][:120]}")
            if ex.get("entendimento"):
                print(f"     Entendimento: {ex['entendimento'][:130]}")
    print("=" * 60)

    return 0


if __name__ == "__main__":
    sys.exit(main())
