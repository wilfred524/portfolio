import { useReveal } from '../../../hooks/useReveal';
import { useScrollSlide } from '../../../hooks/useScrollSlide';

const WORDS = ['Portafolio', 'Diseño', 'Código'];

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
              <span key={word} className="henry-masthead__word">
                {word} —
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
