"""Coletor STF.

STATUS: stub minimal. O portal de jurisprudência do STF muda com frequência
e exige parser HTML específico que pode quebrar sem aviso. Esta classe
implementa a interface mas retorna lista vazia (com log) até ser ativada
e ajustada por trabalho específico.

Pra ativar coleta real:
  1. Definir endpoint inicial (busca pública do STF)
  2. Implementar parser HTML com BeautifulSoup
  3. Mapear campos → DecisaoBruta
  4. Testar com batch_size pequeno (5) antes de ampliar
  5. Adicionar testes regressivos no portal alvo
"""
from __future__ import annotations
import logging
from .base import BaseCollector, DecisaoBruta


logger = logging.getLogger(__name__)


class STFCollector(BaseCollector):
    """Coletor STF — esqueleto, ainda não conecta no portal real."""

    tribunal = "STF"

    def __init__(self, contact_email: str, *, user_agent: str | None = None):
        self.contact_email = contact_email
        self.user_agent = user_agent or (
            f"advaqui.com jurisprudencia-bot ({contact_email})"
        )

    def collect(self, batch_size: int) -> list[DecisaoBruta]:
        logger.warning(
            "STFCollector.collect chamado com batch_size=%d, mas a integração real "
            "com portal.stf.jus.br ainda não está implementada. "
            "Retornando lista vazia (seguro pra produção). "
            "Veja docs em scripts/jurisprudencia/README.md.",
            batch_size,
        )
        # IMPORTANTE: NÃO delegar pra fixtures aqui. Em produção (JURIS_MODE=real),
        # delegar pra fixtures geraria dados falsos com AMOSTRA/example.invalid.
        # Retornamos lista vazia até o coletor real ser implementado.
        return []
