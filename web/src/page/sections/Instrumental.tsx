import { useContent } from '../../i18n/LanguageProvider';

/**
 * Plano 5: herramientas y datos de perfil, juntos.
 *
 * Comparten plano porque los dos son bloques de **escaneo, no de lectura**: nadie lee 34
 * tecnologías, se buscan. Y van después de la evidencia y no antes: una lista de literales
 * puesta delante de los proyectos se lee como una declaración; puesta detrás, se lee como
 * el índice de lo que se acaba de ver.
 *
 * El dominio no está aquí: se dijo en el plano de contexto, que es donde sitúa. Los otros
 * tres datos son los que quitan objeciones logísticas justo antes del contacto.
 */
export function Instrumental() {
  const profile = useContent();
  const ficha = profile.facts.filter((f) => f.id !== 'domain' && f.value.trim() !== '');

  return (
    <div className="plano__cuerpo instrumental">
      <div>
        <p className="label">{profile.ui.sections.skills}</p>
        <dl className="cols">
          {profile.skillGroups.map((group) => (
            <div key={group.area} className="cols__item">
              <dt className="label">{group.area}</dt>
              {/* Cada tecnología es un literal buscable por sí solo; el punto medio es
                  solo el separador con que se pintan. */}
              <dd>{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <p className="label">{profile.ui.sections.profile}</p>
        <dl className="cols">
          {ficha.map((fact) => (
            <div key={fact.id} className="cols__item">
              <dt className="label">{fact.label}</dt>
              <dd>
                {fact.value}
                {/* El enlace de respaldo solo se pinta si trae su propia etiqueta: sin
                    ella habría que inventar aquí un «Ver documento», y eso sería copy
                    escrito en un componente. */}
                {fact.href && fact.hrefLabel && (
                  <>
                    {' '}
                    <a href={fact.href} target="_blank" rel="noreferrer">
                      {fact.hrefLabel}
                    </a>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
