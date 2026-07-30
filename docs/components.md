# Mapa de componentes

Todo en `web/src/designs/henry/`. La página se compone en `HenryPage.tsx`:
ticker → nav → Hero → coordline → Masthead → About → Projects → Skills → Contact → footer.

| Componente | Archivo | Qué hace | Clases CSS clave |
|---|---|---|---|
| `HenryPage` | `HenryPage.tsx` | Ensambla la página; exporta `InkSection` (sección que se invierte Paper→Ink al entrar en viewport, vía `useReveal`) | `.design-henry`, `.henry-ticker`, `.henry-coordline`, `.henry-footer`, `.henry-credit` |
| `Hero` | `components/Hero.tsx` | Nombre como firma pequeña + **slogan** grande (`profile.heroSlogan`: condensada + conector serif itálico solapado), tagline con última palabra en itálica, placa halftone | `.henry-slogan`, `.henry-hero__plate` |
| `HalftonePlate` | `components/HalftonePlate.tsx` | Canvas: dithering Bayer del grabado da Vinci, spotlight al cursor, fade izq→der. Ver [`effects.md`](effects.md) | `.henry-plate-canvas` |
| `Masthead` | `components/Masthead.tsx` | Marquee (Portafolio/Diseño/Código) **ligado al scroll** (continuo mientras está en pantalla) | `.henry-masthead`, `.henry-masthead__track` |
| `SectionHeader` | `components/SectionHeader.tsx` | Encabezado grande: título **estático** + **regla que se extiende** al scroll (`.henry-extend`, vía `useScrollProgress`); `variant` = `serif` \| `masthead` | `.henry-sechead`, `.henry-extend` |
| `About` | `components/About.tsx` | SectionHeader "Sobre mí" + carta editorial invertida centrada | `.henry-letter`, `.henry-letter__eyebrow` |
| `Projects` | `components/Projects.tsx` | SectionHeader "Proyectos" (masthead) + grupos por categoría. Subcomponente `ProjectRow`: título **centrado** con **fantasma** a ambos lados; al expandir el título va a la izquierda y una **barra papel** hace wipe izq→der con contexto+descripción+tags. Ver [`effects.md`](effects.md) §3c | `.henry-proj`, `.henry-proj__grid`, `.henry-proj__ghost`, `.henry-proj__panel`, `.henry-tag` |
| `Skills` | `components/Skills.tsx` | SectionHeader "Habilidades" + lista tipográfica | `.henry-skills__list`, `.henry-skill` |
| `Contact` | `components/Contact.tsx` | SectionHeader "Contacto" + email grande + teléfono + redes | `.henry-contact`, `.henry-contact__email` |

Fuera del diseño:
- `web/src/components/DesignSwitcher.tsx` — botón flotante que abre la colección y navega a diseños/`/disenos`.
- `web/src/pages/GalleryPage.tsx` — índice de la colección (lee `designs/registry.ts`).

## Hooks

- `web/src/hooks/useReveal.ts` — añade `is-visible` cuando el elemento entra al viewport
  (IntersectionObserver). Lo usan `InkSection` (inversión) y los reveals del hero.
- `web/src/hooks/useScrollProgress.ts` — progreso de entrada `--p` [0,1] con reposo
  (se detiene al asentarse). Driver de la regla que se extiende y del texto fantasma.
- `web/src/hooks/useScrollSlide.ts` — desplazamiento continuo `--slide` [-1,1]; lo usa el masthead.

## Accesibilidad

Los encabezados decorativos grandes van `aria-hidden`; cada sección lleva un
`<h2 className="henry-sr-only">` con el título real para lectores de pantalla.
