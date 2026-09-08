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

## Diagramas

Cada proyecto abre con un diagrama de arquitectura en `web/public/diagramas/`. **No se
editan a mano**: la fuente es el JSON de `diagramas/` y `npm run build:diagramas` los
regenera con archify, que vive fuera del repo (`~/.claude/skills/archify`, o donde apunte
`ARCHIFY_HOME`). Por eso los HTML se versionan: el build de Vercel no tiene la herramienta.

Después de generar cada uno, el script lee `tokens.css` y reescribe con esos valores las
variables de color del diagrama, y cambia su tipografía por Inter incrustada quitando la
petición a Google Fonts. Un cambio de token se propaga con un `build:diagramas`; no hay
colores escritos dos veces.

Para añadir uno: escribir `diagramas/<id>.<tipo>.json` —tipos `architecture`, `workflow`,
`sequence`, `dataflow`, `lifecycle`—, validarlo con `archify validate <tipo> <archivo>
--quality showcase` hasta que dé los 9 checks sin errores ni avisos, y apuntar el proyecto
a `<id>.html` con el campo `diagram` en los dos `profile.*.ts`. Un recibo con 4 checks es
validación básica, no aceptación.

## Git

- Commits en español, descriptivos. Terminar con:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Deploy fixes → directo a `main`. Diseño/código → rama + PR con confirmación del usuario.

## Mantener esta documentación

Al hacer un cambio estructural (nuevo componente, efecto, dependencia, ajuste de deploy),
actualizar el doc correspondiente en `docs/` y, si cambia algo invariante, `CLAUDE.md`.
El objetivo es no tener que releer todo el código: estos docs son la fuente de contexto.
