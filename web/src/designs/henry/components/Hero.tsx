import { useContent } from '../../../i18n/LanguageProvider';
import { useReveal } from '../../../hooks/useReveal';
import { HalftonePlate } from './HalftonePlate';

/**
 * Hero de credencial: el nombre es el titular y debajo va lo que un reclutador
 * busca al escanear — rol, stack y sistemas en producción — sin pedir un clic.
 * El slogan editorial se mudó a la banda Ink (ver Masthead).
 */
export function Hero() {
  const profile = useContent();
  const nameRef = useReveal<HTMLDivElement>(0.1);

  return (
    <header className="henry-section henry-hero">
      <div className="henry-hero__left">
        <div ref={nameRef} className="henry-reveal">
          <h1 className="henry-hero__name">{profile.name}</h1>
        </div>
        <p className="henry-meta henry-hero__stack">
          {profile.role} — {profile.stack}
        </p>
        <p className="henry-hero__credential">{profile.credential}</p>
        <div className="henry-hero__links">
          {/* El CV primero: sin documento que reenviar, muchos procesos ni empiezan.
              `download` para que se guarde, no para abrirse en una pestaña. */}
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
          <a className="henry-linkbtn" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
        <div className="henry-hero__foot">
          <span className="henry-meta">{profile.availability}</span>
          {/* Marco temporal desde el primer viewport: es lo que evita que nueve meses
              de trabajo se lean como cuatro años. */}
          <span className="henry-meta henry-hero__trajectory">{profile.trajectory}</span>
        </div>
      </div>
      <div className="henry-hero__plate" aria-hidden="true">
        <HalftonePlate />
      </div>
    </header>
  );
}
