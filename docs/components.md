# Mapa de componentes

Todo en `web/src/designs/henry/`. La página se compone en `HenryPage.tsx`:
nav → Hero → Masthead → **banda Paper con Projects + Skills + Profile** → Contact → footer.

`Projects`, `Skills` y `Profile` no abren banda propia: comparten una
`<section id="experiencia" className="henry-section">` declarada en `HenryPage`. Es lo que
mantiene la alternancia Paper/Ink tras disolverse «Sobre mí» (ver [`effects.md`](effects.md) §1).

`SectionHeader` tiene **un solo tratamiento** (serif display). La variante `masthead` en
condensada se retiró: eran tres estilos para el mismo nivel jerárquico. Antonio queda
reservada a la banda del slogan.

| Componente | Archivo | Qué hace | Clases CSS clave |
|---|---|---|---|
| `HenryPage` | `HenryPage.tsx` | Ensambla la página; nav a las secciones reales | `.design-henry`, `.henry-nav`, `.henry-footer` |
| `InkSection` | `components/InkSection.tsx` | Banda Ink a sangre completa (solo la usa `Contact`) | `.henry-section--ink` |
| `Hero` | `components/Hero.tsx` | **Nombre como titular** (serif display) + rol/stack + frase de credencial + enlaces + pie con ubicación y disponibilidad, junto a la placa halftone | `.henry-hero__name`, `.henry-hero__credential`, `.henry-linkbtn`, `.henry-hero__plate` |
| `HalftonePlate` | `components/HalftonePlate.tsx` | Canvas: dithering Bayer del grabado da Vinci, spotlight al cursor, fade izq→der. Ver [`effects.md`](effects.md) | `.henry-plate-canvas` |
| `Masthead` | `components/Masthead.tsx` | Marquee con el **slogan** (`profile.heroSlogan`, bajado desde el hero) **ligado al scroll** | `.henry-masthead`, `.henry-masthead__word--nexus` |
| `SectionHeader` | `components/SectionHeader.tsx` | Encabezado grande: título **estático** + **regla que se extiende** al scroll (`.henry-extend`, vía `useScrollProgress`); `variant` = `serif` \| `masthead` | `.henry-sechead`, `.henry-extend` |
| `Projects` | `components/Projects.tsx` | SectionHeader "Experiencia" + grupos por categoría. `ProjectRow` **nace abierta**; título, `empresa · rol · periodo` y métrica van fuera del panel plegable. Ver [`effects.md`](effects.md) §3c | `.henry-proj`, `.henry-proj__meta`, `.henry-proj__metric`, `.henry-tag` |
| `Skills` | `components/Skills.tsx` | SectionHeader "Habilidades" + una línea por área (`<dl>`), no una fila por tecnología | `.henry-subsection`, `.henry-skills__row` |
| `Profile` | `components/Profile.tsx` | Formación, idiomas, modalidad y contexto de dominio. Las líneas con `value` vacío no se renderizan | `.henry-skills__row`, `.henry-inline-link` |
| `Contact` | `components/Contact.tsx` | Frase de cierre + email grande + teléfono + redes | `.henry-contact__closing`, `.henry-contact__email` |

Fuera del diseño no queda nada: el sitio es una sola página (ver [`architecture.md`](architecture.md)).

## Hooks

- `web/src/hooks/useReveal.ts` — añade `is-visible` cuando el elemento entra al viewport
  (IntersectionObserver). Lo usan `InkSection` y el reveal del nombre en el hero.
- `web/src/hooks/useScrollProgress.ts` — progreso de entrada `--p` [0,1] con reposo
  (se detiene al asentarse). Driver de la regla que se extiende y del texto fantasma.
- `web/src/hooks/useScrollSlide.ts` — desplazamiento continuo `--slide` [-1,1]; lo usa el masthead.

## Accesibilidad

Los encabezados decorativos grandes van `aria-hidden`; cada sección lleva un
`<h2 className="henry-sr-only">` con el título real para lectores de pantalla.
