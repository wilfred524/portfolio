# Interacciones y efectos

Todos respetan `prefers-reduced-motion` (se desactivan). CSS en `henry.css`.

## 1. Bandas Paper / Ink estáticas y alternadas

El sistema alterna bandas Paper e Ink a sangre completa (spec: *"never gradient-blend
between them"*). Las secciones Ink (`.henry-section--ink`) son **ink de principio a fin,
sin transición de color** — una inversión animada pasaría por grises/marrones y va contra
la spec. Ritmo actual (paper/ink alternados para no cansar):
Hero (paper) → Masthead (ink) → Sobre mí (paper) → Proyectos (ink) → Habilidades (paper)
→ Contacto (ink) → footer (paper). `InkSection` sigue exportada desde `HenryPage.tsx`
(Masthead/Projects/Contact la usan); `useReveal` ya no cambia color (queda para otros reveals).

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
- **Texto fantasma que se centra** (`.henry-proj__ghost`): el **descriptor** del proyecto
  (`item.ghost`) repetido en la **misma serif** que el título, desplazado
  `translateX(calc((1 - var(--p)) * -18%))` → empieza corrido y se centra en foco. El
  **título de la fila también se mueve** (`.henry-proj__head` translateX por `--p`).

El **masthead** sí se desplaza de forma continua mientras está en pantalla: usa
`useScrollSlide.ts` (`--slide` en [-1,1]) + CSS scroll-driven nativo donde se soporta
(`.henry-masthead__track`, keyframes `henry-masthead-scroll`).

`.design-henry` tiene `overflow-x: clip` para que ningún desplazamiento genere scroll
horizontal.

## 3b. Slogan del hero (dos tipografías + solapamiento real)

El titular grande del hero es un **slogan** (no el nombre, que es corto). Estructura fiel
al original (verificada en el fotograma): **línea 1 CONDENSADA** (`.henry-slogan__start`,
Antonio uppercase) + **conector ITÁLICA SERIF** anidado a la izquierda sobre la juntura
(`.henry-slogan__link`, absoluto) + **línea 2 SERIF** (`.henry-slogan__end`, Fraunces).
El contraste vive entre las dos líneas. Contenido en `profile.heroSlogan { start, link,
end }` (actual: Ideas / hechas / Producto). El nombre va como firma pequeña arriba.

## 3c. Fila de proyecto: centrada → expandir (título a la izq + barra wipe)

Cada fila (`ProjectRow` en `Projects.tsx`) usa un **grid `1fr auto 1fr`**:
- **Colapsada**: título **centrado** (col 2) con el **fantasma flanqueándolo** — descriptor
  repetido (misma serif, mismo tamaño) en la col 1 (`--left`, alineado a la derecha) y en
  la col 3 (`--right`, absoluto). El fantasma **nunca va detrás del título** (jamás lo
  solapa). Título + fantasma **se mueven juntos** con el scroll: el grid lleva
  `translateX(calc((1 - var(--p)) * 6%))` y se asienta en `--p = 1`.
- **Al expandir** (`useState`, `aria-expanded`): el grid pasa a `0fr auto 1fr` → **solo el
  título se desliza a la izquierda**; el **fantasma desaparece** (`opacity: 0`, estorba la
  lectura); y en la col 3 la **barra** (`.henry-proj__panel-inner`, fondo `--paper`) crece
  (`max-height`) y hace **wipe izquierda→derecha** (`clip-path`), **llegando al borde
  derecho** de la fila, con **contexto + descripción + tags** dentro. Todo 0.5s mismo easing.
- En ≤720px: sin fantasma lateral; título arriba y barra debajo.
- Respeta `prefers-reduced-motion` (sin transición).

## 4. Reveal tipográfico

`.henry-reveal` (con `useReveal`) sube el contenido con `translateY` + máscara al entrar.
Usado en el titular del hero.

## 5. Hover de inversión

Tarjetas de proyecto, links de nav y de contacto invierten Paper↔Ink al hover (200ms).
El "truco" central del sistema aplicado a la interacción.
