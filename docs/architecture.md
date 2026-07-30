# Arquitectura

Monorepo con **npm workspaces**. Raíz: `C:\Users\GAF\Desktop\portfolio`.
Repo: https://github.com/wilfred524/portfolio (público, remoto SSH).

## Paquetes

| Paquete | Nombre npm | Rol | Puerto dev |
|---|---|---|---|
| `web/` | `@portfolio/web` | Frontend React 19 + Vite + TS | 5173 |
| `api/` | `@portfolio/api` | Backend Express + TS (demos IA/APIs futuras) | 3001 |
| `shared/` | `@portfolio/shared` | Contratos de la API tipados | — |

## Reglas de separación

- El frontend **solo** habla con el backend por `web/src/lib/api.ts` (wrapper de `fetch`
  tipado con `@portfolio/shared`), vía el proxy `/api` de Vite (`web/vite.config.ts`).
- Ningún componente contiene lógica de negocio ni llamadas HTTP sueltas.
- Secretos (`OPENAI_API_KEY`, etc.) **solo** en `api/.env` (plantilla `api/.env.example`).
- Hoy la UI **no** llama al backend; el sitio es estático en la práctica. `api` tiene
  `GET /api/health` como base.

## Estructura de `web/src`

```
main.tsx / App.tsx        Router (react-router-dom v7) + rutas
lib/api.ts                cliente HTTP tipado (único punto de contacto con /api)
content/profile.ts        TODO el contenido (nombre, bio, skills, proyectos, contacto)
hooks/                    useReveal.ts, useScrollSlide.ts
components/               DesignSwitcher.tsx (selector flotante de diseños)
styles/global.css         reset + @font-face de Switzer
designs/registry.ts       registro de diseños (slug, nombre, componente lazy)
designs/henry/            el diseño Henry (design.md, henry.css, HenryPage.tsx, components/)
pages/GalleryPage.tsx     índice /disenos
```

## Rutas

- `/` → `HenryPage` (presentación principal).
- `/disenos` → galería de la colección.
- `/disenos/:slug` → diseño lazy por slug (hoy solo `henry`, que redirige a `/`).

## Comandos

```bash
npm install                          # instala los 3 workspaces
npm run dev                          # concurrently: api + web
npm run build                        # api (tsc) + web (vite)
npm run build -w @portfolio/web      # solo bundle web → web/dist
npm run typecheck -w @portfolio/web  # tsc -b (chequeo de tipos, no genera nada)
```

## Notas técnicas

- Vite 8 requiere Node ≥ 20.19 / 22 (`engines: ">=22"` en la raíz; `.nvmrc` = 22).
- El build de `web` es **solo `vite build`**; el chequeo de tipos es aparte (`typecheck`).
  Motivo en [`deployment.md`](deployment.md).
