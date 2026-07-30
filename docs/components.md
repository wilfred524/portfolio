# Mapa de componentes

Todo en `web/src/designs/henry/`. La página se compone en `HenryPage.tsx`:
nav → Hero → Masthead → **banda Paper con Projects + Skills + Colophon** → Contact → footer.

`Projects`, `Skills` y `Colophon` no abren banda propia: comparten una
`<section id="experiencia" className="henry-section">` declarada en `HenryPage`. Es lo que
mantiene la alternancia Paper/Ink tras disolverse «Sobre mí» (ver [`effects.md`](effects.md) §1).

`SectionHeader` tiene **un solo tratamiento** (serif display). La variante `masthead` en
condensada se retiró: eran tres estilos para el mismo nivel jerárquico. Antonio queda
reservada a la banda del slogan.

| Componente | Archivo | Qué hace | Clases CSS clave |
|---|---|---|---|
| `HenryPage` | `HenryPage.tsx` | Ensambla la página; nav a las secciones reales | `.design-henry`, `.henry-nav`, `.henry-footer` |
| `LangSwitch` | `components/LangSwitch.tsx` | Conmutador EN/ES en la nav. Botones, no enlaces: no hay navegación | `.henry-langswitch` |
| `InkSection` | `components/InkSection.tsx` | Banda Ink a sangre completa (solo la usa `Contact`) | `.henry-section--ink` |
| `Hero` | `components/Hero.tsx` | **Nombre como titular** (serif display) + rol/stack + frase de credencial + enlaces + pie con ubicación y disponibilidad, junto a la placa halftone | `.henry-hero__name`, `.henry-hero__credential`, `.henry-linkbtn`, `.henry-hero__plate` |
| `HalftonePlate` | `components/HalftonePlate.tsx` | Canvas: dithering Bayer del grabado da Vinci, spotlight al cursor, fade izq→der. Ver [`effects.md`](effects.md) | `.henry-plate-canvas` |
| `Masthead` | `components/Masthead.tsx` | Marquee con el **slogan** (`profile.heroSlogan`, bajado desde el hero) **ligado al scroll** | `.henry-masthead`, `.henry-masthead__word--nexus` |
| `SectionHeader` | `components/SectionHeader.tsx` | Encabezado grande: título **estático** + **regla que se extiende** al scroll (`.henry-extend`, vía `useScrollProgress`). Un solo tratamiento serif | `.henry-sechead`, `.henry-extend` |
| `Projects` | `components/Projects.tsx` | SectionHeader "Experiencia" + grupos por categoría. `ProjectRow` en **dos columnas** (meta izquierda, texto derecha) y **sin plegado**. Tres proyectos con `body` en tres partes, dos con `brief` de tres líneas. Ver [`effects.md`](effects.md) §3c | `.henry-proj`, `.henry-proj__aside`, `.henry-proj__block`, `.henry-tag` |
| `Skills` | `components/Skills.tsx` | SectionHeader "Habilidades" + una línea por área (`<dl>`), no una fila por tecnología | `.henry-subsection`, `.henry-skills__row` |
| `Colophon` | `components/Colophon.tsx` | «Cómo está hecho»: stack del sitio, método de trabajo con IA y enlace al repo | `.henry-colophon` |
| `Contact` | `components/Contact.tsx` | Frase de cierre + **facts de perfil** (formación, idiomas, modalidad, dominio) + email + teléfono + redes. Las facts con `value` vacío no se renderizan | `.henry-contact__closing`, `.henry-contact__facts` |

Fuera del diseño no queda nada: el sitio es una sola página (ver [`architecture.md`](architecture.md)).

Los componentes **no importan un perfil concreto**: llaman a `useContent()`
(`web/src/i18n/LanguageProvider.tsx`), que devuelve el contenido del idioma activo.

## Hooks

- `web/src/hooks/useReveal.ts` — añade `is-visible` cuando el elemento entra al viewport
  (IntersectionObserver). Lo usan `InkSection` y el reveal del nombre en el hero.
- `web/src/hooks/useScrollProgress.ts` — progreso de entrada `--p` [0,1] con reposo
  (se detiene al asentarse). Driver de la regla que se extiende y del texto fantasma.
- `web/src/hooks/useScrollSlide.ts` — desplazamiento continuo `--slide` [-1,1]; lo usa el masthead.

## Accesibilidad

Los encabezados decorativos grandes van `aria-hidden`; cada sección lleva un
`<h2 className="henry-sr-only">` con el título real para lectores de pantalla.
