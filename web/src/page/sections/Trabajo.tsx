import type { Employment, ProjectItem } from '../../content';
import { useContent } from '../../i18n/LanguageProvider';

/**
 * Un plano de trabajo: varias piezas en la misma vista.
 *
 * Cada pieza es una imagen a la izquierda y una descripción corta a la derecha, y el
 * conjunto entero es lo que se pulsa: ningún punto del fondo es pulsable por separado.
 *
 * El `<path>` de la imagen es a la vez el destino de las partículas y el dibujo final:
 * una sola forma en dos materiales, para que no haya salto entre ellas.
 */
export function Trabajo({
  titulo,
  proyectos,
  empleo,
  onAbrir,
}: {
  titulo: string;
  proyectos: ProjectItem[];
  empleo?: Employment;
  onAbrir: (item: ProjectItem) => void;
}) {
  const { ui } = useContent();

  return (
    <div className="plano__cuerpo trabajo">
      <p className="label">{titulo}</p>

      <ul className="piezas">
        {proyectos.map((item) => (
          <li key={item.id}>
            <button type="button" className="pieza" onClick={() => onAbrir(item)}>
              <span className="pieza__figura" aria-hidden="true" />

              <span className="pieza__texto">
                <span className="pieza__titulo">{item.title}</span>
                <span className="pieza__resumen">{item.summary}</span>
                <span className="pieza__pie">
                  <span className="pieza__tags">{item.tags.join(' · ')}</span>
                  {/* aria-hidden: el nombre accesible del botón ya lo dan el título y el
                      resumen, y el rol de botón ya anuncia que se puede accionar. */}
                  <span className="pieza__abrir" aria-hidden="true">
                    {ui.project.open}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* La cabecera del contrato se dijo entera en el plano de contexto; aquí solo se
          recuerda de quién cuelga este trabajo, en una línea. */}
      {empleo && (
        <p className="meta trabajo__empleo">
          {empleo.employer} · {empleo.period}
        </p>
      )}
    </div>
  );
}
