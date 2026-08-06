"""
Correo de confirmación al visitante, vía Resend.

POR QUÉ RESEND Y NO GMAIL:
Una cuenta de servicio de Google no puede enviar correo desde una dirección `@gmail.com`
personal —haría falta delegación de dominio, que solo existe en Workspace—. Resend envía
por API con una clave y sin buzón detrás, que es exactamente lo que hace falta.

El correo NO es imprescindible: si falla, la cita ya está creada en el calendario y el
agente lo dice en el chat. Por eso esta función tampoco lanza nunca.
"""

from __future__ import annotations

import html
import logging

import httpx

from _lib.config import config

log = logging.getLogger("portfolio.correo")

CONTACTO = "wilfred3019@gmail.com"


def _plantilla(nombre: str, cuando: str, enlace: str) -> str:
    # `nombre` sale de lo que escribió el visitante y `enlace` de la respuesta de Google.
    # Sin escapar, un nombre con etiquetas HTML convierte este correo —firmado por el
    # remitente de Wilfred— en lo que quiera quien escriba en el chat.
    nombre, cuando = html.escape(nombre), html.escape(cuando)
    saludo = f"Hola {nombre}," if nombre else "Hola,"

    # El enlace solo se acepta si es de Google Meet: es el único que puede haber creado el
    # calendario, y así ni una respuesta rara ni una manipulación cuelan otro destino.
    enlace = enlace if enlace.startswith("https://meet.google.com/") else ""
    videollamada = (
        f'<p>Enlace de la videollamada: <a href="{enlace}">{enlace}</a></p>'
        if enlace
        else "<p>El enlace de la videollamada te llegará antes de la reunión.</p>"
    )
    return f"""
<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a">
  <p>{saludo}</p>
  <p>Llamada confirmada con <strong>Wilfred Morales</strong>.</p>
  <p><strong>{cuando}</strong></p>
  {videollamada}
  <p>Si necesitas cambiarla o cancelarla, responde a este correo o escribe a
     <a href="mailto:{CONTACTO}">{CONTACTO}</a>.</p>
</div>
""".strip()


async def confirmar_cita(destinatario: str, nombre: str, cuando: str, enlace: str) -> bool:
    """Devuelve si el correo salió. Nunca lanza."""
    if not config().resend_activo or not destinatario:
        log.info("Resend no está configurado o no hay destinatario; no se envía correo")
        return False

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as cliente:
            respuesta = await cliente.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {config().resend_api_key}"},
                json={
                    "from": config().resend_from,
                    "to": [destinatario],
                    "reply_to": CONTACTO,
                    "subject": f"Llamada confirmada — {cuando}",
                    "html": _plantilla(nombre, cuando, enlace),
                },
            )
            if respuesta.status_code >= 400:
                # Sin `raise_for_status`: su mensaje arrastra la petición, y la cabecera
                # de autorización lleva la clave de Resend.
                log.warning("Resend rechazó el correo (HTTP %s)", respuesta.status_code)
                return False
            return True
    except Exception as fallo:
        log.warning("No se pudo enviar el correo de confirmación: %s", type(fallo).__name__)
        return False
