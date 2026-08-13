"""
Orquestación de un turno de conversación.

EL RECORRIDO DE UN MENSAJE:

    blindaje → lectura de intención → acción determinista → respuesta en streaming → registro

POR QUÉ EN ESTE ORDEN:
- La **acción va antes que la respuesta**, no después. Si el visitante confirma un hueco,
  la cita se crea primero y el agente la anuncia después, con el resultado real delante.
  Al revés, el agente anunciaría una cita que todavía puede fallar — justo lo que
  `_context/50-agenda.md` prohíbe.
- El **registro va al final y no interrumpe**: Sheets y Telegram son para Wilfred; si
  fallan, el visitante no se entera y su respuesta ya está entregada.
- Una sola llamada de clasificación por turno, y solo cuando puede cambiar algo. Cada
  llamada de más es dinero de DeepSeek por conversación.

FORMATO DE SALIDA: SSE (`text/event-stream`). Se elige frente a WebSocket porque es
unidireccional, sobrevive a una función serverless y no necesita servidor con estado; y
frente a devolver el texto de golpe porque ver escribir al agente es la diferencia entre
parecer vivo y parecer colgado.
"""

from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator
from datetime import timedelta

from _lib import agenda, calendario, correo, hojas, llm, telegram
from _lib.config import config
from _lib.modelos import ChatRequest, Hueco, Intencion

log = logging.getLogger("portfolio.chat")


# Cuando la agenda no está conectada hay que DECÍRSELO, no confiar en que lo deduzca de
# no ver un bloque de horarios. Probado: sin esta frase, ante "¿podemos hablar mañana?"
# el modelo contesta «sí, hay espacio para agendar una llamada mañana» — promete una cita
# que el sistema no puede crear, que es justo el fallo que `50-agenda.md` prohíbe. La
# ausencia de información no es una instrucción; esto sí.
AGENDA_APAGADA = (
    "# Situación\n\nLa agenda automática no está disponible en este momento. **No ofrezcas "
    "llamadas, ni horarios, ni disponibilidad de ningún tipo, aunque te la pidan.** Si "
    "quieren hablar con Wilfred, dales su correo (wilfred3019@gmail.com) y su teléfono, "
    "que están en la página, y di que él mismo acordará la hora."
)


def _evento(tipo: str, valor=None) -> str:
    carga = {"type": tipo}
    if valor is not None:
        carga["value"] = valor
    return f"data: {json.dumps(carga, ensure_ascii=False)}\n\n"


async def _preparar_huecos() -> tuple[str, list[Hueco]]:
    """Consulta el calendario y redacta el bloque que verá el agente."""
    try:
        desde = agenda.ahora()
        hasta = desde + timedelta(days=agenda.REGLAS.antelacion_maxima_dias)
        ocupado = await calendario.ocupacion(desde, hasta)
        huecos = agenda.elegir(ocupado)
    except Exception:
        log.warning("No se pudo consultar el calendario", exc_info=True)
        return (
            "# Situación\n\nLa agenda no responde ahora mismo. Dilo con franqueza y ofrece "
            "el correo de Wilfred como alternativa. No inventes horarios.",
            [],
        )

    if not huecos:
        return (
            "# Situación\n\nNo hay huecos libres en las próximas dos semanas. Dilo y ofrece "
            "el correo de Wilfred.",
            [],
        )

    lista = "\n".join(f"- {h.id}: {h.etiqueta}" for h in huecos)
    bloque = (
        "# Situación\n\nEstos son los huecos libres reales del calendario de Wilfred. "
        "Ofréceselos ahora, con naturalidad, mencionando el identificador entre "
        "paréntesis para que pueda elegir. Si acepta uno, necesitarás su nombre y su "
        "correo.\n\n" + lista
    )
    return bloque, huecos


async def _confirmar_cita(peticion: ChatRequest, intencion: Intencion) -> tuple[str, dict | None]:
    """
    Crea la cita si todo cuadra.

    Devuelve el bloque de situación para el agente y, si la cita se creó, los datos que
    hay que registrar **después** de responder al visitante. Nada de Sheets ni Telegram
    aquí dentro: cada uno son segundos de espera antes del primer token, y el visitante
    los pasaría mirando un chat que parece colgado justo en el momento decisivo.
    """
    elegido = next((h for h in peticion.offered_slots if h.id == intencion.slot_id), None)
    if elegido is None:
        return (
            "# Situación\n\nNo queda claro qué hueco eligió. Pregúntaselo indicando otra vez "
            "las opciones que le diste.",
            None,
        )

    if not intencion.correo:
        return (
            "# Situación\n\nEligió un hueco pero todavía falta su nombre y su correo. "
            "Pídeselos en una sola frase; sin ellos no se puede crear la cita.",
            None,
        )

    # `Hueco` ya garantizó que son fechas ISO con zona: aquí no puede reventar el parseo.
    inicio = elegido.como_fecha("inicio")
    fin = elegido.como_fecha("fin")

    caducado = (
        "# Situación\n\nEse horario ya no está disponible. Discúlpate en una frase y vuelve "
        "a proponer huecos en el siguiente mensaje.",
        None,
    )

    try:
        ocupado = await calendario.ocupacion(inicio, fin)
        if not agenda.dentro_de_reglas(inicio, fin, ocupado):
            return caducado
        evento = await calendario.crear_evento(
            inicio, fin, intencion.nombre, intencion.correo, intencion.resumen
        )
    except Exception as fallo:
        log.warning("No se pudo crear el evento en el calendario: %s", type(fallo).__name__)
        return (
            "# Situación\n\nLa cita NO se ha podido crear por un fallo del sistema. Dilo con "
            "franqueza, no la des por hecha, y ofrece el correo de Wilfred.",
            None,
        )

    enlace = calendario.enlace_videollamada(evento)
    cuando = agenda.etiqueta(inicio)

    # El correo sí va antes de responder: el agente tiene que decir la verdad sobre si le
    # va a llegar o no, y para eso hace falta saberlo ya.
    enviado = await correo.confirmar_cita(intencion.correo, intencion.nombre, cuando, enlace)

    cita = {
        "nombre": intencion.nombre,
        "correo": intencion.correo,
        "inicio": elegido.inicio,
        "cuando": cuando,
        "enlace": enlace,
        "resumen": intencion.resumen,
    }

    # Dos cosas pueden faltar por separado, y el agente tiene que decir la verdad sobre
    # cada una: que el correo salga no implica que lleve enlace, porque una cuenta de
    # servicio sobre un calendario personal no puede crear salas de Meet.
    if not enviado:
        aviso_correo = (
            "El correo de confirmación NO ha salido. No prometas ningún correo: dile que "
            "Wilfred le escribe a la dirección que dejó para pasarle el enlace."
        )
    elif not enlace:
        aviso_correo = (
            "Le llega un correo de confirmación, pero SIN enlace de videollamada: dile que "
            "el enlace se lo pasa Wilfred antes de la reunión. No inventes ningún enlace."
        )
    else:
        aviso_correo = "Le llega la confirmación por correo con el enlace."
    return (
        f"# Situación\n\nLa cita YA está creada en el calendario: {cuando}. "
        f"Anúnciala en una frase. {aviso_correo}",
        cita,
    )


async def turno(peticion: ChatRequest, vid: str) -> AsyncIterator[str]:
    """Procesa un turno completo y va emitiendo eventos SSE."""
    pregunta = peticion.messages[-1].content
    intencion = Intencion()
    bloque = ""
    huecos: list[Hueco] = []
    cita: dict | None = None

    # La clasificación solo se paga cuando puede cambiar algo: si no hay agenda conectada
    # y no hay Telegram ni Sheets que avisar, no hay nada que decidir.
    hace_falta_clasificar = config().agenda_activa or config().telegram_activo or config().sheets_activo
    if hace_falta_clasificar:
        intencion = await llm.clasificar(peticion.messages, "")

    if not config().agenda_activa:
        bloque = AGENDA_APAGADA
    elif intencion.intent == "pedir_huecos":
        bloque, huecos = await _preparar_huecos()
    elif intencion.intent == "confirmar_hueco":
        bloque, cita = await _confirmar_cita(peticion, intencion)

    if huecos:
        # Se emiten antes del texto para que el navegador ya los tenga guardados cuando el
        # visitante conteste, aunque cierre y vuelva a abrir el chat.
        yield _evento("slots", [h.model_dump() for h in huecos])

    partes: list[str] = []
    try:
        async for trozo in llm.responder(peticion.messages, bloque):
            partes.append(trozo)
            yield _evento("text", trozo)
    except Exception:
        log.error("Fallo generando la respuesta", exc_info=True)
        yield _evento(
            "error",
            "Ahora mismo no puedo responder. Escríbele a wilfred3019@gmail.com.",
        )
        return

    respuesta = "".join(partes)

    # Los registros van ANTES del `done` y no después.
    #
    # Parece al revés de lo razonable —el visitante ya tiene su texto completo, ¿por qué
    # hacerle esperar?— pero en cuanto el navegador ve el `done` puede cerrar la conexión,
    # y al cerrarla Starlette mata este generador: todo lo que quedara detrás no se
    # ejecutaría nunca. Se perdería justo el lead que motivó todo esto. En serverless no
    # existe el "después de la respuesta": o pasa dentro del turno, o no pasa.
    #
    # Nada de lo que sigue puede afectar al visitante: todas fallan en silencio.
    await hojas.registrar_conversacion(vid, pregunta, respuesta)

    if cita:
        await hojas.registrar_cita(vid, cita["nombre"], cita["correo"], cita["inicio"], cita["enlace"])
        await telegram.avisar(
            "Llamada agendada",
            [
                ("Cuándo", cita["cuando"]),
                ("Nombre", cita["nombre"] or "(no lo dijo)"),
                ("Correo", cita["correo"]),
                ("Enlace", cita["enlace"]),
            ],
            cita["resumen"],
        )
    elif intencion.oportunidad:
        await hojas.registrar_lead(vid, intencion.nombre, intencion.correo, intencion.resumen)
        await telegram.avisar(
            "Visita interesante en el portafolio",
            [
                ("Nombre", intencion.nombre or "(no lo dijo)"),
                ("Correo", intencion.correo or "(no lo dijo)"),
            ],
            f"{intencion.resumen}\n\nÚltimo mensaje: {pregunta[:300]}",
        )

    yield _evento("done")
