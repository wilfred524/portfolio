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

## Correo (Resend)

El correo de confirmación de cita (`_lib/correo.py`) está escrito y verificado, pero **hoy
no puede llegar a un visitante**.

`RESEND_FROM` usa `onboarding@resend.dev`, que es el sandbox de Resend: solo entrega en la
dirección con la que se registró la cuenta y en las direcciones de prueba `*@resend.dev`.
Para cualquier otro destinatario la API responde con un error de dominio no verificado.

Comprobado el 2026-08-11, ejercitando `correo.confirmar_cita()`:

| Destinatario | Resultado |
|---|---|
| La dirección de la cuenta | aceptado |
| `delivered@resend.dev` | aceptado |
| Un tercero cualquiera | rechazado |

Desbloquearlo exige un **dominio propio verificado** en Resend (registros DKIM, SPF y MX,
normalmente sobre un subdominio de envío tipo `send.tudominio.com`). Un subdominio de
`vercel.app` no sirve: no se controla su zona DNS.

**No es urgente.** El correo solo se dispara al confirmar una cita, y la agenda está
apagada por dos motivos independientes: no hay `GOOGLE_CALENDAR_ID` y `AGENDA_HABILITADA`
está en falso por diseño (ver `_lib/config.py`). Mientras tanto el fallo se degrada como
debe: `confirmar_cita()` nunca lanza, registra el aviso y devuelve `False`, la cita sigue
existiendo en el calendario y el agente lo dice en el chat.
