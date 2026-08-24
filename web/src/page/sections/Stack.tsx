import { useContent } from '../../i18n/LanguageProvider';

export function Stack({ titulo }: { titulo: string }) {
  const profile = useContent();
  const ficha = profile.facts.filter((f) => f.id !== 'domain' && f.value.trim() !== '');

  return (
    <div className="plano__cuerpo instrumental">
      <div>
        {/* El rótulo del plano hace de encabezado de las tecnologías: repetir
            «Habilidades» debajo sería decir dos veces lo mismo. */}
        <h2 className="plano__rotulo" data-figura="stack">{titulo}</h2>
        <dl className="cols">
          {profile.skillGroups.map((group) => (
            <div key={group.area} className="cols__item">
              <dt className="label" data-texto>{group.area}</dt>
              {/* Cada tecnología es un literal buscable por sí solo; el punto medio es
                  solo el separador con que se pintan. */}
              <dd data-texto>{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <p className="label" data-texto>{profile.ui.sections.profile}</p>
        <dl className="cols">
          {ficha.map((fact) => (
            <div key={fact.id} className="cols__item">
              <dt className="label" data-texto>{fact.label}</dt>
              <dd data-texto>
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
