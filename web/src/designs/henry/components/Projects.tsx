import type { ProjectItem } from '../../../content/profile';
import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

/** El bloque del medio es el que contrata: ahí va el criterio, no la ejecución. */
const BLOCKS = [
  { key: 'problem', label: 'Problema' },
  { key: 'hard', label: 'Lo difícil' },
  { key: 'result', label: 'Resultado' },
] as const;

/**
 * Fila de proyecto en dos columnas: la meta (empresa, rol, periodo, tags) a la
 * izquierda y el texto a la derecha. Antes era una columna estrecha con el 60% del
 * lienzo vacío durante toda la sección; así el patrón se repite y ordena la lectura.
 *
 * Sin plegado: el acordeón escondía el contenido a quien no hacía clic, que es casi
 * todo el mundo.
 */
function ProjectRow({ item }: { item: ProjectItem }) {
  return (
    <li className="henry-proj">
      <div className="henry-proj__aside">
        {item.company && <p className="henry-meta">{item.company}</p>}
        <p className="henry-meta">{item.role}</p>
        <p className="henry-meta henry-proj__period">{item.period}</p>
        <div className="henry-proj__tags">
          {item.tags.map((tag) => (
            <span key={tag} className="henry-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="henry-proj__main">
        <h3 className="henry-proj__title">{item.title}</h3>
        {item.metric && <p className="henry-proj__metric">{item.metric}</p>}

        {item.body
          ? BLOCKS.map(({ key, label }) => (
              <div key={key} className="henry-proj__block">
                <p className="henry-meta henry-proj__block-label">{label}</p>
                <p className="henry-proj__desc">{item.body![key]}</p>
              </div>
            ))
          : item.brief && <p className="henry-proj__desc">{item.brief}</p>}
      </div>
    </li>
  );
}

/**
 * Experiencia. Ya no abre banda propia: comparte la banda Paper con Habilidades
 * (ver HenryPage), porque al disolverse «Sobre mí» quedaban dos bandas Ink seguidas.
 */
export function Projects() {
  return (
    <>
      <h2 className="henry-sr-only">Experiencia</h2>
      <SectionHeader word="Experiencia" />

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
    </>
  );
}
