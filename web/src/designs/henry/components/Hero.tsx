import { profile } from '../../../content/profile';
import { useReveal } from '../../../hooks/useReveal';

export function Hero() {
  const titleRef = useReveal<HTMLDivElement>(0.1);

  return (
    <header className="henry-section henry-hero">
      <p className="henry-meta">{profile.role}</p>
      <div ref={titleRef} className="henry-reveal">
        <h1 className="henry-display">{profile.name}</h1>
      </div>
      <p className="henry-serif henry-hero__tagline">{profile.tagline}</p>
      <div className="henry-hero__foot">
        <span className="henry-meta">{profile.availability}</span>
        <span className="henry-meta">↓ Desplázate</span>
      </div>
    </header>
  );
}
