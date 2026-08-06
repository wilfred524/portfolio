# api — backend Python

FastAPI sobre el runtime Python de Vercel. Sustituye al backend Express anterior, que
tenía un único endpoint y nunca llegó a desplegarse.

## Puesta en marcha (una sola vez)

Desde la **raíz** del repositorio:

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt     # Windows
# source .venv/bin/activate && pip install -r requirements.txt   (macOS/Linux)

cp api/.env.example api/.env                      # y rellenar las claves
```

## Desarrollo

```bash
npm run dev        # levanta api (3001) y web (5173) a la vez
npm run dev:api    # solo el backend, con recarga automática
```

El frontend llama a rutas relativas `/api/...`; en local las redirige el proxy de Vite
(`web/vite.config.ts`) al puerto 3001, y en producción se sirven desde el mismo origen.

## Cómo lo despliega Vercel

- Cada `.py` de `api/` que exponga una app ASGI se publica como Vercel Function.
- Las dependencias salen de `requirements.txt` **en la raíz** del proyecto, no de esta
  carpeta; la versión de Python, de `.python-version`.
- Las rutas se declaran con el prefijo `/api` completo (`@app.get("/api/health")`):
  la función recibe la URL tal como la pide el navegador.
- El límite de duración está en `vercel.json` (`maxDuration`). El plan Hobby admite hasta
  300 s; está puesto en 60, que sobra para una respuesta con streaming y evita que un
  abuso mantenga funciones vivas cinco minutos.

## Variables de entorno

En local se leen de `api/.env`. **En producción no**: se cargan en el panel de Vercel
(Settings → Environment Variables). La plantilla de referencia es `api/.env.example`.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/api/health` | Sonda de vida. Mismo contrato que el antiguo endpoint de Express (`HealthResponse` en `shared/`) |
