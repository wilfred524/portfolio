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
"""

from datetime import datetime, timezone

from fastapi import FastAPI

SERVICE_NAME = "portfolio-api"

app = FastAPI(
    title=SERVICE_NAME,
    docs_url=None,  # el portafolio no publica su API: la documentación interactiva sobra
    redoc_url=None,
    openapi_url=None,
)


@app.get("/api/health")
def health() -> dict[str, str]:
    """Sonda de vida. Mantiene el mismo contrato que el antiguo endpoint de Express."""
    return {
        "status": "ok",
        "service": SERVICE_NAME,
        # Con Z explícita: `isoformat()` sobre un datetime con tzinfo escribe "+00:00",
        # y el `Date` de JavaScript lo acepta, pero el contrato de shared dice ISO en UTC.
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
