import { useContent } from '../../i18n/LanguageProvider';

/**
 * Plano 1. Sitúa el escenario una sola vez, para que los nueve proyectos siguientes no
 * tengan que repetir empresa, rol ni periodo.
 *
 * El dominio aparece aquí y solo aquí, como circunstancia y no como identidad: es la
 * regla de `docs/perfil-publico.md`, porque en el titular cierra puertas fuera del sector.
 */
export function Contexto() {
  const profile = useContent();
  const empleo = profile.employments[0];
  const dominio = profile.facts.find((f) => f.id === 'domain');

  return (
    <div className="plano__cuerpo contexto">
      <p className="label" data-texto>{profile.ui.sections.experience}</p>

      <h2 className="contexto__empresa" data-texto>{empleo.employer}</h2>
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
