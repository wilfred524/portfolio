"""
Autenticación con Google mediante cuenta de servicio.

POR QUÉ ASÍ:
- Cuenta de servicio y no OAuth interactivo: no hay nadie delante de la pantalla para dar
  permiso, y un *refresh token* personal acaba caducando siempre en el peor momento. Se
  comparte la hoja y el calendario con el correo de la cuenta de servicio y se acabó.
- Se llama a las API REST con `httpx` en vez de usar `google-api-python-client`, que
  arrastra decenas de megabytes de descubrimiento de servicios para las cuatro llamadas
  que hacen falta. En una función serverless el tamaño del paquete se paga en arranques
  en frío.
- El token dura una hora y se reutiliza dentro de la misma instancia.
"""

from __future__ import annotations

import asyncio

from google.auth.transport.requests import Request
from google.oauth2 import service_account

from _lib.config import config

ALCANCES = (
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/calendar.events",
)

_credenciales: service_account.Credentials | None = None


def _obtener_token_bloqueante() -> str:
    global _credenciales
    if _credenciales is None:
        _credenciales = service_account.Credentials.from_service_account_info(
            config().credenciales_google(), scopes=list(ALCANCES)
        )
    if not _credenciales.valid:
        _credenciales.refresh(Request())
    return _credenciales.token


async def token() -> str:
    """Token de acceso vigente. El refresco es de red y bloqueante: va a un hilo."""
    return await asyncio.to_thread(_obtener_token_bloqueante)


async def cabeceras() -> dict[str, str]:
    return {"Authorization": f"Bearer {await token()}", "Content-Type": "application/json"}
