"""Gerador de resumo informativo conservador para decisões do STJ.

PRINCÍPIO: zero alucinação. Sem LLM, sem conhecimento externo. Só regras
que extraem do texto oficial (ementa + tese + classe + órgão) o que está
LITERALMENTE lá.

Padrão de ementa do STJ — tipicamente segue formato:
  "DIREITO X. SUBDIREITO Y. INSTITUTO Z. ASPECTO W. 1. Narrativa fática.
   2. Argumentação. 3. Resultado. Recurso conhecido e provido."

Estratégia:
  - **Tema**: primeiras "partes" maiúsculas separadas por ponto até hit
    a primeira frase narrativa (com letra minúscula no início).
  - **Pontos relevantes**: partes maiúsculas curtas que parecem rotulares
    (até ~80 chars cada).
  - **Decisão**: trecho FINAL da ementa que contém o resultado processual
    ("Recurso provido", "Negado", "Conhecido em parte"...) extraído via
    regex de palavras-chave. Se nada disso aparece, NÃO inventa.
  - **Entendimento**: prefacia com "A ementa indica que..." e usa a primeira
    frase narrativa substantiva (item 1 numerado).

Versão: v1-ementa-metadados
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Iterable


__all__ = ["generate_jurisprudencia_summary", "SUMMARY_VERSION"]


SUMMARY_VERSION = "v1-ementa-metadados"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _split_parts(ementa: str) -> list[str]:
    """Quebra a ementa em partes pelo separador ponto-espaço."""
    if not ementa:
        return []
    # Normaliza espaços + quebras de linha
    s = re.sub(r"\s+", " ", ementa).strip()
    # Split por ponto que não está dentro de número (ex.: "Art. 312" não quebra)
    # Heurística: ponto seguido de espaço + letra maiúscula OU fim de string.
    parts = re.split(r"\.(?=\s+[A-ZÀ-Ý0-9])|\.\s*$", s)
    return [p.strip() for p in parts if p and p.strip()]


def _is_label_like(s: str) -> bool:
    """True se a parte parece um rótulo de tema (maiúscula curta)."""
    if not s or len(s) > 120:
        return False
    # Pelo menos uma letra
    if not re.search(r"[A-ZÀ-Ý]", s):
        return False
    # Pelo menos 70% das letras alfabéticas são maiúsculas
    letters = [c for c in s if c.isalpha()]
    if len(letters) < 3:
        return False
    upper = sum(1 for c in letters if c.isupper())
    return upper / len(letters) >= 0.7


_NUMBERED_RE = re.compile(r"^\s*(\d+)\s*[\.\)]\s*", re.MULTILINE)
# Resultado processual típico no STJ
_RESULTADO_RE = re.compile(
    r"\b("
    r"recurso\s+(especial\s+)?(parcialmente\s+)?(conhecido|provido|n[ãa]o\s+conhecido|n[ãa]o\s+provido|desprovido|prejudicado|improvido)"
    r"|agravo\s+(parcialmente\s+)?(conhecido|provido|n[ãa]o\s+conhecido|n[ãa]o\s+provido|desprovido|improvido|prejudicado|regimental\s+improvido)"
    r"|habeas[\s-]?corpus\s+(conhecido|n[ãa]o\s+conhecido|concedido|denegado|n[ãa]o\s+conhecido,\s+ordem\s+(de\s+of[íi]cio\s+)?(concedida|denegada))"
    r"|embargos\s+(acolhidos|rejeitados|providos|desprovidos)"
    r"|ordem\s+(de\s+of[íi]cio\s+)?(concedida|denegada|n[ãa]o\s+conhecida)"
    r"|mandado\s+de\s+seguran[çc]a\s+(concedido|denegado|n[ãa]o\s+conhecido)"
    r"|peti[çc][ãa]o\s+(rejeitada|indeferida)"
    r"|pedido\s+(julgado\s+)?(procedente|improcedente|prejudicado)"
    r"|negar\s+provimento|dar\s+provimento"
    r"|n[ãa]o[\s-]conhe(c|ç)imento"
    r")",
    re.IGNORECASE,
)


def _extract_resultado(ementa: str) -> str | None:
    """Procura um trecho final que indique o resultado processual.

    Retorna a frase exata da ementa, sem reescrever.
    """
    if not ementa:
        return None
    # Foca no terço final da ementa, onde o resultado costuma aparecer
    s = re.sub(r"\s+", " ", ementa).strip()
    tail_start = max(0, len(s) - 800)
    tail = s[tail_start:]
    m = _RESULTADO_RE.search(tail)
    if not m:
        return None
    # Pega 5 palavras antes + match + até próximo ponto final
    match_start = tail_start + m.start()
    match_end = tail_start + m.end()
    # Expande para frase completa
    sentence_start = match_start
    for i in range(match_start, max(0, match_start - 200), -1):
        if s[i] == "." and (i + 1 >= len(s) or s[i + 1] == " "):
            sentence_start = i + 1
            break
    sentence_end = match_end
    for i in range(match_end, min(len(s), match_end + 300)):
        if s[i] == ".":
            sentence_end = i + 1
            break
    return s[sentence_start:sentence_end].strip()


def _extract_numbered_items(ementa: str, max_items: int = 4) -> list[str]:
    """Extrai itens numerados (1., 2., 3....) da ementa do STJ.

    Retorna a lista de itens encontrados, podados pra max 250 chars cada.
    """
    if not ementa:
        return []
    s = re.sub(r"\s+", " ", ementa).strip()
    # Pega posições dos números no início de "frase"
    matches = list(re.finditer(r"\.\s+(\d+)\s*[\.\)]\s+([A-ZÀ-Ý])", s))
    if not matches:
        # Fallback: tenta no início da string sem ponto antes
        m0 = re.match(r"^\s*1\s*[\.\)]\s+", s)
        if not m0:
            return []
    items: list[str] = []
    starts = [m.start(2) for m in matches]
    starts = sorted(set(starts))
    for i, start in enumerate(starts):
        end = starts[i + 1] - 3 if i + 1 < len(starts) else len(s)
        chunk = s[start:end].strip().rstrip(".")
        # Remove eventual número final que ficou colado do próximo item
        chunk = re.sub(r"\s+\d+\s*$", "", chunk)
        if 20 < len(chunk) < 600:
            items.append(chunk[:280])
        if len(items) >= max_items:
            break
    return items


# ---------------------------------------------------------------------------
# Gerador principal
# ---------------------------------------------------------------------------
def generate_jurisprudencia_summary(decisao: dict) -> dict:
    """Gera o resumo informativo de uma decisão.

    Aceita um dict com chaves opcionais: ementa, tese, classe,
    orgao_julgador, relator.

    Retorna dict pronto pra UPDATE no banco:
      {
        'resumo_tema': str | None,
        'resumo_decisao': str | None,
        'resumo_entendimento': str | None,
        'resumo_pontos': list[str],
        'resumo_gerado_em': str (ISO),
        'resumo_versao': str,
        'resumo_status': 'gerado' | 'indisponivel' | 'erro',
      }
    """
    out = {
        "resumo_tema": None,
        "resumo_decisao": None,
        "resumo_entendimento": None,
        "resumo_pontos": [],
        "resumo_gerado_em": datetime.now(timezone.utc).isoformat(),
        "resumo_versao": SUMMARY_VERSION,
        "resumo_status": "indisponivel",
    }

    try:
        ementa = (decisao.get("ementa") or "").strip()
        tese = (decisao.get("tese") or "").strip()
        if not ementa or len(ementa) < 30:
            return out  # indisponivel — nada pra resumir

        parts = _split_parts(ementa)
        if not parts:
            return out

        # 1) Tema: pega rótulos consecutivos do início até primeira frase
        tema_parts: list[str] = []
        for p in parts[:8]:
            if _is_label_like(p):
                tema_parts.append(p.strip().rstrip("."))
            else:
                break
        if tema_parts:
            # Junta os 3 primeiros rótulos com " · "
            out["resumo_tema"] = " · ".join(tema_parts[:3])[:180]
            # Pontos relevantes: até 5 rótulos (inclui os do tema + extras)
            out["resumo_pontos"] = [t for t in tema_parts[:5]]

        # 2) Decisão: usar tese quando houver; caso contrário, resultado da ementa
        if tese and len(tese) > 20:
            # Tese vem do JSON oficial — apresentamos com prefixo claro
            tese_clean = re.sub(r"\s+", " ", tese).strip()
            out["resumo_decisao"] = (
                "Tese registrada nos dados oficiais: " + tese_clean[:280]
            )
        else:
            resultado = _extract_resultado(ementa)
            if resultado:
                out["resumo_decisao"] = (
                    "A ementa registra o seguinte resultado: " + resultado[:280]
                )

        # 3) Entendimento: primeira frase numerada (item 1) — ou primeira frase
        #    narrativa (não-rótulo) — sempre prefacida.
        numbered = _extract_numbered_items(ementa, max_items=4)
        if numbered:
            # Primeiro item numerado costuma descrever o "caso em exame"
            primeiro = numbered[0]
            out["resumo_entendimento"] = (
                "Segundo a ementa disponibilizada, "
                + primeiro[0].lower() + primeiro[1:]
            )[:400]
            # Adiciona até mais 3 itens nos pontos
            for it in numbered[1:4]:
                short = it[:140]
                if short not in out["resumo_pontos"]:
                    out["resumo_pontos"].append(short)
        else:
            # Fallback: primeira parte não-rótulo
            for p in parts[len(tema_parts):len(tema_parts) + 5]:
                if not _is_label_like(p) and len(p) > 40:
                    out["resumo_entendimento"] = (
                        "Segundo a ementa disponibilizada, "
                        + p[0].lower() + p[1:]
                    )[:400]
                    break

        # Limita pontos a 5
        if out["resumo_pontos"]:
            out["resumo_pontos"] = list(dict.fromkeys(out["resumo_pontos"]))[:5]

        # Status final
        if out["resumo_tema"] or out["resumo_entendimento"] or out["resumo_decisao"]:
            out["resumo_status"] = "gerado"
        else:
            out["resumo_status"] = "indisponivel"

        return out

    except Exception:
        # Nunca quebra o pipeline da coleta. Erro fica registrado.
        out["resumo_status"] = "erro"
        return out


# ---------------------------------------------------------------------------
# Resumo curto para listagem (não vai pro banco — calculado on-the-fly se
# necessário, mas o ideal é usar resumo_tema + resumo_decisao)
# ---------------------------------------------------------------------------
def short_card_text(decisao_row: dict, max_chars: int = 280) -> str:
    """Devolve resumo curto pra usar em card de listagem.

    Prioriza resumo_decisao → resumo_entendimento → ementa truncada.
    """
    for key in ("resumo_decisao", "resumo_entendimento"):
        v = decisao_row.get(key)
        if v and isinstance(v, str) and len(v.strip()) > 20:
            return v.strip()[:max_chars]
    ementa = decisao_row.get("ementa") or ""
    return ementa.strip()[:max_chars]
