"""
Google Calendar: consulta de ocupación y creación del evento.

Solo dos operaciones, ambas sobre la API REST v3 con el token de la cuenta de servicio.
"""

from __future__ import annotations

import logging
from datetime import datetime

import httpx

from _lib.config import config
from _lib.google import cabeceras

log = logging.getLogger("portfolio.calendario")

BASE = "https://www.googleapis.com/calendar/v3"
TIEMPO_LIMITE = httpx.Timeout(10.0)


async def ocupacion(desde: datetime, hasta: datetime) -> list[tuple[datetime, datetime]]:
    """
    Intervalos ocupados del calendario, vía `freeBusy`.

    Se usa `freeBusy` y no el listado de eventos porque devuelve solo lo que hace falta
    —cuándo está pillado— sin exponer título, invitados ni descripción de las reuniones
    de Wilfred a un endpoint público.
    """
    cuerpo = {
        "timeMin": desde.isoformat(),
        "timeMax": hasta.isoformat(),
        "items": [{"id": config().google_calendar_id}],
    }
    async with httpx.AsyncClient(timeout=TIEMPO_LIMITE) as cliente:
        respuesta = await cliente.post(
            f"{BASE}/freeBusy", headers=await cabeceras(), json=cuerpo
        )
        respuesta.raise_for_status()
        datos = respuesta.json()

    calendario = datos.get("calendars", {}).get(config().google_calendar_id, {})
    if calendario.get("errors"):
        raise RuntimeError(f"Calendar devolvió errores: {calendario['errors']}")

    return [
        (datetime.fromisoformat(b["start"]), datetime.fromisoformat(b["end"]))
        for b in calendario.get("busy", [])
    ]


async def crear_evento(
    inicio: datetime, fin: datetime, nombre: str, correo: str, resumen: str
) -> dict:
    """
    Crea la cita con enlace de Meet y devuelve el evento.

    El visitante NO se añade como invitado: una cuenta de servicio no puede invitar a
    terceros sin delegación de dominio, y la llamada entera fallaría por eso. La
    confirmación al visitante se manda por correo desde `_lib/correo.py`, con el enlace
    dentro.
    """
    cuerpo = {
        "summary": f"Llamada con {nombre or 'visitante del portafolio'}",
        "description": (
            f"Solicitada desde el chat del portafolio.\n\n"
            f"Nombre: {nombre or '(no lo dijo)'}\n"
            f"Correo: {correo or '(no lo dijo)'}\n\n"
            f"{resumen}"
        ).strip(),
        "start": {"dateTime": inicio.isoformat()},
        "end": {"dateTime": fin.isoformat()},
        "conferenceData": {
            "createRequest": {
                # Identificador de la petición: Google lo usa para no duplicar la
                # videollamada si se reintenta. El instante de inicio ya es único aquí.
                "requestId": f"portfolio-{int(inicio.timestamp())}",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }
    async with httpx.AsyncClient(timeout=TIEMPO_LIMITE) as cliente:
        respuesta = await cliente.post(
            f"{BASE}/calendars/{config().google_calendar_id}/events",
            headers=await cabeceras(),
            params={"conferenceDataVersion": 1},
            json=cuerpo,
        )
        respuesta.raise_for_status()
        return respuesta.json()


def enlace_videollamada(evento: dict) -> str:
    """El enlace de Meet, si Google llegó a crearlo."""
    return evento.get("hangoutLink") or ""
