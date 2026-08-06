# Arquitectura

Monorepo con **npm workspaces**. Raíz: `C:\Users\GAF\workspace\portfolio`.
Repo: https://github.com/wilfred524/portfolio (público, remoto SSH).

## Paquetes

| Paquete | Nombre npm | Rol | Puerto dev |
|---|---|---|---|
| `web/` | `@portfolio/web` | Frontend React 19 + Vite + TS | 5173 |
| `api/` | — (no es workspace npm) | Backend **Python + FastAPI**: salud y agente de IA | 3001 |
| `shared/` | `@portfolio/shared` | Contratos de la API tipados | — |
| `tools/cv/` | `@portfolio/cv` | Script local que genera los PDF del CV | — |

`api/` no aparece en `workspaces` porque ya no es JavaScript: sus dependencias están en
`requirements.txt` y las instala Vercel, no npm.

## Reglas de separación

- El frontend **solo** habla con el backend por `web/src/lib/api.ts` (tipado con
  `@portfolio/shared`), vía el proxy `/api` de Vite (`web/vite.config.ts`).
- Ningún componente contiene lógica de negocio ni llamadas HTTP sueltas.
- Secretos **solo** en `api/.env` en local (plantilla `api/.env.example`) y en el panel de
  Vercel en producción.
- `shared/` es un contrato **acordado, no compartido**: el backend es Python y no importa
  esos tipos. Al cambiar `shared/src/index.ts` hay que cambiar `api/_lib/modelos.py` a
  mano; ningún compilador avisa.

## Estructura de `web/src`

```
main.tsx / App.tsx        monta HenryPage; sin router
lib/api.ts                cliente HTTP tipado (único punto de contacto con /api)
content/types.ts          forma del contenido; el `satisfies Profile` fuerza paridad
content/profile.en.ts     contenido en inglés (idioma por defecto)
content/profile.es.ts     contenido en español
content/index.ts          content = { en, es }, Lang, LANGS
i18n/LanguageProvider.tsx idioma activo (localStorage) + useContent()
hooks/                    useReveal.ts, useScrollProgress.ts, useScrollSlide.ts
styles/global.css         reset + @font-face de Switzer
designs/henry/            el diseño Henry (design.md, henry.css, HenryPage.tsx, components/)
```

## Estructura de `api/`

```
index.py            declara las rutas y nada más
_context/           lo que el agente sabe, en markdown (ver su propio README)
_lib/               todo lo que piensa; el guion bajo lo excluye del enrutado de Vercel
  config.py         única lectura del entorno; cada integración expone si está activa
  guard.py          blindaje del endpoint público (longitud, tamaño, frecuencia)
  persona.py        arma el system prompt desde _context/
  llm.py            DeepSeek por REST (httpx): streaming + clasificación JSON
  chat.py           orquesta un turno completo
  agenda.py         reglas de la cita y cálculo de huecos  ← se edita para cambiar horarios
  calendario.py     Google Calendar (freeBusy + crear evento)
  hojas.py          Google Sheets (append)
  correo.py         Resend
  telegram.py       aviso a Wilfred
  google.py         token de la cuenta de servicio
  modelos.py        contratos Pydantic (espejo de shared/src/index.ts)
```

### Cómo funciona un turno de chat

```
POST /api/chat  (mismo origen, sin CORS)
  │
  ├─ guard: longitud del mensaje, tamaño del historial, 20 peticiones/10 min por visitante
  │         visitor_id = sha256(ip + sal); la IP cruda nunca se guarda
  │
  ├─ clasificación JSON (solo si hay agenda/Telegram/Sheets que puedan reaccionar)
  │         intención · nombre · correo · ¿oportunidad real? · resumen
  │
  ├─ acción determinista ANTES de responder
  │         pedir_huecos    → freeBusy → 3 huecos reales → se inyectan en el prompt
  │         confirmar_hueco → revalida → crea evento con Meet → correo → Sheets → Telegram
  │
  ├─ respuesta en streaming SSE (eventos text · slots · error · done)
  │
  └─ registro, ya con el visitante servido: Sheets siempre, Telegram si hay oportunidad
```

Se usa **salida JSON estructurada y no *tool calling***: DeepSeek no es fiable llamando
herramientas, y crear un evento en el calendario de alguien no puede depender de que un
modelo acierte con el formato de una llamada.

Se habla con DeepSeek por REST con `httpx`, sin LiteLLM: pesaba 133 MB de los 199 que
ocupaban las dependencias, contra un límite de 250 MB por función en Vercel. Su API es
compatible con la de OpenAI, así que el cliente entero son unas 40 líneas.

Cada integración se apaga sola si le falta su credencial (`config().*_activo`). La agenda
necesita además `AGENDA_HABILITADA=1`, y **por defecto está apagada**: es la única acción
del agente con consecuencias fuera del chat —crea eventos reales y escribe a
desconocidos—, así que no debe encenderse por el descuido de dejar una variable puesta en
un panel. Apagada, el agente ni siquiera lee `50-agenda.md` y recibe una instrucción
explícita de no mencionar llamadas: da el correo y el teléfono.

## Rutas

**Ninguna en el frontend: el sitio es una sola página.** La colección de diseños
(`/disenos`, `GalleryPage`, `designs/registry.ts`, `DesignMenu`) se retiró — varias
páginas diluían el mensaje. Con ella salió `react-router-dom`.

En el backend hay dos: `GET /api/health` y `POST /api/chat`.

## Comandos

```bash
npm install                          # instala los workspaces JS (web, shared, tools/cv)
pip install -r requirements.txt      # dependencias del backend Python
npm run dev                          # concurrently: api (uvicorn) + web (vite)
npm run build -w @portfolio/web      # bundle web → web/dist
npm run typecheck -w @portfolio/web  # tsc -b; también verifica la paridad es/en
npm run build:cv -w @portfolio/cv    # CV en HTML y PDF, ambos idiomas → web/public/
```

## Notas técnicas

- Vite 8 requiere Node ≥ 20.19 / 22 (`engines: ">=22"` en la raíz; `.nvmrc` = 22).
- El backend corre en Python 3.12 en Vercel (`.python-version`). En local vale 3.13.
- El build de `web` es **solo `vite build`**; el chequeo de tipos es aparte (`typecheck`).
  Motivo en [`deployment.md`](deployment.md).
