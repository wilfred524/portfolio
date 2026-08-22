import { useState } from 'react';
import type { ProjectItem } from '../../content';
import { useContent } from '../../i18n/LanguageProvider';
import { SectionHeader } from '../../ui/SectionHeader';
import { ProjectCard } from '../../ui/ProjectCard';
import { ProjectModal } from '../../ui/ProjectModal';

/**
 * Experiencia: una rejilla de tarjetas, y el detalle en un modal.
 *
 * La rejilla es lo que mantiene la página corta. Diez proyectos en extenso, uno debajo
 * de otro, eran cuatro pantallas de scroll antes de llegar al pie; en tarjetas caben en
 * poco más de una, y quien quiera el detalle lo pide.
 *
 * La jerarquía sigue siendo **un empleo, varios proyectos dentro**: la cabecera del
 * contrato se pinta al llegar al PRIMER grupo que cuelga de él y no se repite. Sin eso,
 * siete tareas del mismo puesto se leen como siete trabajos distintos.
 */
export function Projects() {
  const profile = useContent();
  const [abierto, setAbierto] = useState<ProjectItem | null>(null);

  // De qué empleo cuelga cada proyecto, para que el modal pueda situarlo sin que el
  // dato se repita diez veces en el contenido.
  const empleoDe = new Map<string, string>();
  let empleoPintado = '';

  return (
    <section className="section" id="experiencia">
      <SectionHeader title={profile.ui.sections.experience} />

      {profile.projectGroups.map((group) => {
        const empleo = profile.employments.find((e) => e.id === group.employmentId);
        const abreEmpleo = empleo !== undefined && empleo.id !== empleoPintado;
        if (abreEmpleo) empleoPintado = empleo.id;
        if (empleo) group.items.forEach((item) => empleoDe.set(item.id, empleo.id));

        return (
          <div key={group.category} className="group">
            {abreEmpleo && empleo && (
              <header className="job">
                <h3 className="job__employer">{empleo.employer}</h3>
                <p className="meta">
                  {empleo.role} · {empleo.period}
                  {empleo.mode && ` · ${empleo.mode}`}
                </p>
                {empleo.tagline && <p className="prose job__tagline">{empleo.tagline}</p>}
              </header>
            )}

            <p className="label group__label">
              {group.category}
              {group.note && ` · ${group.note}`}
            </p>

            <div className="grid">
              {group.items.map((item) => (
                <ProjectCard
                  key={item.id}
                  item={item}
                  labels={profile.ui.project}
                  onOpen={() => setAbierto(item)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {abierto && (
        <ProjectModal
          // La clave fuerza un montaje nuevo por proyecto: sin ella, abrir otro reciclaría
          // el panel y los efectos de foco y scroll no volverían a correr.
          key={abierto.id}
          item={abierto}
          employment={profile.employments.find((e) => e.id === empleoDe.get(abierto.id))}
          ui={profile.ui}
          onClose={() => setAbierto(null)}
        />
      )}
    </section>
  );
}
