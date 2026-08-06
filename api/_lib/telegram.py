"""
Aviso a Wilfred por Telegram.

POR QUÉ ASÍ:
- Es el canal más rápido para enterarse de que alguien interesante acaba de escribir en
  la página. Un correo se lee tarde; una notificación al móvil, no.
- **No avisa de cada mensaje.** Solo cuando la conversación tiene sustancia: una
  oportunidad real o una cita agendada. Un bot que vibra cada vez que alguien escribe
  "hola" se silencia en dos días y deja de servir para nada.
- Nunca lanza excepción. Que falle el aviso no puede tumbar la respuesta al visitante,
  que es lo único que él ve.
"""

from __future__ import annotations

import logging

import httpx

from _lib.config import config

log = logging.getLogger("portfolio.telegram")


def _escapar(texto: str) -> str:
    """HTML mínimo de Telegram: solo hay que neutralizar estos tres caracteres."""
    return texto.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


async def avisar(titulo: str, lineas: list[tuple[str, str]], cuerpo: str = "") -> None:
    if not config().telegram_activo:
        log.info("Telegram no está configurado; se omite el aviso")
        return

    partes = [f"<b>{_escapar(titulo)}</b>"]
    partes += [f"{_escapar(k)}: {_escapar(v)}" for k, v in lineas if v]
    if cuerpo:
        partes.append("")
        partes.append(_escapar(cuerpo))

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(8.0)) as cliente:
            respuesta = await cliente.post(
                f"https://api.telegram.org/bot{config().telegram_bot_token}/sendMessage",
                json={
                    "chat_id": config().telegram_chat_id,
                    "text": "\n".join(partes),
                    "parse_mode": "HTML",
                    "disable_web_page_preview": True,
                },
            )
            if respuesta.status_code != 200:
                # Se registra el código y nada más. El token va dentro de la URL, y tanto
                # el traceback como el mensaje de `raise_for_status` la incluyen entera:
                # bastaría un token caducado para dejar la clave escrita en los logs de
                # Vercel, justo el día en que alguien va a mirarlos.
                log.warning("Telegram rechazó el aviso (HTTP %s)", respuesta.status_code)
    except Exception as fallo:
        log.warning("No se pudo enviar el aviso de Telegram: %s", type(fallo).__name__)
