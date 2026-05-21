"""Cliente Supabase leve via PostgREST + REST API.

Não usa supabase-py oficial pra evitar dependências pesadas.
Usa apenas `requests` e endpoints HTTP padrão do Supabase.
"""
from __future__ import annotations
import os
import logging
from typing import Any
import requests


logger = logging.getLogger(__name__)


class SupabaseClient:
    """Wrapper minimalista do Supabase REST API (PostgREST).

    Auth: SERVICE_ROLE key (bypass RLS).
    """

    def __init__(self, url: str | None = None, service_key: str | None = None, timeout: int = 20):
        self.url = (url or os.environ.get("SUPABASE_URL", "")).rstrip("/")
        self.key = service_key or os.environ.get("SUPABASE_SERVICE_KEY", "")
        if not self.url or not self.key:
            raise RuntimeError(
                "SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios"
            )
        self.timeout = timeout
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def upsert(
        self,
        table: str,
        rows: list[dict[str, Any]],
        on_conflict: str = "url_origem",
    ) -> list[dict[str, Any]]:
        """UPSERT em massa numa tabela.

        on_conflict: coluna(s) com constraint UNIQUE pra detectar duplicata.
        """
        if not rows:
            return []
        endpoint = f"{self.url}/rest/v1/{table}?on_conflict={on_conflict}"
        headers = {**self.headers, "Prefer": "resolution=merge-duplicates,return=representation"}
        r = requests.post(endpoint, headers=headers, json=rows, timeout=self.timeout)
        if r.status_code >= 400:
            logger.error("Upsert %s falhou: %s %s", table, r.status_code, r.text[:200])
            r.raise_for_status()
        return r.json() if r.text else []

    def insert(self, table: str, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """INSERT simples (sem upsert)."""
        if not rows:
            return []
        endpoint = f"{self.url}/rest/v1/{table}"
        r = requests.post(endpoint, headers=self.headers, json=rows, timeout=self.timeout)
        if r.status_code >= 400:
            logger.error("Insert %s falhou: %s %s", table, r.status_code, r.text[:200])
            r.raise_for_status()
        return r.json() if r.text else []

    def select(
        self,
        table: str,
        columns: str = "*",
        filters: dict[str, str] | None = None,
        limit: int | None = None,
        order: str | None = None,
    ) -> list[dict[str, Any]]:
        """SELECT com filtros simples no formato PostgREST.

        filters: {"status": "eq.publicado", "tribunal": "eq.STF"}
        """
        params: dict[str, Any] = {"select": columns}
        if filters:
            params.update(filters)
        if limit:
            params["limit"] = limit
        if order:
            params["order"] = order
        endpoint = f"{self.url}/rest/v1/{table}"
        r = requests.get(endpoint, headers=self.headers, params=params, timeout=self.timeout)
        if r.status_code >= 400:
            logger.error("Select %s falhou: %s %s", table, r.status_code, r.text[:200])
            r.raise_for_status()
        return r.json() if r.text else []

    def delete(self, table: str, filters: dict[str, str]) -> dict[str, Any]:
        """DELETE com filtros PostgREST."""
        endpoint = f"{self.url}/rest/v1/{table}"
        r = requests.delete(endpoint, headers=self.headers, params=filters, timeout=self.timeout)
        if r.status_code >= 400:
            logger.error("Delete %s falhou: %s %s", table, r.status_code, r.text[:200])
            r.raise_for_status()
        return {"ok": True, "status": r.status_code}

    def update(self, table: str, filters: dict[str, str], values: dict[str, Any]) -> list[dict[str, Any]]:
        """UPDATE com filtros PostgREST."""
        endpoint = f"{self.url}/rest/v1/{table}"
        r = requests.patch(
            endpoint, headers=self.headers, params=filters, json=values, timeout=self.timeout
        )
        if r.status_code >= 400:
            logger.error("Update %s falhou: %s %s", table, r.status_code, r.text[:200])
            r.raise_for_status()
        return r.json() if r.text else []

    def count(self, table: str, filters: dict[str, str] | None = None) -> int:
        """Conta linhas via header Content-Range (mais barato que select)."""
        headers = {**self.headers, "Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"}
        params: dict[str, Any] = {"select": "id"}
        if filters:
            params.update(filters)
        endpoint = f"{self.url}/rest/v1/{table}"
        r = requests.get(endpoint, headers=headers, params=params, timeout=self.timeout)
        if r.status_code >= 400:
            return 0
        cr = r.headers.get("Content-Range", "")
        if "/" in cr:
            try:
                return int(cr.split("/")[-1])
            except ValueError:
                pass
        return 0
