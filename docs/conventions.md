# Convenciones

## Contenido

Todo el copy vive en `web/src/content/profile.ts` (nombre, rol, tagline, availability,
ticker, ubicación, email, teléfono, bio, `skills`, `projectGroups`, `social`). Para
cambiar textos/datos reales, editar **solo** ese archivo. Tipos: `ProjectItem`,
`ProjectGroup`.

Estructura de proyectos: `projectGroups` = lista de `{ category, items[] }`, y cada item
`{ title, context, description, tags[] }`. Se renderizan agrupados y compactos en
`Projects.tsx`.

## Diseño

Hay un solo diseño y es la página: **el observatorio**, siete planos sobre un campo de
partículas. Cómo funciona, en [`observatorio.md`](observatorio.md). La reconstrucción
del sistema Henry que había antes se retiró entera —código, estilos y spec— junto con
los hooks de scroll que solo ella usaba.

- Los tokens viven en `web/src/styles/tokens.css` y son el único sitio con valores de
  color, tipografía y ritmo. Un color escrito a mano en `site.css` es un error, no una
  excepción.
- Los estilos son CSS plano, sin Tailwind, en tres archivos: `tokens.css`, `global.css`
  (reset y fundamentos) y `site.css` (todo lo demás).

## Estilo de código

- React 19 + TS. Componentes funcionales; hooks reutilizables en `web/src/hooks/`.
- CSS plano, sin Tailwind. Clases en español, con la convención `bloque__elemento` y
  estados con `is-`.
- **El código no lleva comentarios.** El porqué de una decisión va a `docs/` o al
  mensaje del commit; el código dice qué hace y el nombre de una constante hace el
  trabajo que haría el comentario. La única excepción es el aviso que evita una
  regresión concreta: un acoplamiento invisible desde el archivo que se está editando,
  o un valor que alguien "arreglaría" reintroduciendo un problema medido.
- Commits en **español**.
- Animaciones: siempre con rama `prefers-reduced-motion`. Decorativo → `aria-hidden` +
  texto real en un elemento `.sr-only`.

## Git

- Commits en español, descriptivos. Terminar con:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Deploy fixes → directo a `main`. Diseño/código → rama + PR con confirmación del usuario.

## Mantener esta documentación

Al hacer un cambio estructural (nuevo componente, efecto, dependencia, ajuste de deploy),
actualizar el doc correspondiente en `docs/` y, si cambia algo invariante, `CLAUDE.md`.
El objetivo es no tener que releer todo el código: estos docs son la fuente de contexto.
