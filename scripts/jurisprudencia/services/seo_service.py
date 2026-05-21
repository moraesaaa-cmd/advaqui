"""Geração de title e description SEO pra decisões."""
from __future__ import annotations
from .text_cleaner import truncate_for_seo, normalize_whitespace


def build_seo_title(
    tribunal: str,
    classe: str | None,
    numero: str | None,
    temas: list[str] | None,
) -> str:
    """Constrói title SEO no padrão:
       [Classe] [Número] — [tema principal] | Jurisprudência [Tribunal] | AdvAqui
    """
    parts: list[str] = []
    if classe and numero:
        # número é geralmente longo, pega só os dígitos contíguos
        n = numero.split("-")[0] if "-" in numero else numero
        parts.append(f"{classe} {n}".strip())
    elif classe:
        parts.append(classe)
    elif numero:
        parts.append(numero)

    if temas:
        # primeiro tema = mais relevante
        parts.append(temas[0].capitalize() if temas[0].islower() else temas[0])

    headline = " — ".join(parts) if parts else "Decisão"

    return truncate_for_seo(
        f"{headline} | Jurisprudência {tribunal} | AdvAqui",
        max_len=70,
    )


def build_seo_description(
    tribunal: str,
    classe: str | None,
    relator: str | None,
    temas: list[str] | None,
    ementa: str | None,
) -> str:
    """Description curta cobrindo classe + relator + ementa truncada."""
    parts: list[str] = []
    if classe:
        parts.append(f"Decisão {classe}")
    parts.append(f"do {tribunal}")
    if relator:
        parts.append(f"do relator {relator}")
    if temas:
        parts.append(f"sobre {', '.join(temas[:2])}")

    prefix = " ".join(parts).strip()
    base = (prefix + ". ") if prefix else ""

    if ementa:
        snippet = normalize_whitespace(ementa)[:200]
    else:
        snippet = "Consulte ementa, metadados e fonte oficial."
    return truncate_for_seo(base + snippet, max_len=160)


def build_h1(
    classe: str | None,
    numero: str | None,
    temas: list[str] | None,
) -> str:
    """H1 da página da decisão: '[Classe] [Número] — [tema principal]'."""
    parts: list[str] = []
    if classe and numero:
        n = numero.split("-")[0] if "-" in numero else numero
        parts.append(f"{classe} {n}".strip())
    elif classe:
        parts.append(classe)
    elif numero:
        parts.append(numero)
    if temas:
        parts.append(temas[0])
    return " — ".join(parts) if parts else "Decisão"
