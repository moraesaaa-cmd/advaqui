"""Coletor de fixtures — gera decisões sintéticas locais.

Útil pra:
  • Validar pipeline ponta-a-ponta sem chamar STF/STJ
  • Rodar em dev/staging sem rede
  • Testar parsers/normalização

Cada chamada de collect() gera decisões diferentes (com hash diferente) usando
contador interno persistido em arquivo. Idempotente: se rodar duas vezes
com o mesmo contador, gera as mesmas decisões.
"""
from __future__ import annotations
import os
from datetime import date, timedelta
from .base import BaseCollector, DecisaoBruta


_TEMAS_POOL = [
    ("dano moral", "Dano moral. Inscrição indevida em cadastro de inadimplentes. Quantum indenizatório."),
    ("plano de saúde", "Plano de saúde. Negativa de cobertura. Tratamento expressamente prescrito por médico."),
    ("prisão preventiva", "Habeas corpus. Prisão preventiva sem fundamentação concreta. Ordem concedida."),
    ("pensão alimentícia", "Pensão alimentícia. Revisão. Binômio necessidade-possibilidade."),
    ("aposentadoria", "Aposentadoria por tempo de contribuição. Revisão. Cálculo do salário-de-benefício."),
    ("rescisão indireta", "Rescisão indireta do contrato de trabalho. Falta grave do empregador."),
    ("execução fiscal", "Execução fiscal. Prescrição intercorrente. Súmula 314 STJ."),
    ("repercussão geral", "Repercussão geral. Tema. Constitucionalidade da matéria debatida."),
    ("habeas corpus", "Habeas corpus. Tráfico de drogas. Quantidade pequena. Aplicação do § 4º do art. 33."),
    ("improbidade administrativa", "Improbidade administrativa. Lei 8.429/92. Tipicidade do ato."),
]


class FixturesCollector(BaseCollector):
    """Gera decisões sintéticas pra dev/teste."""

    def __init__(self, tribunal: str = "STJ", state_dir: str | None = None):
        if tribunal not in {"STF", "STJ"}:
            raise ValueError("tribunal deve ser STF ou STJ")
        self.tribunal = tribunal
        self.state_file = os.path.join(
            state_dir or os.path.dirname(__file__),
            f".fixtures_counter_{tribunal.lower()}",
        )

    def _read_counter(self) -> int:
        try:
            with open(self.state_file) as f:
                return int(f.read().strip() or "0")
        except (FileNotFoundError, ValueError):
            return 0

    def _write_counter(self, n: int) -> None:
        try:
            with open(self.state_file, "w") as f:
                f.write(str(n))
        except OSError:
            pass

    def collect(self, batch_size: int) -> list[DecisaoBruta]:
        start = self._read_counter()
        out: list[DecisaoBruta] = []
        for i in range(batch_size):
            n = start + i + 1
            tema_idx = (n - 1) % len(_TEMAS_POOL)
            tema_label, ementa_base = _TEMAS_POOL[tema_idx]
            classe = "REsp" if self.tribunal == "STJ" else "RE"
            numero_seq = f"{900000 + n:06d}"
            numero = f"{numero_seq}-{(n % 99) + 1:02d}.2025.0.00.0000"
            data_jul = date(2026, 1, 1) + timedelta(days=(n - 1) % 365)
            data_pub = data_jul + timedelta(days=7)

            ementa = (
                f"AMOSTRA AdvAqui (fixture #{n}) — {ementa_base} "
                f"Reconhece-se a relevância da matéria. {self.tribunal}. "
                f"Sem repercussão social significativa. Recurso conhecido."
            )

            out.append(
                DecisaoBruta(
                    tribunal=self.tribunal,
                    classe=classe,
                    numero=numero,
                    processo=f"{classe} {numero_seq}",
                    relator=f"Min. Fixture {(n % 10) + 1}",
                    orgao_julgador="Turma de Validação" if self.tribunal == "STJ" else "Plenário",
                    data_julgamento=data_jul,
                    data_publicacao=data_pub,
                    ementa=ementa,
                    tese=f"Tese: {ementa_base}",
                    url_origem=f"https://example.invalid/fixture/{self.tribunal.lower()}/{n}",
                    inteiro_teor_opcional=None,
                )
            )
        self._write_counter(start + batch_size)
        return out
