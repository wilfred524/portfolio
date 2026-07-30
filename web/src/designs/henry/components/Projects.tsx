import { profile } from '../../../content/profile';
import { InkSection } from '../HenryPage';
import { SectionHeader } from './SectionHeader';

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
              <li key={item.title} className="henry-proj">
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
                <p className="henry-proj__desc">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </InkSection>
  );
}
