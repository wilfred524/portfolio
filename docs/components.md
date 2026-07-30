# Mapa de componentes

Todo en `web/src/designs/henry/`. La página se compone en `HenryPage.tsx`:
ticker → nav → Hero → coordline → Masthead → About → Projects → Skills → Contact → footer.

| Componente | Archivo | Qué hace | Clases CSS clave |
|---|---|---|---|
| `HenryPage` | `HenryPage.tsx` | Ensambla la página; exporta `InkSection` (sección que se invierte Paper→Ink al entrar en viewport, vía `useReveal`) | `.design-henry`, `.henry-ticker`, `.henry-coordline`, `.henry-footer`, `.henry-credit` |
| `Hero` | `components/Hero.tsx` | Nombre a dos voces (condensada + serif, split de `profile.name`), tagline con última palabra en itálica, placa halftone | `.henry-hero`, `.henry-display__condensed/__serif`, `.henry-hero__plate` |
| `HalftonePlate` | `components/HalftonePlate.tsx` | Canvas: dithering Bayer del grabado da Vinci, spotlight al cursor, fade izq→der. Ver [`effects.md`](effects.md) | `.henry-plate-canvas` |
| `Masthead` | `components/Masthead.tsx` | Marquee (Portafolio/Diseño/Código) **ligado al scroll** | `.henry-masthead`, `.henry-masthead__track` |
| `SectionHeader` | `components/SectionHeader.tsx` | Encabezado grande deslizante reutilizable; `variant` = `serif` \| `masthead` | `.henry-sechead`, `.henry-slide` |
| `About` | `components/About.tsx` | SectionHeader "Sobre mí" + carta editorial invertida centrada | `.henry-letter`, `.henry-letter__eyebrow` |
| `Projects` | `components/Projects.tsx` | SectionHeader "Proyectos" (masthead) + grupos por categoría con filas compactas | `.henry-catgroup`, `.henry-proj`, `.henry-tag`, `.henry-comingsoon` |
| `Skills` | `components/Skills.tsx` | SectionHeader "Habilidades" + lista tipográfica | `.henry-skills__list`, `.henry-skill` |
| `Contact` | `components/Contact.tsx` | SectionHeader "Contacto" + email grande + teléfono + redes | `.henry-contact`, `.henry-contact__email` |

Fuera del diseño:
- `web/src/components/DesignSwitcher.tsx` — botón flotante que abre la colección y navega a diseños/`/disenos`.
- `web/src/pages/GalleryPage.tsx` — índice de la colección (lee `designs/registry.ts`).

## Hooks

- `web/src/hooks/useReveal.ts` — añade `is-visible` cuando el elemento entra al viewport
  (IntersectionObserver). Lo usan `InkSection` (inversión) y los reveals del hero.
- `web/src/hooks/useScrollSlide.ts` — parallax horizontal ligado al scroll (fallback JS;
  ver [`effects.md`](effects.md)).

## Accesibilidad

Los encabezados decorativos grandes van `aria-hidden`; cada sección lleva un
`<h2 className="henry-sr-only">` con el título real para lectores de pantalla.
