"""Interface base pros coletores de jurisprudência."""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date


@dataclass
class DecisaoBruta:
    """Representação intermediária de uma decisão coletada (antes de salvar).

    Os coletores específicos (STF, STJ, fixtures) produzem instâncias dessa
    classe. O orquestrador (main.py) converte pra payload Supabase.
    """
    tribunal: str                                 # 'STF' ou 'STJ'
    classe: str | None = None
    numero: str = ""
    processo: str | None = None
    relator: str | None = None
    orgao_julgador: str | None = None
    data_julgamento: date | None = None
    data_publicacao: date | None = None
    ementa: str = ""
    tese: str | None = None
    url_origem: str = ""
    # Inteiro teor opcional — se vier, vai pro CACHE, não pra decisões
    inteiro_teor_opcional: str | None = field(default=None, repr=False)


class BaseCollector(ABC):
    """Interface de um coletor. Implementações precisam definir `collect()`."""

    tribunal: str = ""

    @abstractmethod
    def collect(self, batch_size: int) -> list[DecisaoBruta]:
        """Retorna até `batch_size` decisões da fonte.

        Implementações devem respeitar rate limit, robots.txt e tratar erros
        sem levantar exceções catastróficas (retornar lista parcial).
        """
        raise NotImplementedError
