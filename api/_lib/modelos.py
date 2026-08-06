"""
Contratos de datos del backend.

El espejo en TypeScript vive en `shared/src/index.ts`. **Ningún compilador comprueba que
los dos coincidan**: al cambiar algo aquí hay que cambiarlo allí a mano. Es el precio de
tener el backend en Python y el frontend en TypeScript, y está asumido.

Todo lo que llega del navegador se valida aquí, en la frontera. Más adentro, el código da
por hecho que los datos ya tienen la forma correcta.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import ClassVar, Literal

from pydantic import BaseModel, Field, field_validator

# Suficiente para descartar basura sin pretender validar el RFC 5322, que no lo valida
# nadie. Lo que de verdad decide si un correo existe es que llegue.
_CORREO = re.compile(r"^[^@\s]{1,64}@[^@\s.]+(\.[^@\s.]+)+$")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class Hueco(BaseModel):
    """Un horario ofrecido para la llamada. `id` es lo que el visitante acaba eligiendo."""

    id: str = Field(max_length=8)
    inicio: str = Field(max_length=40)  # ISO 8601 **con zona**
    fin: str = Field(max_length=40)
    etiqueta: str = Field(max_length=120)  # redactado en español, listo para leerse

    @field_validator("inicio", "fin")
    @classmethod
    def _fecha_con_zona(cls, valor: str) -> str:
        """
        Exige ISO 8601 con desfase horario.

        Estos campos vuelven del navegador y pueden llegar manipulados. Sin esta
        comprobación, `datetime.fromisoformat` lanza más adentro —con el flujo SSE ya
        abierto, cuando ya no se puede devolver un error decente— y una fecha sin zona
        revienta al compararse con una fecha con zona.
        """
        momento = datetime.fromisoformat(valor)  # ValueError → 422 de Pydantic
        if momento.tzinfo is None:
            raise ValueError("la fecha debe incluir zona horaria")
        return valor

    def como_fecha(self, campo: str) -> datetime:
        return datetime.fromisoformat(getattr(self, campo))


class ChatRequest(BaseModel):
    """Lo que manda el frontend: la conversación entera, en cada turno.

    El estado vive en el navegador y no en el servidor a propósito: una función
    serverless no tiene memoria entre invocaciones, y montar un almacén para algo que el
    cliente ya tiene sería complicarlo sin ganar nada.
    """

    messages: list[ChatMessage] = Field(default_factory=list)

    # Los huecos que se ofrecieron en el turno anterior, devueltos tal cual por el
    # navegador. Van y vuelven en vez de recalcularse porque al confirmar hace falta
    # saber a qué instante exacto se refería "h2", y entre un turno y el siguiente la
    # disponibilidad puede haber cambiado. Llegan como dato no fiable: se validan aquí y
    # `chat.py` los vuelve a contrastar con el calendario antes de crear nada.
    # El tope evita que alguien mande diez mil y haga trabajar a la función de balde.
    offered_slots: list[Hueco] = Field(default_factory=list, max_length=5)


class Intencion(BaseModel):
    """
    Lectura determinista de la conversación, hecha por el modelo pero validada aquí.

    Se usa salida JSON en vez de *tool calling* porque DeepSeek no es fiable llamando
    herramientas, y porque la decisión de crear una cita en el calendario de alguien no
    debe depender de que un modelo acierte con el formato de una llamada.

    Ojo: estos campos los rellena el modelo leyendo lo que escribió el visitante, así que
    son tan poco fiables como el propio visitante. Se recortan y se validan igual que si
    llegaran del navegador.
    """

    # Los topes se aplican **recortando, no rechazando**: estos campos los redacta el
    # modelo, y si un resumen se pasa de largo la respuesta correcta es acortarlo, no
    # tirar la clasificación entera y perder el aviso del lead que la motivó.
    LARGOS: ClassVar[dict[str, int]] = {
        "slot_id": 8,
        "nombre": 80,
        "correo": 120,
        "resumen": 400,
    }

    # Qué quiere el visitante en este turno.
    intent: Literal["conversar", "pedir_huecos", "confirmar_hueco"] = "conversar"

    # Identificador del hueco que confirma, tal y como se le ofreció ("h1", "h2", "h3").
    slot_id: str = ""

    nombre: str = ""
    correo: str = ""

    # ¿Hay una oportunidad real detrás (vacante, proyecto con necesidad definida)?
    oportunidad: bool = False

    # Una frase para el aviso de Telegram. En español, aunque la conversación sea en otro
    # idioma: quien lo lee es Wilfred.
    resumen: str = ""

    @field_validator("slot_id", "nombre", "correo", "resumen", mode="before")
    @classmethod
    def _recortar(cls, valor, info):
        if not isinstance(valor, str):
            return ""
        return valor.strip()[: cls.LARGOS[info.field_name]]

    @field_validator("correo")
    @classmethod
    def _correo_plausible(cls, valor: str) -> str:
        """
        Un correo que no lo parece se descarta en vez de rechazar el turno entero.

        Con esto no se manda una confirmación a una dirección inventada por el modelo, y
        el resto de la conversación sigue su curso: `chat.py` interpreta el campo vacío
        como "todavía falta su correo" y hace que el agente lo pida.
        """
        valor = valor.strip()
        return valor if _CORREO.match(valor) else ""
