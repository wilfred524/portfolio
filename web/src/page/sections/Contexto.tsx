import { useContent } from '../../i18n/LanguageProvider';

export function Contexto() {
  const profile = useContent();
  const empleo = profile.employments[0];
  const dominio = profile.facts.find((f) => f.id === 'domain');

  return (
    <div className="plano__cuerpo contexto">
      <p className="label" data-texto>{profile.ui.sections.experience}</p>

      <h2 className="plano__rotulo" data-figura="context">{empleo.employer}</h2>
      <p className="contexto__linea" data-texto>
        {empleo.role} · {empleo.period}
        {empleo.mode && ` · ${empleo.mode}`}
      </p>

      {empleo.tagline && <p className="prose contexto__tagline" data-texto>{empleo.tagline}</p>}

      {dominio && dominio.value.trim() !== '' && (
        <div className="contexto__dominio">
          <p className="label" data-texto>{dominio.label}</p>
          <p className="prose" data-texto>{dominio.value}</p>
        </div>
      )}
    </div>
  );
}
