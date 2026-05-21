"""Coletor STJ.

STATUS: stub minimal. O portal scon.stj.jus.br tem API HTML pública mas
exige parser específico. Esta classe segue mesma estratégia do STFCollector
(delega pra fixtures até integração real).

Pra ativar coleta real:
  1. Definir endpoint de busca avançada SCON
  2. Implementar parser HTML
  3. Mapear campos → DecisaoBruta
  4. Validar com batch_size=5
"""
from __future__ import annotations
import logging
from .base import BaseCollector, DecisaoBruta


logger = logging.getLogger(__name__)


class STJCollector(BaseCollector):
    """Coletor STJ — esqueleto, ainda não conecta no portal real."""

    tribunal = "STJ"

    def __init__(self, contact_email: str, *, user_agent: str | None = None):
        self.contact_email = contact_email
        self.user_agent = user_agent or (
            f"advaqui.com jurisprudencia-bot ({contact_email})"
        )

    def collect(self, batch_size: int) -> list[DecisaoBruta]:
        logger.warning(
            "STJCollector.collect chamado com batch_size=%d, mas a integração real "
            "com scon.stj.jus.br ainda não está implementada. Usando modo fixtures "
            "em vez disso. Veja docs em scripts/jurisprudencia/README.md.",
            batch_size,
        )
        from .fixtures import FixturesCollector
        return FixturesCollector(tribunal="STJ").collect(batch_size)
