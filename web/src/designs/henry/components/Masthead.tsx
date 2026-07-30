import { profile } from '../../../content/profile';
import { useReveal } from '../../../hooks/useReveal';
import { useScrollSlide } from '../../../hooks/useScrollSlide';

/**
 * Banda Ink con el slogan editorial, que bajó aquí desde el hero: como respiro
 * entre bandas funciona; ocupando el lugar de la credencial, no.
 *
 * Copia única y centrada, con un desplazamiento corto ligado al scroll. El barrido
 * largo anterior partía la frase — a media banda se leía "PRODUCTO — IDEAS — hechas" —
 * y el slogan tiene orden semántico. Conserva el gesto de firma del original:
 * romano en versales en los extremos, itálica de caja baja en el nexo.
 */
const { start, link, end } = profile.heroSlogan;
const WORDS = [
  { text: start, nexus: false },
  { text: link, nexus: true },
  { text: end, nexus: false },
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
        {WORDS.map((word, i) => (
          <span
            key={word.text}
            className={`henry-masthead__word${
              word.nexus ? ' henry-masthead__word--nexus' : ''
            }`}
          >
            {word.text}
            {i < WORDS.length - 1 && <span className="henry-masthead__dash"> — </span>}
          </span>
        ))}
      </div>
    </section>
  );
}
