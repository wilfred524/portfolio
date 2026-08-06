import { useContent } from '../../../i18n/LanguageProvider';
import { Chat } from './Chat';
import { InkSection } from './InkSection';
import { SectionHeader } from './SectionHeader';

/**
 * Cierre de la página. Absorbe el bloque de Perfil —formación, idiomas, modalidad—:
 * como sección propia eran dos líneas ocupando una banda entera, y aquí responden
 * justo antes de que alguien decida escribir.
 */
export function Contact() {
  const profile = useContent();
  const facts = profile.facts.filter((fact) => fact.value.trim() !== '');

  return (
    <InkSection id="contacto">
      <h2 className="henry-sr-only">{profile.ui.sections.contact}</h2>
      <SectionHeader word={profile.ui.sections.contact} />

      <div className="henry-contact">
        <p className="henry-contact__closing">{profile.closing}</p>

        {/* El chat va justo después del cierre y antes de los datos: quien ha llegado
            hasta aquí ya decidió que le interesa, y preguntar cuesta menos que escribir
            un correo. El correo y el teléfono siguen debajo para quien los prefiera. */}
        <Chat />

        {facts.length > 0 && (
          <dl className="henry-skills henry-contact__facts">
            {facts.map((fact) => (
              <div key={fact.label} className="henry-skills__row">
                <dt className="henry-meta henry-skills__area">{fact.label}</dt>
                <dd className="henry-skills__items">
                  {fact.value}
                  {fact.href && (
                    <>
                      {' '}
                      <a
                        className="henry-inline-link"
                        href={fact.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {fact.hrefLabel ?? 'Ver documento'} ↗
                      </a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <a className="henry-contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <span className="henry-meta">{profile.phone}</span>
        <div className="henry-contact__links">
          {/* Un solo documento, el del idioma activo, y se descarga en vez de abrirse. */}
          <a className="henry-linkbtn" href={profile.cv.url} download>
            {profile.cv.label} ↓
          </a>
          {profile.social.map((link) => (
            <a
              key={link.label}
              className="henry-linkbtn"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </InkSection>
  );
}
