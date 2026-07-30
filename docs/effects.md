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

## 3. Parallax tipográfico ligado al scroll (híbrido)

Los encabezados grandes se deslizan derecha→izquierda al scrollear.
- **Nativo** (Chrome/Edge): `@supports (animation-timeline: view())` aplica
  `animation: henry-slide-x` con `animation-timeline: view()`. Sin JS.
- **Fallback** (Safari/Firefox): `web/src/hooks/useScrollSlide.ts` detecta la falta de
  soporte y, con un listener de scroll coalescido por `requestAnimationFrame`, actualiza
  la variable CSS `--slide` en [-1, 1] según el progreso del elemento en el viewport. El
  CSS traduce `--slide` a `translateX`.
- Aplicado vía la clase `.henry-slide` (en `SectionHeader`) y a `.henry-masthead__track`
  (con su propio rango y keyframes `henry-masthead-scroll`).
- `.design-henry` tiene `overflow-x: clip` para que el deslizamiento no genere scroll horizontal.

## 4. Reveal tipográfico

`.henry-reveal` (con `useReveal`) sube el contenido con `translateY` + máscara al entrar.
Usado en el titular del hero.

## 5. Hover de inversión

Tarjetas de proyecto, links de nav y de contacto invierten Paper↔Ink al hover (200ms).
El "truco" central del sistema aplicado a la interacción.
