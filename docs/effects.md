# Interacciones y efectos

Todos respetan `prefers-reduced-motion` (se desactivan). CSS en `henry.css`.

## 1. Bandas Paper / Ink estáticas y alternadas

El sistema alterna bandas Paper e Ink a sangre completa (spec: *"never gradient-blend
between them"*). Las secciones Ink (`.henry-section--ink`) son **ink de principio a fin,
sin transición de color** — una inversión animada pasaría por grises/marrones y va contra
la spec. Ritmo actual (paper/ink alternados para no cansar):
Hero (paper) → Masthead (ink) → **Experiencia + Habilidades + Perfil (paper)** →
Contacto (ink) → footer (paper).

Al disolverse «Sobre mí» desaparecía la única banda Paper entre Masthead y Experiencia,
así que Experiencia y Habilidades comparten ahora una sola banda Paper (separadas por
`.henry-subsection`). `InkSection` vive en `components/InkSection.tsx` y solo la usa
`Contact`; `useReveal` ya no cambia color (queda para otros reveals).

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

El **masthead** lleva un **parallax corto** (±6%) ligado al scroll: `useScrollSlide.ts`
(`--slide` en [-1,1]) + CSS scroll-driven nativo donde se soporta
(`.henry-masthead__track`, keyframes `henry-masthead-scroll`). Es una **copia única
centrada**, no una marquesina: el barrido largo anterior (dos copias, hasta −45%) partía
la frase y a media banda se leía «PRODUCTO — IDEAS — hechas». El slogan tiene orden
semántico, así que el recorrido se acotó para que siempre se lea entero y en orden.

`.design-henry` tiene `overflow-x: clip` para que ningún desplazamiento genere scroll
horizontal.

## 3b. Hero de credencial y slogan en la banda Ink

El titular del hero es ahora **el nombre**, en serif display dimensionada en `cqw` respecto
a su columna (`.henry-hero__name`) — Antonio queda reservada a los mastheads gigantes que
manda la spec. Debajo: rol + stack (`.henry-meta`), la frase de credencial en serif a 24px
(`.henry-hero__credential`), los enlaces como botones fantasma (`.henry-linkbtn`) y el pie
con la búsqueda declarada y la **línea de trayectoria** (`profile.trajectory`), que sitúa
el marco temporal dentro del primer viewport. La placa halftone tiene altura propia
—`clamp(320px, 64dvh, 620px)`— en vez de heredarla del texto, que la dejaba diminuta.

El **slogan** (`profile.heroSlogan { start, link, end }` → Ideas / hechas / Producto) bajó
a la banda Ink del `Masthead`, donde funciona como respiro editorial. Conserva el gesto de
firma del original: extremos en romano y versales, nexo en itálica de caja baja
(`.henry-masthead__word--nexus`).

## 3c. Fila de proyecto: abierta por defecto, sin fantasma

Cada fila (`ProjectRow` en `Projects.tsx`) es **una sola columna alineada al margen**.

- **Nace abierta.** El `+` no invitaba a nada: quien no hacía clic se llevaba la impresión
  de que no había contenido. El toggle sigue (`aria-expanded`) para poder cerrar.
- **Título, `empresa · rol · periodo` y métrica van fuera del panel plegable**, así se leen
  siempre. El marco temporal es lo que impide que nueve meses se lean como cuatro años.
- **El panel abre por fila de grid** (`.henry-proj__panel`, `0fr → 1fr`), no por
  `max-height`. El `max-height: 26em` anterior recortaba la descripción de TransUnion
  (~1.100 caracteres) a media línea en cuanto la columna bajaba de ~1000px: se leía
  tachada, y el corte caía sobre el borde de la fila siguiente. La fila de grid saca la
  altura del contenido real y no puede recortar.
- **El texto fantasma se retiró por completo** (12 instancias, `item.ghost` y
  `.henry-proj__ghost*`). Cancelaba las dos capas —ni se leía el fondo ni el título
  centrado encima— y enterraba en decoración los datos más útiles, que ahora son metadato
  legible. La marquesina «seis años, sin apagar nada» no se recuperó en ninguna forma: era
  la antigüedad del sistema refactorizado, pero se leía como la del autor.
- Respeta `prefers-reduced-motion` (sin transición).

## 4. Reveal tipográfico

`.henry-reveal` (con `useReveal`) sube el contenido con `translateY` + máscara al entrar.
Usado en el titular del hero.

## 5. Hover de inversión

Tarjetas de proyecto, links de nav y de contacto invierten Paper↔Ink al hover (200ms).
El "truco" central del sistema aplicado a la interacción.
