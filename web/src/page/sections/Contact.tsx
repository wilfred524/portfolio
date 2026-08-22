import { useContent } from '../../i18n/LanguageProvider';
import { track } from '../../lib/analytics';
import { SectionHeader } from '../../ui/SectionHeader';

/**
 * Cierre: los datos de perfil que un evaluador se pregunta en los primeros segundos
 * (formación, idiomas, modalidad, dominio) y cómo escribir.
 *
 * Las líneas con `value` vacío no se pintan: mejor omitir un dato que publicar uno a
 * medias. El enlace de respaldo solo aparece si trae su propia etiqueta, para no tener
 * que inventar aquí un «Ver documento» que sería copy hardcodeado en un componente.
 */
export function Contact() {
  const profile = useContent();
  const facts = profile.facts.filter((fact) => fact.value.trim() !== '');

  return (
    <section className="section" id="contacto">
      <SectionHeader title={profile.ui.sections.contact} />

      <div className="raw">
        {facts.length > 0 && (
          <dl className="raw">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label">{fact.label}</dt>
                <dd>
                  {fact.value}
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
        )}

        <div>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <p className="meta">{profile.phone}</p>
        </div>

        <div className="hero__links">
          {/* Un solo documento, el del idioma activo, y se descarga en vez de abrirse. */}
          <a
            className="btn btn--solid"
            href={profile.cv.url}
            download
            onClick={() => track('cv-descargado', { origen: 'contacto' })}
          >
            {profile.cv.label}
          </a>
          {profile.social.map((link) => (
            <a
              key={link.label}
              className="btn"
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                track(link.url.includes('github') ? 'repositorio-abierto' : 'linkedin-abierto', {
                  origen: 'contacto',
                })
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
