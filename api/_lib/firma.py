"""
Firma de los huecos ofrecidos.

POR QUÉ ASÍ: los huecos viajan al navegador y vuelven en el turno siguiente, porque la
función serverless no guarda estado. Sin firma, cualquiera puede inventarse un hueco
—cualquier instante libre de la rejilla— y confirmarlo sin haber pasado por la oferta,
con un script y sin gastar ni una llamada al modelo. La firma liga cada hueco a lo que el
servidor ofreció de verdad y le pone caducidad.

HMAC-SHA256 sobre `id|inicio|fin|caduca`, con `AGENDA_SECRETO`. Sin ese secreto la
agenda no se enciende (`config.agenda_activa`).
"""

from __future__ import annotations

import hashlib
import hmac
from datetime import datetime, timedelta, timezone

from _lib.config import config

VIGENCIA = timedelta(hours=2)


def _mac(id_: str, inicio: str, fin: str, caduca: int) -> str:
    mensaje = f"{id_}|{inicio}|{fin}|{caduca}".encode()
    clave = config().agenda_secreto.encode()
    return hmac.new(clave, mensaje, hashlib.sha256).hexdigest()


def firmar(id_: str, inicio: str, fin: str) -> str:
    caduca = int((datetime.now(timezone.utc) + VIGENCIA).timestamp())
    return f"{caduca}.{_mac(id_, inicio, fin, caduca)}"


def valida(id_: str, inicio: str, fin: str, firma: str) -> bool:
    caduca_txt, _, mac = firma.partition(".")
    if not caduca_txt.isdigit() or not mac:
        return False
    caduca = int(caduca_txt)
    if caduca < datetime.now(timezone.utc).timestamp():
        return False
    return hmac.compare_digest(mac, _mac(id_, inicio, fin, caduca))


def huella_correo(correo: str) -> str:
    """Identifica un correo en el calendario sin guardarlo en claro en un campo filtrable."""
    clave = config().agenda_secreto.encode()
    return hmac.new(clave, correo.strip().lower().encode(), hashlib.sha256).hexdigest()[:32]
