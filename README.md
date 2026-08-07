# Portfolio · Wilfred Morales

Sitio personal de presentación, de una sola página, con un **agente conversacional
propio** que responde sobre la trayectoria y las decisiones detrás de cada proyecto, y
que puede agendar una llamada contra el calendario real.

La página está construida sobre una reconstrucción fiel de **Henry**, un sistema de
diseño editorial monocromático inspirado en carteles tipográficos: papel y tinta,
jerarquía por escala tipográfica y cero color.

## Destacados técnicos

- **Agente con base de conocimiento versionada** — el modelo solo sabe lo que hay en
  `api/_context/` (markdown, editable sin tocar Python), con límites explícitos sobre
  qué no puede afirmar. Respuestas en streaming por SSE.
- **Toda integración se degrada sola** — si falta una credencial, esa pieza se apaga y
  el chat sigue funcionando. Agendar, además, va detrás de su propio interruptor: es la
  única acción con efectos fuera del chat.
- **Placa halftone generada por código** — un retrato se convierte en tiempo real a
  1-bit con *dithering* ordenado (matriz Bayer 8×8) sobre `<canvas>`, recoloreado a la
  paleta del sistema y con un *spotlight* que sigue el cursor. Sin imágenes pretratadas.
- **Un solo origen para el contenido** — web y CV se generan del mismo archivo de perfil,
  en dos idiomas, con `satisfies Profile` para que a ninguno le falte una clave.
- **Accesible y responsive** — respeta `prefers-reduced-motion`, jerarquía semántica y
  se adapta de escritorio a móvil.

## Stack

**Frontend:** React 19 · TypeScript · Vite
**Backend:** Python · FastAPI (funciones serverless en Vercel) · httpx · DeepSeek
**Monorepo:** npm workspaces

## Arquitectura

| Paquete | Rol |
|---|---|
| `web/` | Frontend (React + Vite). La página y sus componentes. |
| `api/` | Backend (Python/FastAPI). Agente, agenda y notificaciones; las claves viven solo aquí. |
| `shared/` | Contratos de la API, tipados para el frontend. |
| `tools/cv/` | Generador del CV en PDF a partir del contenido de `web`. Script local, no se despliega. |

El frontend solo habla con el backend a través de un cliente HTTP tipado
(`web/src/lib/api.ts`). Los secretos residen exclusivamente en `api/.env`.

`shared/` es un contrato **acordado, no compartido**: el backend es Python y no importa
esos tipos, así que al tocar `shared/src/index.ts` hay que tocar también
`api/_lib/modelos.py`.

Todo el texto de la página vive en `web/src/content/profile.es.ts` y `profile.en.ts`,
incluidos los textos de interfaz. Ningún componente lleva copy escrito a mano.

## Puesta en marcha

```bash
npm install
pip install -r requirements.txt

npm run dev        # web (5173) + api (3001) en paralelo
npm run build      # bundle de producción del frontend
```

Otros scripts: `npm run typecheck -w @portfolio/web` (chequeo de tipos) y
`npm run build:cv` (regenera el CV en PDF, en los dos idiomas).

## Despliegue

**Vercel.** `vercel.json` define la instalación, el build del workspace `web` y el
enrutado de `/api/*` a la función Python. Cada push a `main` genera un despliegue.

## Créditos

El sistema de diseño **Henry** es obra de [Henry Desroches](https://henry.codes),
catalogado en [refero.design](https://styles.refero.design). Este proyecto es una
reinterpretación en React con fines de aprendizaje y portafolio; el código y el
contenido son propios. El retrato usado en la placa halftone es un grabado de Leonardo
da Vinci en dominio público.

## Autor

**Wilfred Morales** — Desarrollador backend
[GitHub](https://github.com/wilfred524) · [LinkedIn](https://www.linkedin.com/in/wilfred-morales-3220b2126)
