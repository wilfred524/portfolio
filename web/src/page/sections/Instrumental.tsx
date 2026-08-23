import { useContent } from '../../i18n/LanguageProvider';

/**
 * Plano 5: herramientas y datos de perfil. Comparten plano porque los dos son bloques de
 * escaneo, no de lectura, y van después de la evidencia: una lista de literales delante
 * de los proyectos se lee como declaración; detrás, como índice de lo ya visto.
 *
 * El dominio no está aquí, se dijo en el plano de contexto.
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
