import { useScrollSlide } from '../../../hooks/useScrollSlide';

/**
 * Encabezado de sección "estampado" que se desliza horizontalmente al hacer scroll.
 * - variant 'serif'    → serif display (Fraunces) a 77px+ (encabezados de sección).
 * - variant 'masthead' → condensada (Antonio) a escala masthead (solo Proyectos/marquee).
 * El deslizamiento es híbrido: CSS scroll-driven nativo donde se soporte, o el hook
 * useScrollSlide como fallback. Decorativo (aria-hidden); el título accesible va aparte.
 */
export function SectionHeader({
  word,
  variant = 'serif',
}: {
  word: string;
  variant?: 'serif' | 'masthead';
}) {
  const ref = useScrollSlide<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`henry-sechead henry-sechead--${variant} henry-slide`}
      aria-hidden="true"
    >
      <span className="henry-sechead__word">{word}</span>
      <span className="henry-sechead__rule" />
    </div>
  );
}
