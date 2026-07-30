import { useScrollProgress } from '../../../hooks/useScrollProgress';

/**
 * Encabezado de sección "estampado". El TÍTULO queda estático en su sitio exacto;
 * lo que se anima es la REGLA, que se extiende (scaleX) al hacer scroll y se detiene
 * al llegar al reposo. Decorativo (aria-hidden); el título accesible va aparte.
 *
 * Un solo tratamiento —serif display— para todas las secciones. Antes «Experiencia»
 * iba en condensada gigante y las demás en serif: tres estilos para el mismo nivel
 * jerárquico. La condensada queda reservada a la banda del slogan.
 */
export function SectionHeader({ word }: { word: string }) {
  const ruleRef = useScrollProgress<HTMLSpanElement>();

  return (
    <div className="henry-sechead" aria-hidden="true">
      <span className="henry-sechead__word">{word}</span>
      <span ref={ruleRef} className="henry-sechead__rule henry-extend" />
    </div>
  );
}
