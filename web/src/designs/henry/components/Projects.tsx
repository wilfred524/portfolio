import { profile } from '../../../content/profile';
import { InkSection } from '../HenryPage';

export function Projects() {
  return (
    <InkSection id="proyectos">
      <p className="henry-meta">Proyectos seleccionados</p>
      <ul className="henry-projects__list">
        {profile.projects.map((project) => (
          <li key={project.index} className="henry-project">
            <span className="henry-project__index">{project.index}</span>
            <div>
              <h2 className="henry-project__title">{project.title}</h2>
              <p className="henry-project__description">{project.description}</p>
              <div className="henry-project__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="henry-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="henry-meta henry-project__year">{project.year}</span>
          </li>
        ))}
      </ul>
    </InkSection>
  );
}
