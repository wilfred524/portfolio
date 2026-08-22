import { useContent } from '../../i18n/LanguageProvider';
import { track } from '../../lib/analytics';

/**
 * Primer viewport: nombre, rol, stack y credencial, más los enlaces que un evaluador
 * busca antes de decidir si sigue leyendo (CV, repositorio, correo).
 *
 * En la capa 2 el nombre pasa a formarse con las estrellas del fondo. El `<h1>` se
 * queda aquí igualmente: la animación lo ilustra, no lo sustituye.
 */
export function Hero() {
  const profile = useContent();

  return (
    <header className="hero" id="inicio">
      <h1 className="hero__name">{profile.name}</h1>

      {/* Separador de punto medio y no raya: la raya está descartada en todas las
          superficies del perfil salvo rangos de fechas. */}
      <p className="hero__role">
        {profile.role} · {profile.stack}
      </p>

      <p className="hero__credential">{profile.credential}</p>

      <div className="hero__links">
        {/* El CV primero, y como única acción sólida: sin documento que reenviar,
            muchos procesos ni empiezan. `download` para que se guarde en vez de
            abrirse en una pestaña. */}
        <a
          className="btn btn--solid"
          href={profile.cv.url}
          download
          onClick={() => track('cv-descargado', { origen: 'hero' })}
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
                origen: 'hero',
              })
            }
          >
            {link.label}
          </a>
        ))}
        <a className="btn" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </div>

      <div className="hero__foot">
        <span className="available">{profile.availability}</span>
        <span className="meta">{profile.trajectory}</span>
      </div>
    </header>
  );
}
