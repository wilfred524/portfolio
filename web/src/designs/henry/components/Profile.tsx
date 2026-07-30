import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

/**
 * Formación, idiomas, modalidad y contexto de dominio. Son las preguntas que un
 * evaluador se hace en los primeros segundos: sin respuesta, cada una cuesta un correo
 * que a menudo no se envía. Las líneas sin dato no se pintan.
 */
export function Profile() {
  const facts = profile.facts.filter((fact) => fact.value.trim() !== '');
  if (facts.length === 0) return null;

  return (
    <div className="henry-subsection">
      <h2 className="henry-sr-only">Perfil</h2>
      <SectionHeader word="Perfil" />
      <dl className="henry-skills">
        {facts.map((fact) => (
          <div key={fact.label} className="henry-skills__row">
            <dt className="henry-meta henry-skills__area">{fact.label}</dt>
            <dd className="henry-skills__items">
              {fact.value}
              {fact.href && (
                <>
                  {' '}
                  <a className="henry-inline-link" href={fact.href} target="_blank" rel="noreferrer">
                    {fact.hrefLabel ?? 'Ver documento'} ↗
                  </a>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
