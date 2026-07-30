# Interacciones y efectos

Todos respetan `prefers-reduced-motion` (se desactivan). CSS en `henry.css`.

## 1. Inversión Paper→Ink al scroll

`InkSection` (en `HenryPage.tsx`) usa `useReveal` para añadir `is-visible` al entrar en
viewport. La sección arranca en Paper y transiciona a Ink (`.henry-section--ink` →
`.is-visible`). Da el efecto de bandas que "se encienden".

## 2. Placa halftone generada por código

`components/HalftonePlate.tsx` — el gancho técnico. Pipeline:
1. Carga `/davinci.webp` (grabado de da Vinci, dominio público, en `web/public/`).
2. La dibuja *cover-fit* con zoom 1.15 y encuadre a la derecha en un canvas offscreen
   (W×H = 224×224).
3. Escala de grises + gamma 0.62 (aclara el fondo) + contraste 1.3 (define el rostro).
4. **Dithering ordenado Bayer 8×8** → 1-bit, recoloreado a `--ink`/`--paper`.
5. Máscara de "presencia": se desvanece de izquierda (papel puro, se funde con la
   página) a derecha (retrato completo) + difuminado de bordes.
6. **Spotlight**: sigue el cursor bajando el umbral local del dither (más detalle).
- Se escala con `image-rendering: pixelated`. Fallback a una esfera generada si la
  imagen no carga. `prefers-reduced-motion` → estática, sin listener.
- Verificación sin navegador: se puede reproducir el pipeline en Node con ffmpeg
  (decodificar a gris) + el mismo Bayer, y volcar a PNG.

## 3. Efectos de scroll con "reposo" (driver: `useScrollProgress`)

`web/src/hooks/useScrollProgress.ts` escribe una variable CSS `--p` en [0, 1]:
0 al entrar por abajo, 1 al llegar a la línea de reposo (~55% del viewport) y **se
mantiene en 1** (el efecto se asienta y NO sigue moviéndose → nada de sobrecarga).
Universal (todos los navegadores); con reduced-motion deja `--p = 1`. El CSS decide
qué hacer con `--p`:

- **Regla que se extiende** (`.henry-extend` en `SectionHeader`): el TÍTULO queda
  estático en su sitio; la regla crece con `transform: scaleX(var(--p))` (origen
  izquierdo) hasta llenar el borde y se detiene. Es lo que pide el design.md
  ("trailing rule extending to the right edge").
- **Texto fantasma que se centra** (`.henry-proj__ghost`): repetición tenue del nombre
  del proyecto, desplazada `translateX(calc((1 - var(--p)) * -22%))` → empieza corrida
  y se alinea a 0 cuando la fila queda en foco, dejando la info legible.

El **masthead** sí se desplaza de forma continua mientras está en pantalla: usa
`useScrollSlide.ts` (`--slide` en [-1,1]) + CSS scroll-driven nativo donde se soporta
(`.henry-masthead__track`, keyframes `henry-masthead-scroll`).

`.design-henry` tiene `overflow-x: clip` para que ningún desplazamiento genere scroll
horizontal.

## 3b. Slogan del hero (dos tipografías + solapamiento)

El titular grande del hero es un **slogan** (no el nombre, que es corto): dos palabras
en condensada (Antonio) con un conector serif itálico anidado/solapado
(`.henry-slogan__word` + `.henry-slogan__link` posicionado en absoluto). El contenido
está en `profile.heroSlogan { start, link, end }`. El nombre va como firma pequeña arriba.

## 3c. Expandir proyecto

Cada fila de proyecto muestra título + contexto + tags y un botón **Expandir**
(`<details>/<summary>` = `.henry-proj__more` / `.henry-proj__expand`) que revela la
descripción completa en un panel contrastado (papel sobre la banda ink). Accesible y sin JS.

## 4. Reveal tipográfico

`.henry-reveal` (con `useReveal`) sube el contenido con `translateY` + máscara al entrar.
Usado en el titular del hero.

## 5. Hover de inversión

Tarjetas de proyecto, links de nav y de contacto invierten Paper↔Ink al hover (200ms).
El "truco" central del sistema aplicado a la interacción.
