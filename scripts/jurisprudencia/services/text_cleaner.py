"""Limpeza/normalização de texto pra ementas e títulos."""
from __future__ import annotations
import re
import unicodedata


_WHITESPACE_RE = re.compile(r"\s+")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_HTML_ENTITY_RE = re.compile(r"&[a-z]+;|&#\d+;")


def strip_html(text: str) -> str:
    """Remove tags HTML básicas e entidades."""
    if not text:
        return ""
    text = _HTML_TAG_RE.sub(" ", text)
    text = _HTML_ENTITY_RE.sub(" ", text)
    return text


def normalize_whitespace(text: str) -> str:
    """Colapsa múltiplos espaços/quebras em espaço simples e tira bordas."""
    if not text:
        return ""
    return _WHITESPACE_RE.sub(" ", text).strip()


def clean_ementa(text: str) -> str:
    """Limpa texto de ementa: remove HTML, normaliza espaços, preserva quebras
    de parágrafo importantes."""
    if not text:
        return ""
    text = strip_html(text)
    # Preserva quebras duplas como separação de parágrafo
    text = re.sub(r"\n{2,}", "\n\n", text)
    # Normaliza espaços por linha sem perder a estrutura
    lines = [normalize_whitespace(line) for line in text.split("\n")]
    return "\n".join(line for line in lines if line).strip()


def deburr(text: str) -> str:
    """Remove acentos (NFKD)."""
    if not text:
        return ""
    return "".join(
        c for c in unicodedata.normalize("NFKD", text)
        if not unicodedata.combining(c)
    )


def truncate_for_seo(text: str, max_len: int = 160) -> str:
    """Trunca em até max_len chars, cortando em palavra inteira e
    adicionando reticências."""
    if not text:
        return ""
    if len(text) <= max_len:
        return text
    cut = text[: max_len - 1]
    last_space = cut.rfind(" ")
    if last_space > max_len * 0.6:
        cut = cut[:last_space]
    return cut.rstrip(",.;:- ") + "…"
