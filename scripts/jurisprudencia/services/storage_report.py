"""Relatório de armazenamento do módulo jurisprudência.

Uso CLI:
  python3 -c "from services.storage_report import print_report; print_report()"
"""
from __future__ import annotations
import os
from .supabase_client import SupabaseClient


def collect_stats() -> dict:
    """Coleta estatísticas básicas via PostgREST (sem precisar de SQL direto)."""
    client = SupabaseClient()

    stats: dict = {}

    # Total de decisões e por tribunal
    stats["total_decisoes"] = client.count("jurisprudencia_decisoes")
    stats["decisoes_stf"] = client.count(
        "jurisprudencia_decisoes", filters={"tribunal": "eq.STF"}
    )
    stats["decisoes_stj"] = client.count(
        "jurisprudencia_decisoes", filters={"tribunal": "eq.STJ"}
    )
    stats["decisoes_indexaveis"] = client.count(
        "jurisprudencia_decisoes",
        filters={"indexavel": "eq.true", "status": "eq.publicado"},
    )

    # Cache
    stats["caches_ativos"] = client.count(
        "jurisprudencia_inteiro_teor_cache", filters={"status": "eq.ativo"}
    )

    # Top 20 decisões mais acessadas
    try:
        top = client.select(
            "jurisprudencia_inteiro_teor_cache",
            columns="decisao_id,total_acessos,ultimo_acesso",
            order="total_acessos.desc",
            limit=20,
        )
        stats["top_acessadas"] = top
    except Exception:
        stats["top_acessadas"] = []

    # Coletas recentes
    try:
        logs = client.select(
            "jurisprudencia_coleta_logs",
            columns="tribunal,status,quantidade_inserida,quantidade_erro,iniciado_em",
            order="iniciado_em.desc",
            limit=10,
        )
        stats["coletas_recentes"] = logs
    except Exception:
        stats["coletas_recentes"] = []

    # Limite de aviso
    stats["max_db_size_warning_mb"] = int(
        os.environ.get("MAX_DB_SIZE_WARNING_MB", "400")
    )

    return stats


def print_report() -> None:
    """Imprime relatório formatado no stdout."""
    try:
        from dotenv import load_dotenv  # type: ignore
        load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
    except ImportError:
        pass

    stats = collect_stats()

    print("=" * 60)
    print("RELATÓRIO DE ARMAZENAMENTO — Jurisprudência AdvAqui")
    print("=" * 60)
    print(f"Total de decisões:        {stats['total_decisoes']:>6}")
    print(f"  STF:                    {stats['decisoes_stf']:>6}")
    print(f"  STJ:                    {stats['decisoes_stj']:>6}")
    print(f"  Indexáveis publicadas:  {stats['decisoes_indexaveis']:>6}")
    print(f"Caches ativos:            {stats['caches_ativos']:>6}")
    print()
    print(f"Aviso de tamanho do DB:   {stats['max_db_size_warning_mb']} MB")
    print()

    coletas = stats.get("coletas_recentes") or []
    if coletas:
        print("Últimas coletas:")
        for c in coletas[:5]:
            print(
                f"  {c.get('iniciado_em','')[:19]}  {c.get('tribunal',''):3s}  "
                f"status={c.get('status','')}  ins={c.get('quantidade_inserida',0)}  "
                f"err={c.get('quantidade_erro',0)}"
            )
        print()

    top = stats.get("top_acessadas") or []
    if top:
        print("Top decisões mais acessadas (cache):")
        for t in top[:10]:
            print(
                f"  id={t.get('decisao_id'):>6}  "
                f"acessos={t.get('total_acessos'):>4}  "
                f"ultimo={t.get('ultimo_acesso','')[:19]}"
            )
        print()

    print("=" * 60)


if __name__ == "__main__":
    print_report()
