import { profile } from '../../../content/profile';
import { useReveal } from '../../../hooks/useReveal';

export function About() {
  const ref = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="henry-section">
      <hr className="henry-hairline" />
      <div className="henry-about">
        <p className="henry-meta">Sobre mí</p>
        <div ref={ref} className="henry-about__copy henry-reveal">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="henry-serif">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
