# Despliegue (Vercel)

El sitio se despliega en **Vercel** desde `main` (cada push redespliega).
Config en `vercel.json` (raíz). **Un solo proyecto de Vercel**: el frontend estático y la
función Python conviven en el mismo origen, así que no hay CORS ni una URL aparte para la
API.

## Configuración correcta

`vercel.json`:
```json
{
  "installCommand": "npm install --include=dev",
  "buildCommand": "npm run build -w @portfolio/web",
  "outputDirectory": "web/dist",
  "functions": { "api/index.py": { "maxDuration": 60 } }
}
```

Ya **no hay `rewrites`**: el fallback SPA se retiró junto con `react-router-dom` — el
sitio es una sola página y no hay ruta que recargar. Si volviera a añadirse un router,
hay que tener cuidado de que el *rewrite* no se trague también `/api/*`.

`functions` declara la función Python. Vercel publica como ruta HTTP cada `.py` de `api/`
que exponga una app ASGI; los archivos y carpetas que empiezan por `_` (`_lib/`,
`_context/`) viajan en el paquete pero **no** se publican.

**Ajustes del panel de Vercel (críticos):**
- **Root Directory** = raíz del repo (vacío / `./`). **NO** `web` ni `api`.
- **Framework Preset** = **Other** (no "Vite").
- Install/Build/Output = sin override (los define `vercel.json`).

## Variables de entorno

Se cargan en *Settings → Environment Variables* del proyecto. En local viven en
`api/.env` (fuera de git); la plantilla versionada es `api/.env.example`.

| Variable | Para qué | Si falta |
|---|---|---|
| `DEEPSEEK_API_KEY` | El modelo que responde | `/api/chat` devuelve 503 |
| `VISITOR_ID_SALT` | Deriva `sha256(ip + sal)` | El hash deja de ser secreto; ponla siempre |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Aviso al móvil | No se avisa; el chat sigue |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Cuenta de servicio, JSON en una línea | Sin Sheets ni Calendar |
| `GOOGLE_SHEET_ID` | Hoja de registro | No se registra nada |
| `GOOGLE_CALENDAR_ID` | Calendario de las llamadas | **El agente no menciona llamadas** |
| `AGENDA_HABILITADA` | Interruptor de la agenda (`1` para encenderla) | **Apagada**: el agente conversa y da el correo |
| `RESEND_API_KEY`, `RESEND_FROM` | Correo de confirmación | La cita se crea igual, sin correo |

Cambiar una variable **no** redespliega: hay que forzar un redespliegue para que la
función la vea.

### Preparar Google (una vez)

1. Proyecto en Google Cloud con **Sheets API** y **Calendar API** habilitadas.
2. Crear una **cuenta de servicio** y descargar su clave JSON.
3. Pegar el JSON entero, en una sola línea, en `GOOGLE_SERVICE_ACCOUNT_JSON`.
4. **Compartir con el correo de la cuenta de servicio**: la hoja (permiso de edición) y el
   calendario (permiso «hacer cambios en los eventos»). Sin esto, las llamadas devuelven
   403 aunque las credenciales sean correctas — es el fallo más habitual.
5. La hoja necesita tres pestañas con estos nombres exactos: `conversaciones`, `leads`,
   `agenda`.

Al visitante **no se le añade como invitado** al evento: una cuenta de servicio no puede
invitar a terceros sin delegación de dominio (solo existe en Workspace). Por eso la
confirmación va por Resend, con el enlace de Meet dentro.

## Errores ya resueltos (no repetir)

1. **Root Directory = `api`** → Vercel construía el backend y no encontraba `vercel.json`.
   Fix: Root Directory en la raíz + Preset "Other". *(Esta fue la causa real de los fallos;
   revisar SIEMPRE los ajustes del panel del servicio ante fallos que dependen del entorno.)*
2. **`vite`/`typescript` en `devDependencies`** → Vercel instala con `NODE_ENV=production`
   y omite devDependencies (`vite: command not found`, "91 packages" en vez de ~154).
   Fix: **`vite` y `@vitejs/plugin-react` viven en `dependencies`** (regla general: todo
   lo que el build de producción ejecuta va en `dependencies`).
3. **`tsc -b` en el build** fallaba resolviendo el tipo `vite/client` en el entorno de
   Vercel. Fix: el build de `web` es **solo `vite build`**; el chequeo de tipos es un
   script aparte (`npm run typecheck`). `tsc` con `noEmit` solo verifica, no construye.
4. **Varios proyectos creados en Vercel** por lanzar `vercel` desde subcarpetas distintas.
   Debe haber **uno solo**, enlazado en la raíz del repo.

## Coste y abuso

`/api/chat` es público y cada mensaje gasta tokens de DeepSeek. `_lib/guard.py` limita
longitud del mensaje, tamaño del historial y frecuencia (20 peticiones / 10 min por
visitante). El contador vive en memoria: Vercel puede levantar varias instancias, así que
frena el abuso accidental, no a un atacante decidido. Si algún día hiciera falta más, la
salida es un contador compartido (Redis) o el rate limiting del propio Vercel. Mientras
tanto, conviene mirar de vez en cuando el consumo en el panel de DeepSeek.

## Git / flujo

- Remoto SSH (`git@github.com:wilfred524/portfolio.git`); `git push` funciona desde
  cualquier terminal del usuario. `gh` autenticado (keyring) para PRs/merges.
- Micro-arreglos de deploy: commit directo a `main` (mantener historial limpio).
- Cambios de diseño/código: rama + PR, merge bajo confirmación del usuario.
