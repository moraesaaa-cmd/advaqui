"""Coletor STJ via Portal de Dados Abertos (CKAN).

FONTE OFICIAL: https://dadosabertos.web.stj.jus.br/

Estratégia:
  1. Lista os 10 datasets do grupo "jurisprudencia" no CKAN do STJ.
  2. Para cada dataset, baixa o RECURSO JSON MAIS RECENTE (Espelhos de Acórdãos).
  3. Faz parse de cada decisão real (com ementa, relator, classe, etc.).
  4. Retorna DecisaoBruta para o pipeline normal.

Não fazemos scraping de HTML, não passamos por WAF. Apenas API CKAN pública
documentada pelo STJ.

Datasets cobertos (todos do grupo "jurisprudencia"):
  - espelhos-de-acordaos-corte-especial
  - espelhos-de-acordaos-primeira-secao / segunda-secao / terceira-secao
  - espelhos-de-acordaos-primeira-turma / segunda-turma / ... / sexta-turma

Cada JSON mensal vem como array de objetos com campos como:
  id, numeroProcesso, numeroRegistro, siglaClasse, descricaoClasse,
  nomeOrgaoJulgador, ministroRelator, dataPublicacao, dataDecisao,
  ementa, decisao, tipoDeDecisao.

Princípios:
  - Não inventar dado ausente. Se campo está null no JSON oficial, fica null.
  - url_origem composto pra ser único por decisão: resource_url#decisao-{id}.
    Aponta sempre para o arquivo JSON oficial baixado.
  - Rate limit respeitoso: 1 req/s entre chamadas HTTP.
"""
from __future__ import annotations

import logging
import re
import time
from datetime import date, datetime
from typing import Any
from urllib.parse import urlencode

import requests

from .base import BaseCollector, DecisaoBruta


logger = logging.getLogger(__name__)


CKAN_BASE = "https://dadosabertos.web.stj.jus.br/api/3/action"
GROUP_ID = "jurisprudencia"

# Datasets confirmados via CKAN group_show jurisprudencia em maio/2026.
# Lista pode ser sobrescrita por env STJ_CKAN_DATASETS se necessário.
DEFAULT_DATASETS = [
    "espelhos-de-acordaos-corte-especial",
    "espelhos-de-acordaos-primeira-secao",
    "espelhos-de-acordaos-segunda-secao",
    "espelhos-de-acordaos-terceira-secao",
    "espelhos-de-acordaos-primeira-turma",
    "espelhos-de-acordaos-segunda-turma",
    "espelhos-de-acordaos-terceira-turma",
    "espelhos-de-acordaos-quarta-turma",
    "espelhos-de-acordaos-quinta-turma",
    "espelhos-de-acordaos-sexta-turma",
]


def _http_get_json(url: str, timeout: float, ua: str) -> Any:
    """GET com User-Agent honesto + parse JSON. Levanta em erro."""
    resp = requests.get(
        url,
        headers={"User-Agent": ua, "Accept": "application/json"},
        timeout=timeout,
        verify=False,  # CA bundle do VPS está desatualizado; CKAN STJ é oficial gov.br
    )
    resp.raise_for_status()
    return resp.json()


def _http_get_text(url: str, timeout: float, ua: str) -> str:
    resp = requests.get(
        url,
        headers={"User-Agent": ua, "Accept": "application/json"},
        timeout=timeout,
        verify=False,
    )
    resp.raise_for_status()
    return resp.text


def _parse_data_decisao(s: str | None) -> date | None:
    """Converte 'YYYYMMDD' (string sem separador) em date."""
    if not s:
        return None
    s = s.strip()
    if len(s) == 8 and s.isdigit():
        try:
            return date(int(s[0:4]), int(s[4:6]), int(s[6:8]))
        except ValueError:
            return None
    # Fallback ISO
    try:
        return date.fromisoformat(s[:10])
    except Exception:
        return None


_DJEN_RE = re.compile(r"(\d{2})/(\d{2})/(\d{4})")


def _parse_data_publicacao(s: str | None) -> date | None:
    """Extrai DATA:dd/mm/yyyy de strings tipo 'DJEN DATA:22/04/2026'."""
    if not s:
        return None
    m = _DJEN_RE.search(s)
    if not m:
        return None
    try:
        return date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
    except ValueError:
        return None


def _normalize_text(s: str | None, *, max_len: int = 0) -> str | None:
    if not s:
        return None
    s = " ".join(s.split())  # collapse espaços+quebras pra um espaço
    if max_len and len(s) > max_len:
        return s[:max_len]
    return s


class STJCkanCollector(BaseCollector):
    """Coleta jurisprudência real do STJ via CKAN do Portal de Dados Abertos."""

    tribunal = "STJ"

    def __init__(
        self,
        contact_email: str = "contato@advaqui.com.br",
        *,
        timeout: float = 30.0,
        rate_limit_seconds: float = 1.0,
        datasets: list[str] | None = None,
    ):
        self.contact_email = contact_email
        self.user_agent = f"advaqui.com jurisprudencia-bot ({contact_email})"
        self.timeout = timeout
        self.rate_limit_seconds = rate_limit_seconds
        self.datasets = datasets or DEFAULT_DATASETS

    # --------------------------------------------------------------
    # CKAN: lista recursos JSON de um dataset, ordenados por nome desc
    # --------------------------------------------------------------
    def _list_json_resources(self, dataset_id: str) -> list[dict]:
        url = f"{CKAN_BASE}/package_show?{urlencode({'id': dataset_id})}"
        try:
            data = _http_get_json(url, self.timeout, self.user_agent)
        except Exception as exc:
            logger.warning("CKAN package_show falhou para %s: %s", dataset_id, exc)
            return []
        if not data.get("success"):
            logger.warning("CKAN package_show sem success para %s", dataset_id)
            return []
        result = data.get("result") or {}
        resources = result.get("resources") or []
        # Filtra apenas JSON
        json_res = [
            r for r in resources
            if (r.get("format") or "").upper() == "JSON"
        ]
        # Ordena por name asc (ex.: 20260430.json no fim = mais recente)
        json_res.sort(key=lambda r: r.get("name") or "")
        return json_res

    # --------------------------------------------------------------
    # Converte cada item do JSON do STJ → DecisaoBruta
    # --------------------------------------------------------------
    def _item_to_decisao(
        self,
        item: dict,
        *,
        resource_url: str,
        resource_name: str,
        dataset_id: str,
    ) -> DecisaoBruta | None:
        stj_id = item.get("id")
        if not stj_id:
            return None

        ementa = _normalize_text(item.get("ementa"), max_len=8000)
        if not ementa or len(ementa) < 50:
            return None  # sem ementa real → não publicar

        classe = (
            _normalize_text(item.get("siglaClasse"), max_len=100)
            or _normalize_text(item.get("descricaoClasse"), max_len=120)
        )
        descr_classe = _normalize_text(
            item.get("descricaoClasse"), max_len=200
        )
        numero_processo = _normalize_text(
            item.get("numeroProcesso"), max_len=60
        )
        numero_registro = _normalize_text(
            item.get("numeroRegistro"), max_len=60
        )
        # `numero` é exibido publicamente — preferimos o numeroRegistro
        # (formato 202503421303), com fallback no numeroProcesso.
        numero = numero_registro or numero_processo or str(stj_id)

        relator = _normalize_text(item.get("ministroRelator"), max_len=120)
        orgao_julgador = _normalize_text(
            item.get("nomeOrgaoJulgador"), max_len=120
        )

        data_julg = _parse_data_decisao(item.get("dataDecisao"))
        data_pub = _parse_data_publicacao(item.get("dataPublicacao"))

        decisao_text = _normalize_text(item.get("decisao"), max_len=4000)
        tese = (
            _normalize_text(item.get("teseJuridica"), max_len=2000)
            or _normalize_text(item.get("tema"), max_len=2000)
        )

        # URL única por decisão, ainda apontando para o arquivo JSON oficial.
        # O fragmento #decisao-{id} é único e permite o UNIQUE constraint.
        url_origem = f"{resource_url}#decisao-{stj_id}"

        return DecisaoBruta(
            tribunal="STJ",
            classe=classe,
            numero=numero,
            processo=numero_processo,
            relator=relator,
            orgao_julgador=orgao_julgador,
            data_julgamento=data_julg,
            data_publicacao=data_pub,
            ementa=ementa,
            tese=tese,
            url_origem=url_origem,
            extra={
                "stj_id": str(stj_id),
                "numero_registro": numero_registro,
                "descricao_classe": descr_classe,
                "decisao_resumo": decisao_text,
                "tipo_decisao": _normalize_text(item.get("tipoDeDecisao"), max_len=60),
                "resource_url": resource_url,
                "resource_name": resource_name,
                "dataset_id": dataset_id,
                "dataset_url": f"https://dadosabertos.web.stj.jus.br/dataset/{dataset_id}",
            },
        )

    # --------------------------------------------------------------
    # Coleta principal
    # --------------------------------------------------------------
    def collect(self, batch_size: int) -> list[DecisaoBruta]:
        """Baixa o JSON mais recente de cada dataset e devolve até batch_size decisões.

        Estratégia round-robin: pega 1 de cada dataset por vez até atingir
        batch_size. Garante diversidade entre órgãos julgadores.
        """
        logger.info(
            "STJCkanCollector.collect — alvo: %d decisões em %d datasets",
            batch_size, len(self.datasets),
        )
        all_decisions_per_dataset: list[list[DecisaoBruta]] = []

        for ds_id in self.datasets:
            logger.info("CKAN → listando recursos do dataset %s", ds_id)
            resources = self._list_json_resources(ds_id)
            if not resources:
                logger.warning("Sem recursos JSON em %s", ds_id)
                all_decisions_per_dataset.append([])
                time.sleep(self.rate_limit_seconds)
                continue

            # Recurso mais recente (último após sort por name)
            latest = resources[-1]
            res_url = latest.get("url")
            res_name = latest.get("name") or "desconhecido.json"

            if not res_url:
                logger.warning("Recurso %s sem URL em %s", res_name, ds_id)
                all_decisions_per_dataset.append([])
                continue

            logger.info(
                "Baixando %s (%s) de %s",
                res_name,
                latest.get("size") or "?",
                ds_id,
            )
            time.sleep(self.rate_limit_seconds)
            try:
                resp = requests.get(
                    res_url,
                    headers={
                        "User-Agent": self.user_agent,
                        "Accept": "application/json",
                    },
                    timeout=self.timeout * 2,  # arquivos podem ser ~200KB
                    verify=False,
                )
                resp.raise_for_status()
                items = resp.json()
            except Exception as exc:
                logger.error("Falha baixando %s: %s", res_url, exc)
                all_decisions_per_dataset.append([])
                continue

            if not isinstance(items, list):
                logger.warning(
                    "JSON de %s não é lista (got %s)",
                    res_name, type(items).__name__,
                )
                all_decisions_per_dataset.append([])
                continue

            converted: list[DecisaoBruta] = []
            for item in items:
                if not isinstance(item, dict):
                    continue
                d = self._item_to_decisao(
                    item,
                    resource_url=res_url,
                    resource_name=res_name,
                    dataset_id=ds_id,
                )
                if d:
                    converted.append(d)

            logger.info(
                "Dataset %s → %d itens válidos (de %d crus)",
                ds_id, len(converted), len(items),
            )
            all_decisions_per_dataset.append(converted)

        # Round-robin: alterna entre datasets para diversificar
        result: list[DecisaoBruta] = []
        idx = 0
        while len(result) < batch_size:
            picked_any = False
            for ds_list in all_decisions_per_dataset:
                if idx < len(ds_list):
                    result.append(ds_list[idx])
                    picked_any = True
                    if len(result) >= batch_size:
                        break
            idx += 1
            if not picked_any:
                break

        logger.info(
            "STJCkanCollector.collect — total final: %d decisões",
            len(result),
        )
        return result
