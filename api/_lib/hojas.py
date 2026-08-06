"""
Registro en Google Sheets: conversaciones, leads y citas.

POR QUÉ ASÍ:
- Una hoja de cálculo es la base de datos adecuada aquí: Wilfred la abre desde el móvil,
  filtra, y no hay que mantener nada. El volumen de una página personal cabe de sobra.
- **Siempre `append`, nunca escritura por índice.** Sheets no es transaccional: dos
  visitantes a la vez pisándose una fila es un fallo real, y `append` lo evita porque es
  el propio Google quien decide en qué fila cae cada cosa.
- Nunca lanza excepción: el registro es para Wilfred, no para el visitante.
- Cuota: 60 escrituras por minuto y usuario. Holgadísimo para este tráfico.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

import httpx

from _lib.config import config
from _lib.google import cabeceras

log = logging.getLogger("portfolio.hojas")

BASE = "https://sheets.googleapis.com/v4/spreadsheets"
TIEMPO_LIMITE = httpx.Timeout(10.0)

# Nombres de las pestañas. Deben existir en la hoja; ver `docs/deployment.md`.
CONVERSACIONES = "conversaciones"
LEADS = "leads"
AGENDA = "agenda"


def _sello() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


async def _anexar(pestana: str, fila: list[str]) -> None:
    if not config().sheets_activo:
        log.info("Sheets no está configurado; no se registra en %s", pestana)
        return
    try:
        async with httpx.AsyncClient(timeout=TIEMPO_LIMITE) as cliente:
            respuesta = await cliente.post(
                f"{BASE}/{config().google_sheet_id}/values/{pestana}!A1:append",
                headers=await cabeceras(),
                params={
                    "valueInputOption": "USER_ENTERED",
                    "insertDataOption": "INSERT_ROWS",
                },
                json={"values": [fila]},
            )
            respuesta.raise_for_status()
    except Exception:
        log.warning("No se pudo registrar en la pestaña %s", pestana, exc_info=True)


async def registrar_conversacion(vid: str, pregunta: str, respuesta: str) -> None:
    """Una fila por turno. `vid` es el hash del visitante, nunca su IP."""
    await _anexar(CONVERSACIONES, [_sello(), vid, pregunta, respuesta])


async def registrar_lead(vid: str, nombre: str, correo: str, resumen: str) -> None:
    await _anexar(LEADS, [_sello(), vid, nombre, correo, resumen])


async def registrar_cita(
    vid: str, nombre: str, correo: str, inicio: str, enlace: str
) -> None:
    await _anexar(AGENDA, [_sello(), vid, nombre, correo, inicio, enlace])
