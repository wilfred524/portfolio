"""
Blindaje del endpoint público de chat.

POR QUÉ ASÍ:
- `/api/chat` es público y cada mensaje gasta tokens de DeepSeek. Sin límites, el riesgo
  no es que alguien "hackee" nada: es la factura. Es el riesgo principal que documenta el
  plan y se cubre desde el primer día.
- Tres capas, de la más barata a la más cara: longitud de la entrada, tamaño de la
  conversación y frecuencia por visitante. Las dos primeras son exactas; la tercera es
  best-effort.
- **La frecuencia es best-effort a propósito.** El contador vive en memoria y Vercel
  puede levantar varias instancias de la función, así que un atacante decidido reparte su
  tráfico entre instancias. Frena el abuso accidental y el bucle de un script tonto, que
  es el 99 % de los casos reales en una página personal. La defensa dura, si algún día
  hace falta, es un contador compartido (Redis) o el rate limiting del propio Vercel.
"""

from __future__ import annotations

import hashlib
import time
from collections import defaultdict, deque

from _lib.config import config

# Longitud máxima de un mensaje del visitante. Una pregunta sobre la trayectoria de
# alguien cabe de sobra; un documento entero pegado para que se lo resuman, no.
MAX_CARACTERES_MENSAJE = 1_200

# Mensajes totales admitidos en el historial (visitante + agente). Veinticuatro son doce
# turnos: una conversación larga de verdad ya ha terminado en un correo mucho antes.
MAX_MENSAJES = 24

# Techo del historial completo, para que nadie llegue al límite anterior con 24 mensajes
# de 1.200 caracteres cada uno.
MAX_CARACTERES_HISTORIAL = 12_000

# Frecuencia por visitante: peticiones permitidas dentro de la ventana.
MAX_PETICIONES = 20
VENTANA_SEGUNDOS = 600

_peticiones: dict[str, deque[float]] = defaultdict(deque)


class LimiteSuperado(Exception):
    """Petición rechazada por el blindaje. `codigo` es el HTTP que debe devolverse."""

    def __init__(self, mensaje: str, codigo: int = 400) -> None:
        super().__init__(mensaje)
        self.mensaje = mensaje
        self.codigo = codigo


def visitor_id(cabeceras) -> str:
    """
    Identificador estable y anónimo del visitante: `sha256(ip + sal)`.

    La IP llega en `x-forwarded-for` porque delante siempre hay un proxy (Vercel en
    producción, Vite en desarrollo). Se hashea con una sal secreta y **la IP cruda no se
    guarda ni se registra en ningún sitio**: sirve para dar continuidad a la conversación
    y para contar peticiones, no para identificar a nadie.

    Es una página de presentación: asumir un visitante por IP es razonable aquí y sería
    una mala idea en un producto con tráfico real.
    """
    reenviada = cabeceras.get("x-forwarded-for", "")
    ip = reenviada.split(",")[0].strip() or "desconocida"
    return hashlib.sha256(f"{ip}{config().visitor_id_salt}".encode()).hexdigest()[:32]


def comprobar_frecuencia(vid: str) -> None:
    ahora = time.monotonic()
    marcas = _peticiones[vid]
    while marcas and ahora - marcas[0] > VENTANA_SEGUNDOS:
        marcas.popleft()
    if len(marcas) >= MAX_PETICIONES:
        raise LimiteSuperado(
            "Demasiados mensajes en poco tiempo. Prueba de nuevo en unos minutos.",
            codigo=429,
        )
    marcas.append(ahora)

    # Higiene de memoria: sin esto, una instancia longeva acumula una entrada por cada
    # visitante que ha pasado alguna vez.
    if len(_peticiones) > 5_000:
        for clave in [k for k, v in _peticiones.items() if not v]:
            del _peticiones[clave]


def comprobar_conversacion(mensajes: list) -> None:
    """Valida forma y tamaño del historial que manda el frontend."""
    if not mensajes:
        raise LimiteSuperado("La conversación llega vacía.")

    if len(mensajes) > MAX_MENSAJES:
        raise LimiteSuperado(
            "Esta conversación ya es larga. Escríbele directamente a Wilfred: "
            "wilfred3019@gmail.com",
            codigo=429,
        )

    if mensajes[-1].role != "user":
        raise LimiteSuperado("El último mensaje debe ser del visitante.")

    total = 0
    for mensaje in mensajes:
        if len(mensaje.content) > MAX_CARACTERES_MENSAJE:
            raise LimiteSuperado(
                f"El mensaje es demasiado largo (máximo {MAX_CARACTERES_MENSAJE} caracteres)."
            )
        total += len(mensaje.content)

    if total > MAX_CARACTERES_HISTORIAL:
        raise LimiteSuperado("La conversación ha crecido demasiado.", codigo=429)
