import type { ProjectItem, UiStrings } from '../content';

/**
 * Tarjeta de proyecto, cerrada. Título, una línea de resumen y las tecnologías.
 *
 * **La tarjeta ya dice algo por sí sola.** La versión anterior de este sitio escondía el
 * texto tras un `+` y quien no hacía clic se llevaba la impresión de que no había nada
 * dentro. Aquí el clic profundiza en algo que ya se está leyendo, y la invitación va
 * escrita, no como un signo.
 *
 * Toda la tarjeta es el botón, no un icono en una esquina: el área de acierto es la
 * pieza entera, que es lo que se espera de una rejilla de tarjetas.
 */
export function ProjectCard({
  item,
  labels,
  onOpen,
}: {
  item: ProjectItem;
  labels: UiStrings['project'];
  onOpen: () => void;
}) {
  return (
    <button type="button" className="card" onClick={onOpen}>
      <h3 className="card__title">{item.title}</h3>
      <p className="card__summary">{item.summary}</p>

      <div className="card__foot">
        <span className="card__tags">{item.tags.join(' · ')}</span>
        {/* aria-hidden: el nombre accesible del botón ya lo dan el título y el resumen;
            anunciar además «Ver detalle» repetiría la acción que el rol botón implica. */}
        <span className="card__open" aria-hidden="true">
          {labels.open}
        </span>
      </div>
    </button>
  );
}
