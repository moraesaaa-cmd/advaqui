"""Coletor STF — endpoint Elasticsearch interno da SPA jurisprudencia.stf.jus.br.

Endpoint mapeado em F21 (2026-05-22) inspecionando a página real:
  POST https://jurisprudencia.stf.jus.br/api/search/search?index=acordaos
  Headers: Content-Type: application/json
  Body Elasticsearch puro: { query: {...}, size, from }
  Response: { result: { hits: { hits: [ { _id, _source: {...} } ], total: {value, relation} } } }

Não é endpoint oficialmente documentado, mas é o caminho usado pelo próprio
frontend público do STF (https://jurisprudencia.stf.jus.br/pages/search?base=acordaos)
e pelos pacotes R `courtsbr/stf` e `jjesusfilho/stf`. Respeitamos:
  - User-Agent identificável com contato
  - Rate limit (delay entre requests)
  - Sem persistir HTML cru gigante
  - Apenas ementas e metadados
  - Sempre incluir link pra fonte oficial

Schema dos campos _source (capturado em prod):
  id (sjur254711), titulo, ministro_facet[], processo_codigo_completo,
  processo_numero, processo_classe_processual_unificada_sigla,
  processo_classe_processual_unificada_extenso, relator_processo_nome,
  relator_acordao_nome, orgao_julgador, julgamento_data, publicacao_data,
  republicacao_data, ementa_texto, inteiro_teor_url, acompanhamento_processual_url,
  dje_url, base
"""
from __future__ import annotations

import logging
import time
import urllib3
from datetime import date, datetime
from typing import Any

import requests

from .base import BaseCollector, DecisaoBruta

logger = logging.getLogger(__name__)

# SSL do STF tem chain incompleta no VPS Ubuntu 24.04 — desabilita warning ruidoso
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

STF_API_BASE = "https://jurisprudencia.stf.jus.br/api/search/search"
STF_INDEX = "acordaos"
STF_PUBLIC_PAGE = "https://jurisprudencia.stf.jus.br/pages/search?base=acordaos"

# Limites pra não pesar no servidor STF
PAGE_SIZE = 25  # máximo recomendado por request
DELAY_BETWEEN_PAGES = 2.0  # segundos
REQUEST_TIMEOUT = 30
MAX_RETRIES = 3


def _parse_date(value: Any) -> date | None:
    """Aceita 'YYYY-MM-DD' ou 'DD/MM/YYYY' ou ISO. Retorna None se inválido."""
    if not value or not isinstance(value, str):
        return None
    s = value.strip()
    if not s:
        return None
    # Tenta ISO primeiro
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00")).date()
    except (ValueError, TypeError):
        pass
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(s[: len(fmt)], fmt).date()
        except (ValueError, TypeError):
            continue
    return None


def _first_non_empty(*values: Any) -> str | None:
    """Retorna a primeira string não-vazia, ou None."""
    for v in values:
        if isinstance(v, str) and v.strip():
            return v.strip()
        if isinstance(v, list) and v:
            for item in v:
                if isinstance(item, str) and item.strip():
                    return item.strip()
    return None


def _build_query(query_string: str = "*") -> dict[str, Any]:
    """Monta a query Elasticsearch. Default: tudo."""
    if not query_string or query_string == "*":
        return {"match_all": {}}
    return {
        "query_string": {
            "query": query_string,
            "default_operator": "AND",
        }
    }


class STFCollector(BaseCollector):
    """Coletor real do STF via Elasticsearch interno da SPA pública."""

    tribunal = "STF"

    def __init__(
        self,
        contact_email: str,
        *,
        user_agent: str | None = None,
        query: str = "*",
        verify_ssl: bool = False,
    ) -> None:
        self.contact_email = contact_email
        self.user_agent = user_agent or (
            f"advaqui.com jurisprudencia-bot ({contact_email})"
        )
        self.query = query
        self.verify_ssl = verify_ssl
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": self.user_agent,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://jurisprudencia.stf.jus.br",
            "Referer": "https://jurisprudencia.stf.jus.br/pages/search?base=acordaos",
        })

    def _post(self, body: dict[str, Any]) -> dict[str, Any] | None:
        """POST no Elasticsearch interno com retries."""
        url = f"{STF_API_BASE}?index={STF_INDEX}"
        last_exc: Exception | None = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = self.session.post(
                    url,
                    json=body,
                    timeout=REQUEST_TIMEOUT,
                    verify=self.verify_ssl,
                )
                if resp.status_code == 200:
                    return resp.json()
                if resp.status_code in (502, 503, 504):
                    logger.warning(
                        "STF API %d (tentativa %d/%d): %s",
                        resp.status_code, attempt, MAX_RETRIES,
                        resp.text[:200],
                    )
                    time.sleep(attempt * 3)
                    continue
                logger.error(
                    "STF API status inesperado %d: %s",
                    resp.status_code, resp.text[:300],
                )
                return None
            except (requests.RequestException, ValueError) as exc:
                last_exc = exc
                logger.warning(
                    "STF API erro (tentativa %d/%d): %s",
                    attempt, MAX_RETRIES, exc,
                )
                time.sleep(attempt * 2)
        if last_exc:
            logger.error("STF API falhou após %d tentativas: %s", MAX_RETRIES, last_exc)
        return None

    def _hit_to_decisao(self, hit: dict[str, Any]) -> DecisaoBruta | None:
        """Converte hit Elasticsearch em DecisaoBruta. Retorna None se inválido."""
        src = hit.get("_source") or {}
        hit_id = hit.get("_id") or src.get("id")
        if not hit_id:
            return None

        ementa = (src.get("ementa_texto") or "").strip()
        if len(ementa) < 30:
            # Sem ementa real — descarta antes de virar lixo
            return None

        classe = _first_non_empty(
            src.get("processo_classe_processual_unificada_sigla"),
            src.get("processo_classe_processual_unificada_extenso"),
        )
        numero = _first_non_empty(
            src.get("processo_codigo_completo"),
            str(src.get("processo_numero")) if src.get("processo_numero") else None,
        )
        if not numero:
            return None

        relator = _first_non_empty(
            src.get("relator_acordao_nome"),
            src.get("relator_processo_nome"),
            src.get("ministro_facet"),
        )

        orgao = _first_non_empty(src.get("orgao_julgador"))
        data_julg = _parse_date(src.get("julgamento_data"))
        data_pub = _parse_date(src.get("publicacao_data")) or _parse_date(
            src.get("republicacao_data")
        )

        # URL oficial da decisão — preferir inteiro teor, fallback acompanhamento
        url_origem = _first_non_empty(
            src.get("inteiro_teor_url"),
            src.get("acompanhamento_processual_url"),
        )
        if not url_origem:
            # Construir URL canônica do portal STF
            url_origem = (
                f"https://jurisprudencia.stf.jus.br/pages/search/{hit_id}/false"
            )

        # Extras pra source_portal/dataset_url
        extra: dict[str, Any] = {
            "stf_id": hit_id,
            "source_portal": "Portal de Jurisprudência do STF",
            "dataset_name": "Acórdãos STF",
            "dataset_url": STF_PUBLIC_PAGE,
            "resource_name": hit_id,
            "resource_url": url_origem,
            "source_format": "JSON (Elasticsearch interno)",
        }
        if src.get("dje_url"):
            extra["dje_url"] = src["dje_url"]
        # Limpa keys None
        extra = {k: v for k, v in extra.items() if v}

        return DecisaoBruta(
            tribunal="STF",
            classe=classe,
            numero=numero,
            processo=numero,
            relator=relator,
            orgao_julgador=orgao,
            data_julgamento=data_julg,
            data_publicacao=data_pub,
            ementa=ementa,
            tese=None,
            url_origem=url_origem,
            inteiro_teor_opcional=None,  # NÃO persistimos inteiro teor em massa
            extra=extra,
        )

    def collect(self, batch_size: int) -> list[DecisaoBruta]:
        """Coleta até `batch_size` decisões.

        Paginar de PAGE_SIZE em PAGE_SIZE com delay. Não tenta mais que
        o necessário pra fechar o batch_size.
        """
        coletadas: list[DecisaoBruta] = []
        from_offset = 0
        query_es = _build_query(self.query)

        while len(coletadas) < batch_size:
            remaining = batch_size - len(coletadas)
            page_size = min(PAGE_SIZE, remaining)
            body = {
                "query": query_es,
                "size": page_size,
                "from": from_offset,
            }
            logger.info(
                "STF: buscando from=%d size=%d (já coletadas=%d / batch=%d)",
                from_offset, page_size, len(coletadas), batch_size,
            )
            response = self._post(body)
            if not response:
                logger.error("STF: response vazia, encerrando paginação")
                break
            # Wrapper {"result": {"hits": {...}}}
            result = response.get("result") or {}
            hits_obj = result.get("hits") or {}
            hits = hits_obj.get("hits") or []
            if not hits:
                logger.info("STF: sem mais hits, encerrando")
                break

            for hit in hits:
                d = self._hit_to_decisao(hit)
                if d:
                    coletadas.append(d)

            from_offset += page_size
            # ES pode limitar from + size <= 10000 (window default)
            if from_offset >= 10000:
                logger.info("STF: limite ES window (10000), encerrando paginação")
                break

            # Rate limit
            time.sleep(DELAY_BETWEEN_PAGES)

        logger.info("STF: coleta finalizada — %d decisões válidas", len(coletadas))
        return coletadas
