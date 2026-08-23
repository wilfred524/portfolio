import type { Employment, ProjectItem } from '../../content';
import { useContent } from '../../i18n/LanguageProvider';


/**
 * Un plano de trabajo: varias piezas en la misma vista.
 *
 * Cada pieza es un número a la izquierda y una descripción corta a la derecha, y el
 * conjunto entero es lo que se pulsa: ningún punto del fondo es pulsable por separado.
 *
 * Lo que forman las estrellas es el rótulo del plano, no los números: repartir la materia
 * entre varias piezas dejaba a todas por debajo de lo legible.
 */
export function Trabajo({
  id,
  titulo,
  proyectos,
  empleo,
  numeroDe,
  onAbrir,
}: {
  id: string;
  titulo: string;
  proyectos: ProjectItem[];
  empleo?: Employment;
  /** Su puesto en el conjunto de los nueve, no dentro del plano. */
  numeroDe: (id: string) => string;
  onAbrir: (item: ProjectItem) => void;
}) {
  const { ui } = useContent();

  return (
    <div className="plano__cuerpo trabajo">
      <h2 className="plano__rotulo" data-figura={id}>{titulo}</h2>

      <ul className="piezas">
        {proyectos.map((item) => (
          <li key={item.id}>
            <button type="button" className="pieza" onClick={() => onAbrir(item)}>
              <span className="pieza__figura" aria-hidden="true">{numeroDe(item.id)}</span>

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
        <p className="meta trabajo__empleo" data-texto>
          {empleo.employer} · {empleo.period}
        </p>
      )}
    </div>
  );
}
