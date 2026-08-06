"""
Configuración del backend: todo lo que viene del entorno se lee aquí y en ningún otro
sitio.

POR QUÉ ASÍ:
- En local las variables salen de `api/.env`; en Vercel, del panel del proyecto. El
  código no distingue entre los dos casos: solo lee `os.environ`.
- Cada integración se declara con una propiedad `activo`. Ninguna fase posterior es
  obligatoria: si falta la credencial de Telegram, de Google o de Resend, esa pieza
  queda apagada y el chat sigue funcionando. Un portafolio que se cae entero porque
  expiró una clave de correo es peor portafolio.
- Las claves NO se registran nunca, ni en logs ni en errores.
"""

from __future__ import annotations

import json
import logging
import os
import secrets
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

log = logging.getLogger("portfolio.config")

# Raíz de `api/`. Todas las rutas del backend se derivan de aquí y no del directorio de
# trabajo, que en Vercel no es el que uno espera.
API_DIR = Path(__file__).resolve().parent.parent
CONTEXT_DIR = API_DIR / "_context"


def _cargar_dotenv() -> None:
    """
    Carga `api/.env` en el entorno cuando existe (desarrollo local).

    En Vercel el archivo no viaja —está en `.gitignore`— y las variables ya vienen
    inyectadas, así que esta función no hace nada allí. Se implementa a mano en vez de
    con `python-dotenv` para no añadir una dependencia al paquete de la función por algo
    que solo se usa en local.
    """
    ruta = API_DIR / ".env"
    if not ruta.exists():
        return
    for linea in ruta.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, _, valor = linea.partition("=")
        clave, valor = clave.strip(), valor.strip().strip("\"'")
        # El entorno real manda: si la variable ya existe, no se pisa.
        os.environ.setdefault(clave, valor)


def _env(nombre: str) -> str:
    return os.environ.get(nombre, "").strip()


@dataclass(frozen=True)
class Config:
    # --- Fase 2: chat ---
    deepseek_api_key: str
    visitor_id_salt: str
    modelo: str

    # --- Fase 4: Telegram ---
    telegram_bot_token: str
    telegram_chat_id: str

    # --- Fase 5: Google y correo ---
    google_service_account_json: str
    google_sheet_id: str
    google_calendar_id: str
    resend_api_key: str
    resend_from: str

    # Interruptor explícito de la agenda. Ver `agenda_activa`.
    agenda_habilitada: bool

    @property
    def chat_activo(self) -> bool:
        return bool(self.deepseek_api_key)

    @property
    def telegram_activo(self) -> bool:
        return bool(self.telegram_bot_token and self.telegram_chat_id)

    @property
    def google_activo(self) -> bool:
        return bool(self.google_service_account_json)

    @property
    def sheets_activo(self) -> bool:
        return bool(self.google_activo and self.google_sheet_id)

    @property
    def calendar_activo(self) -> bool:
        return bool(self.google_activo and self.google_calendar_id)

    @property
    def resend_activo(self) -> bool:
        return bool(self.resend_api_key and self.resend_from)

    @property
    def agenda_activa(self) -> bool:
        """
        La agenda solo se ofrece si se puede cumplir de principio a fin **y** alguien la
        ha encendido a propósito.

        Sin calendario no hay huecos que proponer, y proponer una cita que el sistema no
        puede crear es justo el fallo que `_context/50-agenda.md` prohíbe. El correo de
        confirmación, en cambio, es deseable pero no imprescindible: si Resend está
        caído, la cita existe igual y el agente lo dice.

        El interruptor `AGENDA_HABILITADA` existe además de las credenciales porque
        agendar es la única acción del agente con consecuencias fuera del chat: crea
        eventos en un calendario real y escribe a desconocidos. Que se encienda sola
        porque alguien dejó una variable puesta en el panel es demasiado fácil. Por
        defecto está apagada: el agente conversa y da el correo y el teléfono.
        """
        return self.agenda_habilitada and self.calendar_activo

    def credenciales_google(self) -> dict:
        """El JSON de la cuenta de servicio, ya parseado. Solo se llama si está activa."""
        return json.loads(self.google_service_account_json)


def _sal() -> str:
    """
    La sal del identificador de visitante, o una aleatoria si no está configurada.

    Sin sal, `sha256(ip)` no protege nada: el espacio de IPv4 se recorre entero por fuerza
    bruta en minutos, así que el hash sería reversible y estaríamos guardando IPs con un
    disfraz. Antes que degradar en silencio, se genera una al vuelo —cada instancia la
    suya, así que se pierde la continuidad entre conversaciones— y se avisa en los logs.
    """
    valor = _env("VISITOR_ID_SALT")
    if valor:
        return valor
    log.warning(
        "VISITOR_ID_SALT no está configurada: se usa una sal aleatoria por instancia. "
        "Configúrala en el entorno para que el identificador de visitante sea estable."
    )
    return secrets.token_hex(32)


@lru_cache(maxsize=1)
def config() -> Config:
    _cargar_dotenv()
    return Config(
        deepseek_api_key=_env("DEEPSEEK_API_KEY"),
        visitor_id_salt=_sal(),
        # Fijado, no configurable por entorno: cambiar de modelo cambia el tono de las
        # respuestas y eso es una decisión de producto, no de despliegue.
        modelo="deepseek-chat",
        telegram_bot_token=_env("TELEGRAM_BOT_TOKEN"),
        telegram_chat_id=_env("TELEGRAM_CHAT_ID"),
        google_service_account_json=_env("GOOGLE_SERVICE_ACCOUNT_JSON"),
        google_sheet_id=_env("GOOGLE_SHEET_ID"),
        google_calendar_id=_env("GOOGLE_CALENDAR_ID"),
        resend_api_key=_env("RESEND_API_KEY"),
        resend_from=_env("RESEND_FROM") or "Portafolio <onboarding@resend.dev>",
        # Apagada salvo que se diga lo contrario, y con la lista de valores explícita para
        # que un "false" o un "0" escritos en el panel de Vercel no la enciendan por ser
        # cadenas no vacías.
        agenda_habilitada=_env("AGENDA_HABILITADA").lower() in {"1", "true", "si", "sí"},
    )
