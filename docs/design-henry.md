# Diseño "Henry"

Sistema editorial monocromático cálido inspirado en carteles tipográficos. La spec
completa (verbatim de refero) está en `web/src/designs/henry/design.md`. Los estilos y
tokens en `web/src/designs/henry/henry.css`, **scoped bajo `.design-henry`**.

Original: [henry.codes](https://henry.codes) de Henry Desroches · ficha en refero.design.
Esto es una **reinterpretación** propia (crédito en el footer).

## Tokens (CSS custom properties en `.design-henry`)

Colores: `--paper #fafafa` · `--ink #2a2722` · `--sepia #3e3b36` · `--ash #666` ·
`--midstone #9f9f9f` · `--pebble #b3b3b3` · `--hairline #eee`.

Fuentes (sustitutos libres de las comerciales, vía `@fontsource-variable`):
- `--font-sans` = **Switzer** (← Neue Montreal) — UI/cuerpo. Local en `web/public/fonts/`.
- `--font-serif-display` / `--font-serif` = **Fraunces** (← Louize Display / Louize) —
  titulares y copy editorial. Alto contraste: usar `font-variation-settings: 'opsz' 144`.
- `--font-condensed` = **Antonio** (← Manuka) — solo mastheads masivos.

Escala/espaciado: `--text-*` (12→32px), `--headline-sm/lg`, `--hero`, `--masthead`;
`--space 4px`, `--section-gap`, `--radius 12px`, `--gutter`.

## Guidelines del autor (RESPETAR SIEMPRE)

**Hacer:**
- Encabezados de sección en **serif display (Fraunces) a 77px+**.
- Cuerpo/UI en sans 12/16/20/24/32px, tracking −0.01em, line-height ≤ 1.5.
- Alternar bandas **Paper/Ink a sangre completa**; nunca degradar entre ellas.
- **Radius solo 12px** en tarjetas, botones y tags.
- Display siempre `#2a2722` sobre Paper o `#fafafa` sobre Ink. Sin tercer color de superficie.
- **Condensada (Antonio) solo para los mastheads más grandes (226–371px)**, un peso, un color, mayúsculas.
- Dejar ~90% de la página como Paper/Ink vacío.

**No hacer:**
- Ningún color cromático (azul/rojo/verde) — rompe la identidad.
- Ningún botón CTA relleno de color — el énfasis es por escala e inversión.
- Ninguna sombra/`box-shadow`/glow.
- Cuerpo largo en serif display a 116–132px (ilegible).
- Radius distinto de 12px (ni 0px ni pill).
- Romper el binario Paper/Ink con paneles grises o degradados.
- Centrar cuerpo en la sans (solo bloques editoriales serif dentro de secciones Ink).

> Excepción conocida: la placa halftone del hero usa esquinas rectas (imagen) y el
> titular del hero mezcla condensada+serif — fiel al sitio real aunque la guideline
> escrita reserve la condensada a mastheads. Es decisión deliberada del usuario.

## Aislamiento entre diseños

Cada diseño define sus tokens bajo su clase raíz (`.design-henry`). Un diseño nuevo usa
`.design-<slug>` y no colisiona. Ver [`conventions.md`](conventions.md) para añadir uno.
