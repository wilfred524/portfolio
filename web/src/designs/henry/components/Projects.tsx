import { useState } from 'react';
import type { ProjectItem } from '../../../content/profile';
import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';
import { useScrollProgress } from '../../../hooks/useScrollProgress';

/**
 * Fila de proyecto. Colapsada: el título queda CENTRADO y un texto fantasma
 * (descriptor, misma serif) lo rodea a izquierda y derecha. Al expandir: el título se
 * alinea a la izquierda y, sincronizada, una barra en color claro hace wipe de
 * izquierda→derecha con toda la info (contexto + descripción + tags dentro).
 */
function ProjectRow({ item }: { item: ProjectItem }) {
  const rowRef = useScrollProgress<HTMLLIElement>();
  const [open, setOpen] = useState(false);

  return (
    <li ref={rowRef} className={`henry-proj${open ? ' is-open' : ''}`}>
      <div className="henry-proj__grid">
        {/* Fantasma izquierdo: flanquea el título (nunca detrás → jamás lo solapa) */}
        <span className="henry-proj__ghost henry-proj__ghost--left" aria-hidden="true">
          <span className="henry-proj__ghost-track">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{item.ghost}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            ))}
          </span>
        </span>

        <button
          type="button"
          className="henry-proj__toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <h3 className="henry-proj__title">{item.title}</h3>
          <span className="henry-proj__sign" aria-hidden="true" />
        </button>

        {/* Columna derecha: fantasma (colapsado) + barra de descripción (al expandir) */}
        <div className="henry-proj__col3">
          <span className="henry-proj__ghost henry-proj__ghost--right" aria-hidden="true">
            <span className="henry-proj__ghost-track">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{item.ghost}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              ))}
            </span>
          </span>
          <div className="henry-proj__panel-inner">
            <p className="henry-meta henry-proj__context">{item.context}</p>
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
      <SectionHeader word="Experiencia" variant="masthead" />

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
