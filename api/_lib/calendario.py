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

    Si Google rechaza la videollamada, **la cita se crea igual, sin Meet**. Una cuenta de
    servicio sobre un calendario personal no puede generar salas: responde 400 «Invalid
    conference type value» (comprobado el 2026-08-13). Antes eso tumbaba la petición
    entera y el visitante se quedaba sin cita por no poder ponerle un enlace, que es
    perder lo importante por lo accesorio. `correo.py:36-41` ya escribe «el enlace te
    llegará antes de la reunión» cuando no hay ninguno.

    El intento con Meet se conserva en lugar de quitarlo: en una cuenta de Workspace con
    delegación sí funciona, y así empezaría a hacerlo sin tocar el código.
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
    url = f"{BASE}/calendars/{config().google_calendar_id}/events"
    async with httpx.AsyncClient(timeout=TIEMPO_LIMITE) as cliente:
        respuesta = await cliente.post(
            url,
            headers=await cabeceras(),
            params={"conferenceDataVersion": 1},
            json=cuerpo,
        )
        if _rechazo_de_videollamada(respuesta):
            log.warning(
                "Google no permite crear la videollamada; se crea la cita sin Meet"
            )
            cuerpo.pop("conferenceData")
            respuesta = await cliente.post(url, headers=await cabeceras(), json=cuerpo)

        respuesta.raise_for_status()
        return respuesta.json()


def _rechazo_de_videollamada(respuesta: httpx.Response) -> bool:
    """
    ¿Google rechazó la petición *por la videollamada*, y no por otra cosa?

    Se mira el motivo y no solo el 400: reintentar sin `conferenceData` cualquier petición
    mal formada escondería el error real —un rango de fechas inválido, por ejemplo— detrás
    de un segundo fallo idéntico.
    """
    if respuesta.status_code != 400:
        return False
    try:
        mensaje = respuesta.json().get("error", {}).get("message", "")
    except ValueError:
        return False
    return "conference" in mensaje.lower()


def enlace_videollamada(evento: dict) -> str:
    """El enlace de Meet, si Google llegó a crearlo."""
    return evento.get("hangoutLink") or ""
