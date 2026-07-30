import { useScrollProgress } from '../../../hooks/useScrollProgress';

/**
 * Encabezado de sección "estampado". El TÍTULO queda estático en su sitio exacto;
 * lo que se anima es la REGLA, que se extiende (scaleX) al hacer scroll y se detiene
 * al llegar al reposo. Decorativo (aria-hidden); el título accesible va aparte.
 * - variant 'serif'    → serif display (Fraunces) 77px+ (encabezados de sección).
 * - variant 'masthead' → condensada (Antonio) a escala masthead (Proyectos/marquee).
 */
export function SectionHeader({
  word,
  variant = 'serif',
}: {
  word: string;
  variant?: 'serif' | 'masthead';
}) {
  const ruleRef = useScrollProgress<HTMLSpanElement>();

  return (
    <div className={`henry-sechead henry-sechead--${variant}`} aria-hidden="true">
      <span className="henry-sechead__word">{word}</span>
      <span ref={ruleRef} className="henry-sechead__rule henry-extend" />
    </div>
  );
}
