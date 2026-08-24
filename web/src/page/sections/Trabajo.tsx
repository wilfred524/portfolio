import type { Employment, ProjectItem } from '../../content';
import { useContent } from '../../i18n/LanguageProvider';

export function Trabajo({
  id,
  titulo,
  proyectos,
  empleo,
  reveladas,
  numeroDe,
  onAbrir,
}: {
  id: string;
  titulo: string;
  proyectos: ProjectItem[];
  empleo?: Employment;
  reveladas: Set<string>;
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
            <button
              type="button"
              className={reveladas.has(item.id) ? 'pieza is-revelada' : 'pieza'}
              onClick={() => onAbrir(item)}
            >
              {/* El número es a la vez lo que forman las estrellas y el rótulo que queda:
                  se muestrea de este mismo elemento, con su tipografía y su caja. */}
              <span className="pieza__figura" data-figura={item.id} aria-hidden="true">
                {numeroDe(item.id)}
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
        <p className="meta trabajo__empleo" data-texto>
          {empleo.employer} · {empleo.period}
        </p>
      )}
    </div>
  );
}
