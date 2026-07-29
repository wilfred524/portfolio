# Portfolio — colección de diseños

Página de presentación para búsqueda de trabajo: una colección creciente de
sistemas de diseño implementados con fidelidad. La página principal (`/`) es la
presentación con el primer diseño de la colección, **Henry** (editorial
monocromático, de refero.design).

## Arquitectura

Monorepo con npm workspaces — frontend y backend estrictamente separados:

| Workspace | Qué es | Puerto (dev) |
|---|---|---|
| `web/` | Frontend React + Vite + TS | 5173 |
| `api/` | Backend Express + TS (demos con IA/APIs; las keys viven solo aquí) | 3001 |
| `shared/` | Contratos tipados de la API, única dependencia entre ambos | — |

- El frontend solo habla con el backend a través de `web/src/lib/api.ts`,
  tipado con `@portfolio/shared`, vía el proxy `/api` de Vite.
- Secretos únicamente en `api/.env` (plantilla en `api/.env.example`).

## Desarrollo

```bash
npm install
npm run dev     # arranca api (3001) y web (5173) en paralelo
npm run build   # compila ambos
```

## Cómo añadir un diseño nuevo (método con refero.design)

1. En la página del estilo en styles.refero.design, copiar el **`design.md`**
   (la spec) y las **CSS custom properties** (los tokens) con sus botones de copia.
2. Crear `web/src/designs/<slug>/` con:
   - `design.md` — la spec pegada tal cual (fuente de verdad del diseño).
   - `<slug>.css` — los tokens pegados como variables CSS, scoped bajo la clase
     raíz `.design-<slug>`, y todos los estilos del diseño usando SOLO esas variables.
   - `<Slug>Page.tsx` + `components/` — la página maquetada siguiendo las reglas
     do/don't del design.md.
3. Registrar el diseño en `web/src/designs/registry.ts` (una entrada: slug,
   nombre, descripción, colores de preview y componente lazy).
4. Listo: aparece automáticamente en el selector flotante y en `/disenos`.

Cada carpeta de diseño es autocontenida (spec + tokens + componentes); los
estilos no se filtran entre diseños porque todo va scoped a su clase raíz.

## Contenido

Todos los textos de la presentación viven en `web/src/content/profile.ts` —
para poner datos reales solo se edita ese archivo.
