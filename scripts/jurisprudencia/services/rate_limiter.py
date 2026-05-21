"""Rate limit por domínio + backoff exponencial em 429/5xx."""
from __future__ import annotations
import time
import random
from collections import defaultdict
from urllib.parse import urlparse


class DomainRateLimiter:
    """Garante intervalo mínimo entre requisições pro mesmo host.

    Uso:
        rl = DomainRateLimiter(interval_seconds=1.0)
        rl.wait_for("https://stf.jus.br/...")  # bloqueia até liberar
        ...request...
    """

    def __init__(self, interval_seconds: float = 1.0):
        self.interval = interval_seconds
        self._last_call: dict[str, float] = defaultdict(float)

    def wait_for(self, url: str) -> None:
        host = urlparse(url).netloc or "_default_"
        now = time.monotonic()
        elapsed = now - self._last_call[host]
        if elapsed < self.interval:
            time.sleep(self.interval - elapsed)
        self._last_call[host] = time.monotonic()


def backoff_sleep(attempt: int, base: float = 1.0, cap: float = 60.0) -> None:
    """Backoff exponencial com jitter, limitado a `cap` segundos.

    attempt 1 → ~1s, 2 → ~2s, 3 → ~4s, 4 → ~8s...
    """
    delay = min(cap, base * (2 ** (attempt - 1)))
    # Jitter de ±20%
    delay = delay * (0.8 + 0.4 * random.random())
    time.sleep(delay)
