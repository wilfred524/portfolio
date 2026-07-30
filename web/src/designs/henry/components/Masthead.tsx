import { profile } from '../../../content/profile';
import { useReveal } from '../../../hooks/useReveal';
import { useScrollSlide } from '../../../hooks/useScrollSlide';

/**
 * Banda Ink con el slogan editorial, que bajó aquí desde el hero: como respiro
 * entre bandas funciona; ocupando el lugar de la credencial, no.
 * Conserva el gesto de firma del original: romano en los extremos, itálica en el nexo.
 */
const { start, link, end } = profile.heroSlogan;
const WORDS = [
  { text: start, italic: false },
  { text: link, italic: true },
  { text: end, italic: false },
];

export function Masthead() {
  const sectionRef = useReveal<HTMLElement>(0.3); // inversión papel→tinta
  const trackRef = useScrollSlide<HTMLDivElement>(); // desplazamiento con el scroll

  return (
    <section
      ref={sectionRef}
      className="henry-section henry-section--ink henry-masthead"
      aria-hidden="true"
    >
      <div ref={trackRef} className="henry-masthead__track">
        {/* El contenido se duplica para dar recorrido al desplazamiento */}
        {[0, 1].map((copy) => (
          <span key={copy}>
            {WORDS.map((word) => (
              <span
                key={word.text}
                className={`henry-masthead__word${
                  word.italic ? ' henry-masthead__word--nexus' : ''
                }`}
              >
                {word.text} —
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
