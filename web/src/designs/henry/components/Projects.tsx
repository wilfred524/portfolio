import { useState } from 'react';
import type { ProjectItem } from '../../../content/profile';
import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

/**
 * Fila de proyecto. Abierta por defecto: el "+" no invitaba a nada y quien no hacía
 * clic se llevaba la impresión de que no había contenido. El toggle sigue ahí para
 * poder cerrar.
 *
 * Título, periodo y métrica viven FUERA del panel plegable: son lo que se escanea, y
 * antes estaban enterrados en el texto fantasma de fondo.
 */
function ProjectRow({ item }: { item: ProjectItem }) {
  const [open, setOpen] = useState(true);

  const meta = [item.company, item.role, item.period].filter(Boolean).join(' · ');

  return (
    <li className={`henry-proj${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="henry-proj__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <h3 className="henry-proj__title">{item.title}</h3>
        <span className="henry-proj__sign" aria-hidden="true" />
      </button>

      <p className="henry-meta henry-proj__meta">{meta}</p>
      {item.metric && <p className="henry-proj__metric">{item.metric}</p>}

      <div className="henry-proj__panel">
        <div className="henry-proj__panel-inner">
          <p className="henry-proj__desc">{item.description}</p>
          <div className="henry-proj__tags">
            {item.tags.map((tag) => (
              <span key={tag} className="henry-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
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
