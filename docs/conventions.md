# Convenciones

## Contenido

Todo el copy vive en `web/src/content/profile.ts` (nombre, rol, tagline, availability,
ticker, ubicación, email, teléfono, bio, `skills`, `projectGroups`, `social`). Para
cambiar textos/datos reales, editar **solo** ese archivo. Tipos: `ProjectItem`,
`ProjectGroup`.

Estructura de proyectos: `projectGroups` = lista de `{ category, items[] }`, y cada item
`{ title, context, description, tags[] }`. Se renderizan agrupados y compactos en
`Projects.tsx`.

## Diseños

**La colección de diseños se retiró** (ver `docs/architecture.md`): varias páginas
diluían el mensaje del portafolio. Ya no existen `registry.ts`, `DesignSwitcher`,
`GalleryPage` ni la ruta `/disenos`, así que no hay "añadir un diseño nuevo": hay un
solo diseño, **Henry**, y es la página.

Lo que sí sigue en pie, porque es lo que mantiene Henry coherente:

- La spec vive en `web/src/designs/henry/design.md`, pegada tal cual desde la ficha de
  styles.refero.design. Es la fuente de verdad; si el código y la spec discrepan, manda
  la spec o se documenta por qué no.
- Los tokens son variables CSS **scoped bajo `.design-henry`**, y los estilos usan solo
  esas variables, nunca valores sueltos.
- La carpeta del diseño es autocontenida: los estilos no se filtran porque todo cuelga
  de su clase raíz.

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
