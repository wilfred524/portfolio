# Convenciones

## Contenido

Todo el copy vive en `web/src/content/profile.ts` (nombre, rol, tagline, availability,
ticker, ubicación, email, teléfono, bio, `skills`, `projectGroups`, `social`). Para
cambiar textos/datos reales, editar **solo** ese archivo. Tipos: `ProjectItem`,
`ProjectGroup`.

Estructura de proyectos: `projectGroups` = lista de `{ category, items[] }`, y cada item
`{ title, context, description, tags[] }`. Se renderizan agrupados y compactos en
`Projects.tsx`.

## Añadir un diseño nuevo a la colección (método refero)

1. En la ficha del estilo en styles.refero.design, copiar el **`design.md`** (spec) y las
   **CSS custom properties** (tokens).
2. Crear `web/src/designs/<slug>/` con:
   - `design.md` — la spec pegada tal cual (fuente de verdad).
   - `<slug>.css` — tokens como variables CSS **scoped bajo `.design-<slug>`** + estilos
     que usen SOLO esas variables (nunca valores sueltos).
   - `<Slug>Page.tsx` + `components/` — maquetación siguiendo las do/don't del design.md.
3. Registrar en `web/src/designs/registry.ts` (slug, nombre, descripción, `preview`
   {background, foreground}, `component` lazy).
4. Aparece solo en el selector flotante (`DesignSwitcher`) y en `/disenos`.

Cada carpeta de diseño es **autocontenida**; los estilos no se filtran porque todo va
scoped a su clase raíz.

## Estilo de código

- React 19 + TS. Componentes funcionales; hooks reutilizables en `web/src/hooks/`.
- CSS plano por diseño (sin Tailwind). Clases con prefijo del diseño (`henry-…`).
- Comentarios y commits en **español**.
- Animaciones: siempre con rama `prefers-reduced-motion`. Decorativo → `aria-hidden` +
  `<h2 class="henry-sr-only">` con el texto real.

## Git

- Commits en español, descriptivos. Terminar con:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Deploy fixes → directo a `main`. Diseño/código → rama + PR con confirmación del usuario.

## Mantener esta documentación

Al hacer un cambio estructural (nuevo componente, efecto, dependencia, ajuste de deploy),
actualizar el doc correspondiente en `docs/` y, si cambia algo invariante, `CLAUDE.md`.
El objetivo es no tener que releer todo el código: estos docs son la fuente de contexto.
