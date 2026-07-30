import { profile } from '../../../content/profile';
import { InkSection } from '../HenryPage';

export function About() {
  return (
    <InkSection>
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
    </InkSection>
  );
}
