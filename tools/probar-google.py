"""
Comprobación de las credenciales de Google, de menos a más consecuencias.

    .venv/Scripts/python tools/probar-google.py            # token, calendario y hoja
    .venv/Scripts/python tools/probar-google.py --evento   # además crea un evento real

El evento se crea en el calendario de verdad: bórralo después.
"""

from __future__ import annotations

import asyncio
import sys
from datetime import timedelta
from pathlib import Path

API_DIR = Path(__file__).resolve().parent.parent / "api"
sys.path.insert(0, str(API_DIR))

from _lib import agenda, calendario, google, hojas  # noqa: E402
from _lib.config import config  # noqa: E402


def ok(texto: str) -> None:
    print(f"  OK    {texto}")


def fallo(texto: str, error: Exception) -> None:
    print(f"  FALLO {texto}\n        {type(error).__name__}: {error}")


async def main(crear_evento: bool) -> int:
    cfg = config()
    print("Configuración")
    print(f"  google_activo   : {cfg.google_activo}")
    print(f"  sheets_activo   : {cfg.sheets_activo}")
    print(f"  calendar_activo : {cfg.calendar_activo}")
    print(f"  agenda_activa   : {cfg.agenda_activa}\n")

    if not cfg.google_activo:
        print("Falta GOOGLE_SERVICE_ACCOUNT_JSON en api/.env")
        return 1

    print("1. Credenciales")
    try:
        info = cfg.credenciales_google()
        print(f"  cuenta de servicio: {info['client_email']}")
        print("  (este es el correo con el que hay que compartir hoja y calendario)")
        await google.token()
        ok("Google entregó un token de acceso")
    except Exception as error:
        fallo("No se pudo obtener el token", error)
        return 1

    print("\n2. Calendario (solo lectura)")
    if not cfg.calendar_activo:
        print("  OMITIDO: falta GOOGLE_CALENDAR_ID")
    else:
        try:
            desde = agenda.ahora()
            ocupado = await calendario.ocupacion(desde, desde + timedelta(days=7))
            ok(f"freeBusy respondió: {len(ocupado)} intervalos ocupados en 7 días")
        except Exception as error:
            fallo("No se pudo leer la ocupación", error)
            return 1

    print("\n3. Hoja de cálculo (escribe una fila de prueba)")
    if not cfg.sheets_activo:
        print("  OMITIDO: falta GOOGLE_SHEET_ID")
    else:
        # `hojas` nunca lanza: se comprueba mirando la pestaña después.
        await hojas.registrar_conversacion("prueba", "¿esto funciona?", "sí")
        ok("Llamada hecha. Mira la pestaña 'conversaciones': debe haber una fila nueva.")
        print("        Si no aparece, el error está en el log de arriba.")

    if not crear_evento:
        print("\n4. Evento con Meet: omitido. Añade --evento para probarlo.")
        return 0

    print("\n4. Evento con Meet (crea una cita REAL, bórrala después)")
    try:
        inicio = agenda.ahora() + timedelta(days=1)
        evento = await calendario.crear_evento(
            inicio, inicio + timedelta(minutes=30), "Prueba", "", "Prueba de credenciales"
        )
        enlace = calendario.enlace_videollamada(evento)
        ok(f"Evento creado: {evento.get('htmlLink', '(sin enlace)')}")
        if enlace:
            ok(f"Meet creado: {enlace}")
        else:
            print("  AVISO Sin enlace de Meet: el evento existe pero sin videollamada.")
    except Exception as error:
        fallo("No se pudo crear el evento", error)
        print("\n  Si el mensaje habla de 'conference', el problema es conferenceData")
        print("  desde una cuenta de servicio. Ver docs/credenciales-google.md.")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main("--evento" in sys.argv)))
