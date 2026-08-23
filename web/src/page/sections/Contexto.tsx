import { useContent } from '../../i18n/LanguageProvider';

/**
 * Plano 1. Sitúa el escenario, una sola vez.
 *
 * Una empresa que nadie conoce, un equipo de cuatro personas y un sector regulado son el
 * contexto que convierte «hice un motor de reglas» en «hice un motor de reglas donde eso
 * importaba». Dicho aquí, los nueve proyectos de los planos siguientes no tienen que
 * repetir empresa, rol ni periodo: ya se dijeron.
 *
 * El dominio (crédito por libranza) aparece aquí y **una sola vez**, como circunstancia y
 * no como identidad: es la regla de `docs/perfil-publico.md`, porque en el titular solo
 * cierra puertas fuera del sector.
 */
export function Contexto() {
  const profile = useContent();
  const empleo = profile.employments[0];
  const dominio = profile.facts.find((f) => f.id === 'domain');

  return (
    <div className="plano__cuerpo contexto">
      <p className="label">{profile.ui.sections.experience}</p>

      <h2 className="contexto__empresa">{empleo.employer}</h2>
      <p className="contexto__linea">
        {empleo.role} · {empleo.period}
        {empleo.mode && ` · ${empleo.mode}`}
      </p>

      {empleo.tagline && <p className="prose contexto__tagline">{empleo.tagline}</p>}

      {dominio && dominio.value.trim() !== '' && (
        <div className="contexto__dominio">
          <p className="label">{dominio.label}</p>
          <p className="prose">{dominio.value}</p>
        </div>
      )}
    </div>
  );
}
