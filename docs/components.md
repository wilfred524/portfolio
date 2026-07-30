# Mapa de componentes

Todo en `web/src/designs/henry/`. La página se compone en `HenryPage.tsx`:
nav → Hero → Masthead → **banda Paper con Projects + Skills** → Contact → footer.

`Projects` y `Skills` ya no abren banda propia: comparten una `<section className="henry-section">`
declarada en `HenryPage`, y devuelven fragmentos. Es lo que mantiene la alternancia
Paper/Ink tras disolverse «Sobre mí» (ver [`effects.md`](effects.md) §1).

| Componente | Archivo | Qué hace | Clases CSS clave |
|---|---|---|---|
| `HenryPage` | `HenryPage.tsx` | Ensambla la página | `.design-henry`, `.henry-footer`, `.henry-credit` |
| `InkSection` | `components/InkSection.tsx` | Banda Ink a sangre completa (solo la usa `Contact`) | `.henry-section--ink` |
| `Hero` | `components/Hero.tsx` | **Nombre como titular** (serif display) + rol/stack + frase de credencial + enlaces + pie con ubicación y disponibilidad, junto a la placa halftone | `.henry-hero__name`, `.henry-hero__credential`, `.henry-linkbtn`, `.henry-hero__plate` |
| `HalftonePlate` | `components/HalftonePlate.tsx` | Canvas: dithering Bayer del grabado da Vinci, spotlight al cursor, fade izq→der. Ver [`effects.md`](effects.md) | `.henry-plate-canvas` |
| `Masthead` | `components/Masthead.tsx` | Marquee con el **slogan** (`profile.heroSlogan`, bajado desde el hero) **ligado al scroll** | `.henry-masthead`, `.henry-masthead__word--nexus` |
| `SectionHeader` | `components/SectionHeader.tsx` | Encabezado grande: título **estático** + **regla que se extiende** al scroll (`.henry-extend`, vía `useScrollProgress`); `variant` = `serif` \| `masthead` | `.henry-sechead`, `.henry-extend` |
| `Projects` | `components/Projects.tsx` | SectionHeader "Experiencia" (masthead) + grupos por categoría. `ProjectRow` acepta `defaultOpen`: **la primera fila abre por defecto**, las demás conservan su fantasma. Ver [`effects.md`](effects.md) §3c | `.henry-proj`, `.henry-proj__grid`, `.henry-proj__ghost`, `.henry-tag` |
| `Skills` | `components/Skills.tsx` | SectionHeader "Habilidades" + lista tipográfica, como segundo bloque de la banda | `.henry-subsection`, `.henry-skill` |
| `Contact` | `components/Contact.tsx` | Frase de cierre + email grande + teléfono + redes | `.henry-contact__closing`, `.henry-contact__email` |

Fuera del diseño:
- `web/src/pages/GalleryPage.tsx` — índice de la colección (lee `designs/registry.ts`).

## Hooks

- `web/src/hooks/useReveal.ts` — añade `is-visible` cuando el elemento entra al viewport
  (IntersectionObserver). Lo usan `InkSection` y el reveal del nombre en el hero.
- `web/src/hooks/useScrollProgress.ts` — progreso de entrada `--p` [0,1] con reposo
  (se detiene al asentarse). Driver de la regla que se extiende y del texto fantasma.
- `web/src/hooks/useScrollSlide.ts` — desplazamiento continuo `--slide` [-1,1]; lo usa el masthead.

## Accesibilidad

Los encabezados decorativos grandes van `aria-hidden`; cada sección lleva un
`<h2 className="henry-sr-only">` con el título real para lectores de pantalla.
