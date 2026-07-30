# CLAUDE.md — Portfolio (Wilfred Morales)

Índice de contexto para agentes de IA. Este archivo se carga en cada sesión: mantenlo
**corto**. El detalle vive en `docs/` (microsegmentado); lee solo el que necesites.

## Qué es

Sitio personal de presentación de **una sola página**, construido sobre una
reconstrucción fiel del sistema de diseño **Henry** (editorial monocromático). Monorepo
TypeScript. **Idioma de trabajo: español.**

La colección de diseños que había en `/disenos` se retiró: varias páginas diluían el
mensaje del portafolio. El objetivo del sitio es que un evaluador técnico entienda en
tres o cuatro pantallas qué se ha construido, en qué dominio y desde cuándo.

## Reglas invariantes (no romper)

- **Diseño Henry**: 100% monocromo cálido (sin color), **sin sombras**, **radius solo
  12px**, bandas Paper/Ink a sangre completa. Detalle en [`docs/design-henry.md`](docs/design-henry.md).
- **Todo texto/contenido** vive en `web/src/content/profile.es.ts` y `profile.en.ts`
  —incluidos los textos de interfaz, en su bloque `ui`—. Ningún componente hardcodea
  copy. Ambos declaran `satisfies Profile` (`content/types.ts`): si a un idioma le falta
  una clave, `typecheck` falla. **El idioma por defecto es el inglés.**
- **Separación frontend/backend estricta**: el frontend solo llama al backend por
  `web/src/lib/api.ts` (tipado con `@portfolio/shared`). Secretos solo en `api/.env`.
- **Dependencias de build en `dependencies`, no `devDependencies`** (lección de deploy;
  ver [`docs/deployment.md`](docs/deployment.md)).
- **Accesibilidad**: elementos decorativos con `aria-hidden`; toda animación respeta
  `prefers-reduced-motion`.

## Mapa de documentos

| Necesitas… | Lee |
|---|---|
| Estructura del repo, workspaces, comandos | [`docs/architecture.md`](docs/architecture.md) |
| Tokens, tipografía y guidelines do/don't de Henry | [`docs/design-henry.md`](docs/design-henry.md) |
| Qué hace cada componente y dónde está | [`docs/components.md`](docs/components.md) |
| Cómo funcionan las interacciones (halftone, scroll, reveal, inversión) | [`docs/effects.md`](docs/effects.md) |
| Config de Vercel y errores ya resueltos | [`docs/deployment.md`](docs/deployment.md) |
| Convenciones: contenido, añadir un diseño, git | [`docs/conventions.md`](docs/conventions.md) |

## Comandos rápidos

```bash
npm run dev                          # web (5173) + api (3001)
npm run build -w @portfolio/web      # bundle de producción (vite)
npm run typecheck -w @portfolio/web  # chequeo de tipos (tsc)
```
