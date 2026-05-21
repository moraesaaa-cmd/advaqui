#!/usr/bin/env python3
"""Valida /sitemap-jurisprudencia.xml.

Faz GET no sitemap, parseia URLs, verifica:
  - HTTP 200 do próprio sitemap
  - cada URL retorna 200 (amostragem: até 10 aleatórias)
  - cada URL não contém 'fixture' / 'AMOSTRA' / 'example.invalid'

Exit code 0 se OK, 1 se encontrou problema.

Uso:
  python3 sitemap_validator.py

Env:
  SITE_BASE_URL (default https://advaqui.com)
  JURIS_HTTP_TIMEOUT
"""
from __future__ import annotations

import logging
import os
import random
import re
import sys
import time

import requests


try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("sitemap_validator")

BANNED_TOKENS = ("fixture", "amostra", "example.invalid", "lorem-ipsum")


def main() -> int:
    base = os.environ.get("SITE_BASE_URL", "https://advaqui.com").rstrip("/")
    timeout = float(os.environ.get("JURIS_HTTP_TIMEOUT", "20"))
    sitemap_url = f"{base}/sitemap-jurisprudencia.xml"
    ua = "advaqui.com sitemap-validator"

    print("=" * 60)
    print("SITEMAP VALIDATOR — /sitemap-jurisprudencia.xml")
    print("=" * 60)
    print(f"URL: {sitemap_url}")
    print()

    problems: list[str] = []

    try:
        r = requests.get(sitemap_url, headers={"User-Agent": ua}, timeout=timeout)
    except requests.exceptions.RequestException as e:
        print(f"✗ Sitemap inacessível: {type(e).__name__}")
        return 1

    if r.status_code != 200:
        print(f"✗ Sitemap retornou HTTP {r.status_code}")
        return 1
    print(f"✓ Sitemap OK ({len(r.content)} bytes)")

    # Extrai <loc> com regex simples — evita dependência de lxml extra
    locs = re.findall(r"<loc>([^<]+)</loc>", r.text or "")
    print(f"URLs no sitemap:    {len(locs)}")
    if not locs:
        print("⚠ Sitemap vazio — esperado se módulo está sem dados reais.")
        return 0

    # Verifica tokens proibidos
    banned_in_loc = [u for u in locs if any(t in u.lower() for t in BANNED_TOKENS)]
    if banned_in_loc:
        problems.append(
            f"{len(banned_in_loc)} URL(s) contêm tokens proibidos (fixture/amostra/etc): "
            + ", ".join(banned_in_loc[:5])
        )

    # Amostragem de até 10 URLs pra checar HTTP 200
    sample = random.sample(locs, min(10, len(locs)))
    print(f"Amostragem HTTP:    checando {len(sample)} URLs...")
    bad_status: list[tuple[str, int]] = []
    for u in sample:
        try:
            head = requests.get(
                u,
                headers={"User-Agent": ua},
                timeout=timeout,
                allow_redirects=True,
                stream=True,
            )
            head.close()
            if head.status_code != 200:
                bad_status.append((u, head.status_code))
        except requests.exceptions.RequestException:
            bad_status.append((u, 0))
        time.sleep(0.5)

    if bad_status:
        problems.append(
            f"{len(bad_status)} URL(s) não retornam 200: "
            + ", ".join(f"{u} → {s}" for u, s in bad_status[:5])
        )

    print()
    if problems:
        print("⚠ Problemas encontrados:")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("✓ Sitemap válido.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
