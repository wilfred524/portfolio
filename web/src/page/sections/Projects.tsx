import { useContent } from '../../i18n/LanguageProvider';
import { SectionHeader } from '../../ui/SectionHeader';

/**
 * Experiencia. En la capa 0 el contenido va en bruto: aquí se comprueba que está todo
 * y en el orden correcto, no cómo se ve. Las tarjetas llegan en la capa 3.
 *
 * Lo que sí es definitivo es la jerarquía: **un empleo, varios proyectos dentro**. La
 * cabecera del contrato se pinta al llegar al PRIMER grupo que cuelga de él, y no se
 * repite. Sin eso, siete tareas del mismo puesto se leen como siete trabajos distintos,
 * que es exactamente el ruido que este modelo de datos existe para evitar.
 */
export function Projects() {
  const profile = useContent();

  let empleoPintado = '';

  return (
    <section className="section" id="experiencia">
      <SectionHeader title={profile.ui.sections.experience} />

      <div className="raw">
        {profile.projectGroups.map((group) => {
          const empleo = profile.employments.find((e) => e.id === group.employmentId);
          const abreEmpleo = empleo !== undefined && empleo.id !== empleoPintado;
          if (abreEmpleo) empleoPintado = empleo.id;

          return (
            <section key={group.category}>
              {abreEmpleo && empleo && (
                <header>
                  <h3>{empleo.employer}</h3>
                  <p className="meta">
                    {empleo.role} · {empleo.period}
                    {empleo.mode && ` · ${empleo.mode}`}
                  </p>
                  {empleo.tagline && <p>{empleo.tagline}</p>}
                </header>
              )}

              <p className="label">
                {group.category}
                {group.note && ` · ${group.note}`}
              </p>

              <ul className="raw">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <h4>{item.title}</h4>
                    {item.role && <p className="meta">{item.role}</p>}
                    {item.period && <p className="meta">{item.period}</p>}
                    {item.metric && <p className="meta">{item.metric}</p>}

                    {item.body
                      ? (['problem', 'hard', 'result'] as const).map((key) => (
                          <div key={key}>
                            <p className="label">{profile.ui.blocks[key]}</p>
                            <p>{item.body![key]}</p>
                          </div>
                        ))
                      : item.brief && <p>{item.brief}</p>}

                    <p className="meta">{item.tags.join(' · ')}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
