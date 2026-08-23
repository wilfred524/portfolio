import type { Employment, ProjectItem } from '../../content';
import { useContent } from '../../i18n/LanguageProvider';
import { PIEZAS } from '../../visuals/piezas';

/**
 * Un plano de trabajo: varias piezas en la misma vista.
 *
 * Cada pieza es una imagen a la izquierda y una descripción corta a la derecha, y el
 * conjunto entero es lo que se pulsa: ningún punto del fondo es pulsable por separado.
 *
 * El `<path>` de la imagen es el mismo que las partículas ocupan al converger. La pieza
 * está oculta hasta que la nube termina de formarla, y entonces aparece en su sitio: por
 * eso el relevo entre puntos y trazo no se nota.
 */
export function Trabajo({
  titulo,
  proyectos,
  empleo,
  reveladas,
  onAbrir,
}: {
  titulo: string;
  proyectos: ProjectItem[];
  empleo?: Employment;
  reveladas: Set<string>;
  onAbrir: (item: ProjectItem) => void;
}) {
  const { ui } = useContent();

  return (
    <div className={reveladas.size > 0 ? 'plano__cuerpo trabajo is-abierto' : 'plano__cuerpo trabajo'}>
      <p className="label">{titulo}</p>

      <ul className="piezas">
        {proyectos.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={reveladas.has(item.id) ? 'pieza is-revelada' : 'pieza'}
              onClick={() => onAbrir(item)}
            >
              <span className="pieza__figura" data-figura={item.id} aria-hidden="true">
                <svg viewBox="0 0 100 100" focusable="false">
                  <path d={PIEZAS[item.id] ?? ''} fill="currentColor" fillRule="evenodd" />
                </svg>
              </span>

              <span className="pieza__texto">
                <span className="pieza__titulo">{item.title}</span>
                <span className="pieza__resumen">{item.summary}</span>
                <span className="pieza__pie">
                  <span className="pieza__tags">{item.tags.join(' · ')}</span>
                  {/* aria-hidden: el nombre accesible del botón ya lo dan el título y el
                      resumen, y el rol de botón anuncia que se puede accionar. */}
                  <span className="pieza__abrir" aria-hidden="true">
                    {ui.project.open}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {empleo && (
        <p className="meta trabajo__empleo">
          {empleo.employer} · {empleo.period}
        </p>
      )}
    </div>
  );
}
