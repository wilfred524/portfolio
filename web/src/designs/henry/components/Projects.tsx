import type { ProjectItem } from '../../../content/profile';
import { profile } from '../../../content/profile';
import { InkSection } from '../HenryPage';
import { SectionHeader } from './SectionHeader';
import { useScrollProgress } from '../../../hooks/useScrollProgress';

/** Una fila de proyecto: contenido estático legible + texto fantasma que se alinea
 *  al scroll + botón "Expandir" contrastado con la info completa. */
function ProjectRow({ item }: { item: ProjectItem }) {
  const ghostRef = useScrollProgress<HTMLSpanElement>();

  return (
    <li className="henry-proj">
      {/* Texto fantasma: nombre repetido, desplazado, que se centra al bajar (--p) */}
      <span ref={ghostRef} className="henry-proj__ghost" aria-hidden="true">
        <span className="henry-proj__ghost-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>{item.title}&nbsp;&nbsp;</span>
          ))}
        </span>
      </span>

      <div className="henry-proj__body">
        <div className="henry-proj__top">
          <h3 className="henry-proj__title">{item.title}</h3>
          <div className="henry-proj__tags">
            {item.tags.map((tag) => (
              <span key={tag} className="henry-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="henry-meta henry-proj__context">{item.context}</p>
        <details className="henry-proj__more">
          <summary className="henry-proj__expand">
            <span className="henry-proj__expand-open">Expandir</span>
            <span className="henry-proj__expand-close">Cerrar</span>
          </summary>
          <p className="henry-proj__desc">{item.description}</p>
        </details>
      </div>
    </li>
  );
}

export function Projects() {
  return (
    <InkSection id="proyectos">
      <h2 className="henry-sr-only">Proyectos seleccionados</h2>
      <SectionHeader word="Proyectos" variant="masthead" />

      {profile.projectGroups.map((group) => (
        <section key={group.category} className="henry-catgroup">
          <div className="henry-catgroup__label">
            <span className="henry-meta">{group.category}</span>
            <span className="henry-catgroup__rule" />
          </div>
          <ul className="henry-projlist">
            {group.items.map((item) => (
              <ProjectRow key={item.title} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </InkSection>
  );
}
