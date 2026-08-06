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
- **El intercambio del token se hace a mano, con httpx.** La vía cómoda
  (`google.auth.transport.requests.Request`) obliga a instalar `requests`, que es un
  cliente HTTP síncrono entero solo para pedir un token cada hora — teniendo ya `httpx`
  asíncrono en el proyecto. De `google-auth` se usa únicamente lo que no conviene
  reimplementar: la firma RS256 del JWT.

  Esto no es una preferencia estética: el primer despliegue de la función se cayó con
  `ModuleNotFoundError: requests`, porque en local esa librería estaba instalada de
  rebote y en `requirements.txt` no figuraba.

El token dura una hora; se reutiliza mientras siga vigente dentro de la misma instancia.
"""

from __future__ import annotations

import time

import httpx
from google.auth import jwt
from google.auth.crypt import RSASigner

from _lib.config import config

ALCANCES = (
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/calendar.events",
)

# Vida del JWT que se cambia por el token. Google no acepta más de una hora.
VIGENCIA = 3600

# Se renueva un minuto antes de que caduque: así ninguna petición sale con un token que
# expira mientras viaja.
MARGEN = 60

_token: str = ""
_expira: float = 0.0


def _assertion(info: dict) -> str:
    """JWT firmado con la clave privada de la cuenta de servicio."""
    ahora = int(time.time())
    firmante = RSASigner.from_service_account_info(info)
    carga = {
        "iss": info["client_email"],
        "scope": " ".join(ALCANCES),
        "aud": info["token_uri"],
        "iat": ahora,
        "exp": ahora + VIGENCIA,
    }
    return jwt.encode(firmante, carga).decode("utf-8")


async def token() -> str:
    """Token de acceso vigente, pidiéndolo solo cuando hace falta."""
    global _token, _expira

    if _token and time.time() < _expira - MARGEN:
        return _token

    info = config().credenciales_google()
    async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as cliente:
        respuesta = await cliente.post(
            info["token_uri"],
            data={
                "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "assertion": _assertion(info),
            },
        )
        if respuesta.status_code != 200:
            # Sin cuerpo ni `raise_for_status`: la respuesta de error de Google repite el
            # assertion, que va firmado con la clave privada.
            raise RuntimeError(f"Google rechazó las credenciales (HTTP {respuesta.status_code})")
        datos = respuesta.json()

    _token = datos["access_token"]
    _expira = time.time() + datos.get("expires_in", VIGENCIA)
    return _token


async def cabeceras() -> dict[str, str]:
    return {"Authorization": f"Bearer {await token()}", "Content-Type": "application/json"}
