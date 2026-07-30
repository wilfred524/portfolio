import { useContent } from '../../../i18n/LanguageProvider';
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
export function Masthead() {
  const { heroSlogan } = useContent();
  const words = [
    { text: heroSlogan.start, nexus: false },
    { text: heroSlogan.link, nexus: true },
    { text: heroSlogan.end, nexus: false },
  ];

  const sectionRef = useReveal<HTMLElement>(0.3); // inversión papel→tinta
  const trackRef = useScrollSlide<HTMLDivElement>(); // desplazamiento con el scroll

  return (
    <section
      ref={sectionRef}
      className="henry-section henry-section--ink henry-masthead"
      aria-hidden="true"
    >
      <div ref={trackRef} className="henry-masthead__track">
        {words.map((word, i) => (
          <span
            key={word.text}
            className={`henry-masthead__word${
              word.nexus ? ' henry-masthead__word--nexus' : ''
            }`}
          >
            {word.text}
            {/* Espacios duros: el HTML colapsa los normales y quedaba "IDEAS —hechas" */}
            {i < words.length - 1 && (
              <span className="henry-masthead__dash">{' — '}</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
