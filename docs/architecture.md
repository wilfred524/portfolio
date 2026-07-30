# Arquitectura

Monorepo con **npm workspaces**. Raíz: `C:\Users\GAF\Desktop\portfolio`.
Repo: https://github.com/wilfred524/portfolio (público, remoto SSH).

## Paquetes

| Paquete | Nombre npm | Rol | Puerto dev |
|---|---|---|---|
| `web/` | `@portfolio/web` | Frontend React 19 + Vite + TS | 5173 |
| `api/` | `@portfolio/api` | Backend Express + TS; genera el CV (`build:cv`) | 3001 |
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

## Rutas

**Ninguna: el sitio es una sola página.** La colección de diseños (`/disenos`,
`GalleryPage`, `designs/registry.ts`, `DesignMenu`) se retiró — varias páginas diluían el
mensaje y sembraban la duda de si el autor es diseñador o backend. Con ella salió
`react-router-dom`, y el bundle bajó de 252 kB a 208 kB.

## Comandos

```bash
npm install                          # instala los 3 workspaces
npm run dev                          # concurrently: api + web
npm run build                        # api (tsc) + web (vite)
npm run build -w @portfolio/web      # solo bundle web → web/dist
npm run typecheck -w @portfolio/web  # tsc -b; también verifica la paridad es/en
npm run build:cv -w @portfolio/api   # CV en HTML y PDF, ambos idiomas → web/public/
```

## Notas técnicas

- Vite 8 requiere Node ≥ 20.19 / 22 (`engines: ">=22"` en la raíz; `.nvmrc` = 22).
- El build de `web` es **solo `vite build`**; el chequeo de tipos es aparte (`typecheck`).
  Motivo en [`deployment.md`](deployment.md).
