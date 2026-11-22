"""
Backend del portafolio: FastAPI sobre el runtime Python de Vercel.

    npm run dev:api        (local, con recarga en http://localhost:3001)

POR QUÉ ASÍ:
- Antes esto era un Express con un único endpoint que nunca llegó a desplegarse. Al
  añadir el agente de IA se pasó a Python, que es el lenguaje del resto de la lógica
  (LiteLLM, clientes de Google) y el que Vercel sabe ejecutar como función serverless.
- Vercel toma cada `.py` de `api/` que exponga una app ASGI y lo publica como función.
  Por eso las rutas se declaran con el prefijo `/api` completo: la función recibe la
  URL tal cual la pide el navegador, sin que nadie le recorte el prefijo.
- El frontend es estático y se sirve del mismo origen, así que no hace falta CORS:
  `web/src/lib/api.ts` llama a rutas relativas `/api/...`.

Este archivo solo declara rutas. Todo lo que piensa vive en `_lib/`, que Vercel empaqueta
pero no publica (el guion bajo lo excluye del enrutado).
"""

import sys
from datetime import datetime, timezone
from pathlib import Path

# Vercel ejecuta la función desde la raíz del proyecto, no desde `api/`, así que sin esto
# `import _lib...` no resuelve. En local, `uvicorn --app-dir api` ya lo hace por su cuenta;
# repetirlo aquí es inofensivo y deja el arranque igual en los dos sitios.
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import APIRouter, FastAPI, Request  # noqa: E402
from fastapi.responses import JSONResponse, StreamingResponse  # noqa: E402

from _lib import guard  # noqa: E402
from _lib.chat import turno  # noqa: E402
from _lib.config import config  # noqa: E402
from _lib.modelos import ChatRequest  # noqa: E402

SERVICE_NAME = "portfolio-api"

app = FastAPI(
    title=SERVICE_NAME,
    docs_url=None,  # el portafolio no publica su API: la documentación interactiva sobra
    redoc_url=None,
    openapi_url=None,
)

# Las rutas se declaran una vez y se registran DOS: con `/api` y sin él.
#
# Vercel publica `api/index.py` en `/api`, no en `/api/*`: sin el `rewrite` de
# `vercel.json`, una petición a `/api/health` ni siquiera llega a la función (404 del
# enrutador, comprobado en producción). Y con el rewrite puesto, que la función reciba el
# path original o el reescrito depende de la plataforma. Registrando el router por
# duplicado, cualquiera de los dos casos responde igual, en local y desplegado.
rutas = APIRouter()


@rutas.get("/health")
def health() -> dict[str, str]:
    """Sonda de vida. Mantiene el mismo contrato que el antiguo endpoint de Express."""
    return {
        "status": "ok",
        "service": SERVICE_NAME,
        # Con Z explícita: `isoformat()` sobre un datetime con tzinfo escribe "+00:00",
        # y el `Date` de JavaScript lo acepta, pero el contrato de shared dice ISO en UTC.
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


@rutas.post("/chat")
async def chat(peticion: ChatRequest, request: Request):
    """
    Un turno de conversación, devuelto como flujo de eventos.

    Los errores de validación se resuelven ANTES de abrir el flujo: una vez enviada la
    primera línea de un `text/event-stream`, el estado HTTP ya está mandado y no se puede
    contestar 429. Por eso el blindaje va aquí y no dentro del generador.
    """
    if not config().chat_activo:
        return JSONResponse(
            {"error": "El chat no está disponible ahora mismo."}, status_code=503
        )

    vid = guard.visitor_id(request.headers)
    try:
        guard.comprobar_frecuencia(vid)
        guard.comprobar_conversacion(peticion.messages)
    except guard.LimiteSuperado as limite:
        return JSONResponse({"error": limite.mensaje}, status_code=limite.codigo)

    return StreamingResponse(
        turno(peticion, vid),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            # Sin esto, un proxy con buffering acumula el flujo y lo entrega de golpe al
            # final: el efecto de "está escribiendo" se pierde por completo.
            "X-Accel-Buffering": "no",
        },
    )


app.include_router(rutas, prefix="/api")
app.include_router(rutas)
