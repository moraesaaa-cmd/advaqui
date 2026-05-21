"""Extração simples de temas e palavras-chave a partir da ementa."""
from __future__ import annotations
import re
from .text_cleaner import deburr, normalize_whitespace


# Dicionário curado de temas jurídicos comuns mapeados pra área relacionada.
# Cada chave é o termo de match (sem acentos, lowercase) → (label, area).
TEMA_DICT: dict[str, tuple[str, str]] = {
    "dano moral": ("dano moral", "Direito Civil"),
    "in re ipsa": ("dano moral", "Direito Civil"),
    "plano de saude": ("plano de saúde", "Direito do Consumidor"),
    "negativa de cobertura": ("plano de saúde", "Direito do Consumidor"),
    "negativacao indevida": ("negativação indevida", "Direito do Consumidor"),
    "cadastro de inadimplentes": ("cadastro de inadimplentes", "Direito do Consumidor"),
    "spc serasa": ("cadastro de inadimplentes", "Direito do Consumidor"),
    "prisao preventiva": ("prisão preventiva", "Direito Criminal"),
    "habeas corpus": ("habeas corpus", "Direito Criminal"),
    "trafico de drogas": ("tráfico de drogas", "Direito Criminal"),
    "tribunal do juri": ("tribunal do júri", "Direito Criminal"),
    "pensao alimenticia": ("pensão alimentícia", "Direito de Família"),
    "guarda compartilhada": ("guarda compartilhada", "Direito de Família"),
    "divorcio": ("divórcio", "Direito de Família"),
    "inventario": ("inventário", "Direito de Família"),
    "aposentadoria": ("aposentadoria", "Direito Previdenciário"),
    "auxilio doenca": ("auxílio-doença", "Direito Previdenciário"),
    "beneficio do inss": ("benefício do INSS", "Direito Previdenciário"),
    "bpc loas": ("BPC/LOAS", "Direito Previdenciário"),
    "rescisao indireta": ("rescisão indireta", "Direito Trabalhista"),
    "horas extras": ("horas extras", "Direito Trabalhista"),
    "vinculo empregaticio": ("vínculo empregatício", "Direito Trabalhista"),
    "execucao fiscal": ("execução fiscal", "Direito Tributário"),
    "icms": ("ICMS", "Direito Tributário"),
    "pis cofins": ("PIS/COFINS", "Direito Tributário"),
    "prescricao": ("prescrição", "Direito Civil"),
    "improbidade": ("improbidade administrativa", "Direito Administrativo"),
    "concurso publico": ("concurso público", "Direito Administrativo"),
    "servidor publico": ("servidor público", "Direito Administrativo"),
    "repercussao geral": ("repercussão geral", "Constitucional"),
    "recurso especial": ("recurso especial", "Processo Civil"),
    "agravo interno": ("agravo interno", "Processo Civil"),
}


def extract_topics(ementa: str, tese: str | None = None) -> tuple[list[str], list[str], str | None]:
    """Extrai temas, palavras-chave e área relacionada da ementa+tese.

    Retorna (temas, palavras_chave, area_relacionada).
    """
    if not ementa:
        return [], [], None

    haystack = deburr((ementa + " " + (tese or "")).lower())
    haystack = normalize_whitespace(haystack)

    temas: list[str] = []
    areas: dict[str, int] = {}
    palavras: list[str] = []

    for term, (label, area) in TEMA_DICT.items():
        if term in haystack:
            if label not in temas:
                temas.append(label)
            areas[area] = areas.get(area, 0) + 1
            palavras.append(term)

    # Limita pra não inflar
    temas = temas[:5]
    palavras = list(dict.fromkeys(palavras))[:8]

    area_principal: str | None = None
    if areas:
        # Pega a área com mais matches
        area_principal = max(areas.items(), key=lambda x: x[1])[0]

    return temas, palavras, area_principal


def compute_content_hash(ementa: str, classe: str | None, numero: str | None) -> str:
    """Hash determinístico do conteúdo essencial pra detectar duplicatas."""
    import hashlib
    base = f"{classe or ''}|{numero or ''}|{normalize_whitespace(ementa)}"
    return hashlib.sha256(base.encode("utf-8")).hexdigest()
