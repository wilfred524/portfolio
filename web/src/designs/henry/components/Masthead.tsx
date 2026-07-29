import { useReveal } from '../../../hooks/useReveal';

const WORDS = ['Portafolio', 'Diseño', 'Código'];

export function Masthead() {
  const ref = useReveal<HTMLElement>(0.3);

  return (
    <section
      ref={ref}
      className="henry-section henry-section--ink henry-masthead"
      aria-hidden="true"
    >
      <div className="henry-masthead__track">
        {/* El contenido se duplica para que el marquee sea continuo */}
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
