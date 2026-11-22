import os
import sys
from pathlib import Path

import pytest

API = Path(__file__).resolve().parents[2] / "api"
sys.path.insert(0, str(API))

# Entorno de prueba aislado: `_cargar_dotenv` usa `setdefault`, así que con las claves ya
# definidas aquí nunca se leen las credenciales reales de `api/.env`.
_ENTORNO = {
    "DEEPSEEK_API_KEY": "prueba",
    "VISITOR_ID_SALT": "sal-de-prueba",
    "TELEGRAM_BOT_TOKEN": "",
    "TELEGRAM_CHAT_ID": "",
    "GOOGLE_SERVICE_ACCOUNT_JSON": "{}",
    "GOOGLE_SHEET_ID": "hoja",
    "GOOGLE_CALENDAR_ID": "calendario@prueba",
    "RESEND_API_KEY": "",
    "RESEND_FROM": "",
    "AGENDA_HABILITADA": "1",
    "AGENDA_SECRETO": "s" * 64,
}
os.environ.update(_ENTORNO)


@pytest.fixture(autouse=True)
def _config_limpia():
    from _lib.config import config

    config.cache_clear()
    yield
    config.cache_clear()
