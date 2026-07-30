import { profile } from '../../../content/profile';
import { useReveal } from '../../../hooks/useReveal';
import { HalftonePlate } from './HalftonePlate';

export function Hero() {
  const titleRef = useReveal<HTMLDivElement>(0.1);

  // Gesto de firma: la última palabra del tagline va en itálica dentro del romano.
  const words = profile.tagline.trim().split(' ');
  const lead = words.slice(0, -1).join(' ');
  const lastWord = words[words.length - 1];

  // Nombre a dos voces: nombre en condensada, resto (apellidos) en serif display.
  const nameParts = profile.name.trim().split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

  return (
    <header className="henry-section henry-hero">
      <div className="henry-hero__left">
        <p className="henry-meta">{profile.role}</p>
        <div ref={titleRef} className="henry-reveal">
          <h1 className="henry-display">
            <span className="henry-display__condensed">{firstName}</span>
            <span className="henry-display__serif">{restName}</span>
          </h1>
        </div>
        <p className="henry-headline henry-hero__tagline">
          {lead} <em>{lastWord}</em>
        </p>
        <div className="henry-hero__foot">
          <span className="henry-meta">{profile.availability}</span>
        </div>
      </div>
      <div className="henry-hero__plate" aria-hidden="true">
        <HalftonePlate />
      </div>
    </header>
  );
}
