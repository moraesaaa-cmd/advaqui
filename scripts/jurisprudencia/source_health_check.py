#!/usr/bin/env python3
"""Checagem de saúde das fontes oficiais STF e STJ.

Faz HEAD/GET light nos endpoints públicos do STF e STJ, mede latência,
detecta bloqueio/timeout. Exit code 0 se ambos OK, 1 se algum falhou.

Uso:
  python3 source_health_check.py

Variáveis env:
  JURIS_HTTP_TIMEOUT      Timeout em segundos (default 20)
  JURIS_CONTACT_EMAIL     E-mail no User-Agent
"""
from __future__ import annotations

import logging
import os
import sys
import time
from typing import NamedTuple

import requests


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
logger = logging.getLogger("source_health")


class SourceCheck(NamedTuple):
    name: str
    url: str
    status: int
    latency_ms: int
    ok: bool
    message: str


SOURCES = [
    ("STF Portal", "https://portal.stf.jus.br/jurisprudencia/"),
    ("STJ SCON", "https://scon.stj.jus.br/SCON/"),
]


def check(name: str, url: str, timeout: float, ua: str) -> SourceCheck:
    headers = {"User-Agent": ua, "Accept": "text/html,application/xhtml+xml"}
    start = time.monotonic()
    try:
        # GET com stream=True + close para evitar baixar payload todo.
        # Alguns sites bloqueiam HEAD, por isso GET light.
        resp = requests.get(url, headers=headers, timeout=timeout, stream=True, allow_redirects=True)
        resp.close()
        latency_ms = int((time.monotonic() - start) * 1000)
        ok = 200 <= resp.status_code < 400
        msg = "OK" if ok else f"HTTP {resp.status_code}"
        return SourceCheck(name=name, url=url, status=resp.status_code, latency_ms=latency_ms, ok=ok, message=msg)
    except requests.exceptions.Timeout:
        latency_ms = int((time.monotonic() - start) * 1000)
        return SourceCheck(name=name, url=url, status=0, latency_ms=latency_ms, ok=False, message="timeout")
    except requests.exceptions.RequestException as e:
        latency_ms = int((time.monotonic() - start) * 1000)
        return SourceCheck(name=name, url=url, status=0, latency_ms=latency_ms, ok=False, message=f"erro: {type(e).__name__}")


def main() -> int:
    timeout = float(os.environ.get("JURIS_HTTP_TIMEOUT", "20"))
    contact = os.environ.get("JURIS_CONTACT_EMAIL", "contato@advaqui.com.br")
    ua = f"advaqui.com jurisprudencia-bot ({contact})"

    print("=" * 60)
    print("HEALTH CHECK — Fontes oficiais")
    print("=" * 60)

    results = []
    for name, url in SOURCES:
        c = check(name, url, timeout, ua)
        results.append(c)
        status_icon = "✓" if c.ok else "✗"
        print(f"{status_icon} {c.name:14s}  HTTP {c.status:3d}  {c.latency_ms:5d}ms  {c.message}")
        # Rate limit entre chamadas
        time.sleep(1.0)

    failed = [r for r in results if not r.ok]
    print()
    if failed:
        print(f"⚠ {len(failed)} fonte(s) com problema.")
        return 1
    print("✓ Todas as fontes respondendo normalmente.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
