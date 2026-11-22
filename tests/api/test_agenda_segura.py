import asyncio
from datetime import datetime, timedelta, timezone

import pytest

from _lib import agenda, calendario, chat, correo, firma, hojas, llm, telegram
from _lib.config import config
from _lib.modelos import ChatMessage, ChatRequest, Hueco, Intencion


def _hueco_firmado() -> Hueco:
    h = agenda.elegir([])[0]
    return h.model_copy(update={"firma": firma.firmar(h.id, h.inicio, h.fin)})


def _peticion(hueco: Hueco) -> ChatRequest:
    return ChatRequest(
        messages=[ChatMessage(role="user", content="me quedo con h1, soy Ana, ana@ejemplo.com")],
        offered_slots=[hueco],
    )


def _intencion() -> Intencion:
    return Intencion(intent="confirmar_hueco", slot_id="h1", nombre="Ana", correo="ana@ejemplo.com")


@pytest.fixture
def calendario_falso(monkeypatch):
    estado = {"pendientes": 0, "del_correo": 0, "creados": []}

    async def citas_del_chat(desde, hasta, huella=""):
        return estado["del_correo"] if huella else estado["pendientes"]

    async def ocupacion(desde, hasta):
        return []

    async def crear_evento(inicio, fin, nombre, correo_, resumen, huella):
        estado["creados"].append({"inicio": inicio, "correo": correo_, "huella": huella})
        return {"hangoutLink": ""}

    async def confirmar_cita(*args):
        return True

    monkeypatch.setattr(calendario, "citas_del_chat", citas_del_chat)
    monkeypatch.setattr(calendario, "ocupacion", ocupacion)
    monkeypatch.setattr(calendario, "crear_evento", crear_evento)
    monkeypatch.setattr(correo, "confirmar_cita", confirmar_cita)
    return estado


class TestFirma:
    def test_un_hueco_firmado_es_valido(self):
        h = _hueco_firmado()
        assert firma.valida(h.id, h.inicio, h.fin, h.firma)

    def test_cambiar_el_instante_invalida_la_firma(self):
        h = _hueco_firmado()
        otro = (datetime.fromisoformat(h.inicio) + timedelta(minutes=30)).isoformat()
        assert not firma.valida(h.id, otro, h.fin, h.firma)

    def test_una_firma_caducada_no_vale(self, monkeypatch):
        h = agenda.elegir([])[0]
        monkeypatch.setattr(firma, "VIGENCIA", timedelta(seconds=-1))
        caducada = firma.firmar(h.id, h.inicio, h.fin)
        assert not firma.valida(h.id, h.inicio, h.fin, caducada)

    @pytest.mark.parametrize("basura", ["", "abc", "123.", ".deadbeef", "9999999999.00"])
    def test_firmas_mal_formadas_no_valen(self, basura):
        h = agenda.elegir([])[0]
        assert not firma.valida(h.id, h.inicio, h.fin, basura)

    def test_sin_secreto_la_agenda_no_se_enciende(self, monkeypatch):
        monkeypatch.setenv("AGENDA_SECRETO", "corto")
        config.cache_clear()
        assert not config().agenda_activa


class TestConfirmarCita:
    def test_un_hueco_inventado_no_crea_cita(self, calendario_falso):
        h = agenda.elegir([])[0]
        bloque, cita = asyncio.run(chat._confirmar_cita(_peticion(h), _intencion()))
        assert cita is None
        assert calendario_falso["creados"] == []

    def test_un_hueco_firmado_crea_la_cita_marcada(self, calendario_falso):
        bloque, cita = asyncio.run(chat._confirmar_cita(_peticion(_hueco_firmado()), _intencion()))
        assert cita is not None
        [creado] = calendario_falso["creados"]
        assert creado["huella"] == firma.huella_correo("ana@ejemplo.com")
        assert "ana@ejemplo.com" not in creado["huella"]

    def test_un_correo_con_cita_pendiente_no_reserva_otra(self, calendario_falso):
        calendario_falso["del_correo"] = agenda.REGLAS.max_citas_por_correo
        _, cita = asyncio.run(chat._confirmar_cita(_peticion(_hueco_firmado()), _intencion()))
        assert cita is None
        assert calendario_falso["creados"] == []

    def test_con_la_agenda_llena_no_se_crean_mas(self, calendario_falso):
        calendario_falso["pendientes"] = agenda.REGLAS.max_citas_pendientes
        _, cita = asyncio.run(chat._confirmar_cita(_peticion(_hueco_firmado()), _intencion()))
        assert cita is None
        assert calendario_falso["creados"] == []


def test_la_cita_se_registra_aunque_el_visitante_cierre_el_chat(calendario_falso, monkeypatch):
    registradas = []

    async def clasificar(mensajes, bloque):
        return _intencion()

    async def responder(mensajes, bloque):
        for trozo in ["Listo, ", "queda agendada."]:
            yield trozo

    async def registrar_cita(*args):
        registradas.append(args)

    async def nada(*args, **kwargs):
        return None

    monkeypatch.setattr(llm, "clasificar", clasificar)
    monkeypatch.setattr(llm, "responder", responder)
    monkeypatch.setattr(hojas, "registrar_cita", registrar_cita)
    monkeypatch.setattr(hojas, "registrar_conversacion", nada)
    monkeypatch.setattr(telegram, "avisar", nada)

    async def visitante_que_cierra():
        flujo = chat.turno(_peticion(_hueco_firmado()), vid="v1")
        async for evento in flujo:
            if '"text"' in evento:
                break
        await flujo.aclose()
        await asyncio.gather(*chat._EN_VUELO)

    asyncio.run(visitante_que_cierra())
    assert len(registradas) == 1


def test_sheets_escribe_en_raw(monkeypatch):
    enviados = []

    class Respuesta:
        def raise_for_status(self):
            pass

    class Cliente:
        def __init__(self, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *exc):
            return False

        async def post(self, url, headers, params, json):
            enviados.append(params)
            return Respuesta()

    async def cabeceras():
        return {}

    monkeypatch.setattr(hojas.httpx, "AsyncClient", Cliente)
    monkeypatch.setattr(hojas, "cabeceras", cabeceras)
    asyncio.run(hojas.registrar_conversacion("v1", '=IMPORTXML("https://x";"//a")', "ok"))
    assert enviados[0]["valueInputOption"] == "RAW"


def test_la_fecha_del_prompt_va_en_hora_de_colombia(monkeypatch):
    from _lib import persona

    # 02:00 UTC del día 22 son las 21:00 del día 21 en Bogotá.
    instante = datetime(2026, 11, 22, 2, 0, tzinfo=timezone.utc).astimezone(agenda.zona())
    monkeypatch.setattr(agenda, "ahora", lambda: instante)
    assert "Fecha de hoy: 21/11/2026" in persona.system_prompt()
