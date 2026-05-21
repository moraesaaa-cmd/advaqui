"""Geração de slugs únicos pra decisões de jurisprudência."""
from __future__ import annotations
import re
from .text_cleaner import deburr


_NONSLUG_RE = re.compile(r"[^a-z0-9]+")
_MULTIDASH_RE = re.compile(r"-+")
_PROCESS_NUM_RE = re.compile(r"\d{6,}")


def slugify(text: str, max_len: int = 80) -> str:
    """Converte texto em slug: lowercase, sem acentos, hífens em vez de
    espaços, sem caracteres especiais."""
    if not text:
        return ""
    text = deburr(text).lower()
    text = _NONSLUG_RE.sub("-", text)
    text = _MULTIDASH_RE.sub("-", text)
    text = text.strip("-")
    if len(text) > max_len:
        # Corta no último hífen antes do limite
        cut = text[:max_len]
        last_dash = cut.rfind("-")
        if last_dash > max_len * 0.6:
            cut = cut[:last_dash]
        text = cut
    return text


def build_slug(
    classe: str | None,
    numero: str | None,
    temas: list[str] | None,
    ementa: str | None,
) -> str:
    """Constrói slug curto e descritivo a partir de classe + número + temas.

    Exemplos:
      slug(REsp, 12345, [dano moral, banco]) → 'resp-12345-dano-moral-banco'
      slug(HC, 0001, [prisão preventiva]) → 'hc-0001-prisao-preventiva'
    """
    parts: list[str] = []
    if classe:
        parts.append(slugify(classe, max_len=20))
    if numero:
        # Pega só dígitos contíguos do número
        m = _PROCESS_NUM_RE.search(numero)
        if m:
            parts.append(m.group(0)[:12])
        else:
            parts.append(slugify(numero, max_len=20))
    if temas:
        # Pega os 2 primeiros temas
        for tema in temas[:2]:
            sl = slugify(tema, max_len=30)
            if sl:
                parts.append(sl)
    # Se ainda muito curto e tem ementa, pega palavras-chave dela
    if len(parts) < 2 and ementa:
        first_sentence = ementa.split(".")[0]
        parts.append(slugify(first_sentence, max_len=40))
    slug = "-".join(p for p in parts if p)
    return slug[:120] or "decisao"


def ensure_unique(slug: str, existing_slugs: set[str]) -> str:
    """Adiciona sufixo numérico se slug já existir."""
    if slug not in existing_slugs:
        return slug
    n = 2
    while f"{slug}-{n}" in existing_slugs:
        n += 1
        if n > 99:
            # Fallback random
            import random
            import string
            suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
            return f"{slug}-{suffix}"
    return f"{slug}-{n}"
