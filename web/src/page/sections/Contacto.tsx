import { useContent } from '../../i18n/LanguageProvider';
import { track } from '../../lib/analytics';

/**
 * Plano 6: el cierre.
 *
 * Aquí las partículas no formarán ninguna figura: se abren y dejan sitio. Fin de la
 * coreografía, principio de la conversación.
 *
 * El colofón cierra aquí y no en un plano propio porque en este sitio no es una nota al
 * pie: es la última prueba. Explicar que las animaciones que se acaban de ver están
 * escritas sin librería solo funciona **después** de haberlas visto funcionar.
 */
export function Contacto() {
  const profile = useContent();

  return (
    <div className="plano__cuerpo contacto">
      <p className="label">{profile.ui.sections.contact}</p>

      <p className="contacto__directo">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <span className="meta">{profile.phone}</span>
      </p>

      <div className="contacto__acciones">
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

      <div className="contacto__colofon">
        <p className="label">{profile.ui.sections.colophon}</p>
        <p className="prose">{profile.colophon}</p>
        <p>
          <a
            href={profile.repoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('repositorio-abierto', { origen: 'colofon' })}
          >
            {profile.ui.viewCode}
          </a>
        </p>
      </div>

      <p className="contacto__copy">© 2026 {profile.name}</p>
    </div>
  );
}
