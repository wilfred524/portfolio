"""
Reglas de la cita y cálculo de huecos.

POR QUÉ ESTÁ AQUÍ Y NO EN EL MARKDOWN:
Las reglas las necesitan dos consumidores: el prompt (para que el agente sepa qué puede
prometer) y el código (para calcular huecos y crear el evento). Escritas en dos sitios
acabarían contradiciéndose y el agente ofrecería horas que el calendario no acepta. Aquí
se definen una vez y `persona.py` las inyecta en el prompt ya renderizadas.

**Para cambiar cuándo se atienden las llamadas, edita `REGLAS` y nada más.**
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from _lib.modelos import Hueco


@dataclass(frozen=True)
class Reglas:
    zona: str = "America/Bogota"
    duracion_minutos: int = 30
    # Franja de atención, hora local de Wilfred: jornada completa. La ventana estrecha de
    # antes existía porque tenía un empleo en horario de oficina, y rechazaba justo las
    # horas a las que llama un reclutador.
    hora_inicio: int = 8
    hora_fin: int = 20
    dias_laborables: tuple[int, ...] = (0, 1, 2, 3, 4)  # lunes=0 … viernes=4
    antelacion_minima_horas: int = 24
    antelacion_maxima_dias: int = 14
    idiomas: str = "español o inglés"
    huecos_a_ofrecer: int = 3


REGLAS = Reglas()

_DIAS = ("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo")


def zona() -> ZoneInfo:
    return ZoneInfo(REGLAS.zona)


def ahora() -> datetime:
    return datetime.now(zona())


def reglas_en_texto() -> str:
    """Las reglas, tal y como las lee el agente dentro del system prompt."""
    dias = ", ".join(_DIAS[d] for d in REGLAS.dias_laborables)
    return (
        "## Reglas de la cita (las fija el sistema, no las negocies)\n\n"
        f"- Duración: {REGLAS.duracion_minutos} minutos.\n"
        f"- Días: {dias}. Franja: {REGLAS.hora_inicio}:00–{REGLAS.hora_fin}:00, "
        f"hora de Colombia ({REGLAS.zona}, GMT-5).\n"
        f"- Antelación mínima: {REGLAS.antelacion_minima_horas} horas. "
        f"Máxima: {REGLAS.antelacion_maxima_dias} días.\n"
        f"- Idioma de la llamada: {REGLAS.idiomas}.\n"
        f"- Ofrece siempre los huecos que te dé el sistema, con su identificador, y "
        f"nunca inventes otros ni muevas una hora aunque te lo pidan: si ninguno le "
        f"sirve, dilo y ofrece el correo de Wilfred.\n"
    )


def _candidatos(desde: datetime, hasta: datetime) -> list[tuple[datetime, datetime]]:
    """Todos los inicios posibles dentro de la franja, en orden cronológico."""
    paso = timedelta(minutes=REGLAS.duracion_minutos)
    huecos: list[tuple[datetime, datetime]] = []

    dia = desde.astimezone(zona()).replace(minute=0, second=0, microsecond=0)
    while dia <= hasta:
        if dia.weekday() in REGLAS.dias_laborables:
            inicio = dia.replace(hour=REGLAS.hora_inicio)
            fin_franja = dia.replace(hour=REGLAS.hora_fin)
            while inicio + paso <= fin_franja:
                if desde <= inicio and inicio + paso <= hasta:
                    huecos.append((inicio, inicio + paso))
                inicio += paso
        dia = (dia + timedelta(days=1)).replace(hour=0)

    return huecos


def _libre(inicio: datetime, fin: datetime, ocupado: list[tuple[datetime, datetime]]) -> bool:
    return not any(inicio < ocupado_fin and ocupado_inicio < fin for ocupado_inicio, ocupado_fin in ocupado)


def etiqueta(inicio: datetime) -> str:
    """«jueves 7 de agosto, 19:00 (hora de Colombia, GMT-5)»"""
    local = inicio.astimezone(zona())
    return (
        f"{_DIAS[local.weekday()]} {local.day} de "
        f"{_MESES[local.month - 1]}, {local:%H:%M} (hora de Colombia, GMT-5)"
    )


_MESES = (
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
)


def elegir(ocupado: list[tuple[datetime, datetime]]) -> list[Hueco]:
    """
    Los huecos que se ofrecen, ya filtrados por la ocupación real del calendario.

    Se reparten en días distintos mientras haya para elegir: tres horas seguidas del
    mismo jueves parecen menos disponibilidad de la que hay, y si ese día no le viene
    bien, el visitante se queda sin opciones.
    """
    inicio = ahora() + timedelta(hours=REGLAS.antelacion_minima_horas)
    fin = ahora() + timedelta(days=REGLAS.antelacion_maxima_dias)

    libres = [(a, b) for a, b in _candidatos(inicio, fin) if _libre(a, b, ocupado)]

    elegidos: list[tuple[datetime, datetime]] = []
    dias_usados: set = set()
    for a, b in libres:
        if a.date() not in dias_usados:
            elegidos.append((a, b))
            dias_usados.add(a.date())
        if len(elegidos) == REGLAS.huecos_a_ofrecer:
            break

    # Si el calendario está tan lleno que no hay días distintos suficientes, se completa
    # con lo que quede, aunque repita día.
    for a, b in libres:
        if len(elegidos) == REGLAS.huecos_a_ofrecer:
            break
        if (a, b) not in elegidos:
            elegidos.append((a, b))

    elegidos.sort()
    return [
        Hueco(id=f"h{i}", inicio=a.isoformat(), fin=b.isoformat(), etiqueta=etiqueta(a))
        for i, (a, b) in enumerate(elegidos, start=1)
    ]


def dentro_de_reglas(
    inicio: datetime, fin: datetime, ocupado: list[tuple[datetime, datetime]]
) -> bool:
    """
    Revalida un hueco antes de crear el evento.

    Los huecos viajan al navegador y vuelven, así que llegan como dato no fiable: pueden
    venir manipulados, o simplemente haber caducado mientras el visitante se lo pensaba —
    entre que se le ofrecieron y confirma, ese rato puede haberse ocupado. Lo que decide
    es esta comprobación contra el calendario real, no lo que diga el cliente.

    Se exige que el hueco esté **en la rejilla** (`_candidatos`) y no solo dentro de la
    franja: comprobar la hora a secas dejaría pasar un inicio a las 20:59, que se saldría
    de la franja por la cola.
    """
    duracion_ok = abs((fin - inicio).total_seconds() - REGLAS.duracion_minutos * 60) < 60
    if not duracion_ok:
        return False

    desde = ahora() + timedelta(hours=REGLAS.antelacion_minima_horas)
    hasta = ahora() + timedelta(days=REGLAS.antelacion_maxima_dias)
    if not (desde <= inicio <= hasta):
        return False

    en_rejilla = any(candidato == inicio for candidato, _ in _candidatos(desde, hasta))
    return en_rejilla and _libre(inicio, fin, ocupado)
