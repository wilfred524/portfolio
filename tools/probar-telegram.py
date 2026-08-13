"""
Comprobación de las credenciales de Telegram: manda un aviso de prueba al móvil.

    .venv/Scripts/python tools/probar-telegram.py

`telegram.avisar` no lanza nunca —que falle un aviso no puede tumbar la respuesta al
visitante—, así que aquí se comprueba antes el token con `getMe`, que sí devuelve el error.
Sin eso, un token equivocado se traduce en silencio.
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

import httpx

API_DIR = Path(__file__).resolve().parent.parent / "api"
sys.path.insert(0, str(API_DIR))

from _lib import telegram  # noqa: E402
from _lib.config import config  # noqa: E402


async def main() -> int:
    cfg = config()
    print(f"telegram_activo : {cfg.telegram_activo}\n")

    if not cfg.telegram_activo:
        falta = [
            nombre
            for nombre, valor in (
                ("TELEGRAM_BOT_TOKEN", cfg.telegram_bot_token),
                ("TELEGRAM_CHAT_ID", cfg.telegram_chat_id),
            )
            if not valor
        ]
        print(f"Falta en api/.env: {', '.join(falta)}")
        print("Hacen falta las dos: con una sola, el aviso queda apagado.")
        return 1

    # 1. ¿El token es válido? `getMe` no necesita chat_id, así que separa los dos fallos.
    async with httpx.AsyncClient(timeout=httpx.Timeout(8.0)) as cliente:
        respuesta = await cliente.get(
            f"https://api.telegram.org/bot{cfg.telegram_bot_token}/getMe"
        )
        if respuesta.status_code != 200:
            print(f"FALLO El token no vale (HTTP {respuesta.status_code}).")
            print("      Revísalo en @BotFather. No se imprime aquí: es un secreto.")
            return 1
        bot = respuesta.json().get("result", {})
        print(f"OK    Token válido: @{bot.get('username')}")

    # 2. El envío de verdad, que es donde falla el chat_id.
    await telegram.avisar(
        "Prueba de configuración",
        [("Origen", "tools/probar-telegram.py"), ("Estado", "si lees esto, funciona")],
        "Este aviso no lo genera un visitante: es la comprobación de credenciales.",
    )
    print("OK    Aviso enviado. Míralo en el móvil.")
    print()
    print("Si no llega, el motivo casi siempre es el chat_id, y `avisar` no lanza")
    print("excepción a propósito: mira el aviso 'Telegram rechazó el aviso (HTTP ...)'")
    print("en el log de arriba. Un 400 suele ser chat_id equivocado; un 403, que no has")
    print("pulsado Iniciar en el bot.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
