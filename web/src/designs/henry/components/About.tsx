import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

/** Banda Paper: alterna con las bandas Ink (Masthead / Proyectos) para dar ritmo. */
export function About() {
  return (
    <section className="henry-section">
      <h2 className="henry-sr-only">Sobre mí</h2>
      <SectionHeader word="Sobre mí" variant="serif" />
      <div className="henry-letter">
        <p className="henry-meta henry-letter__eyebrow">Una breve carta</p>
        <div className="henry-letter__body">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="henry-serif">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="henry-meta henry-letter__eyebrow henry-letter__eyebrow--flip">
          Una breve carta
        </p>
      </div>
    </section>
  );
}
