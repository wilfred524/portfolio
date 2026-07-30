import { profile } from '../../../content/profile';
import { InkSection } from './InkSection';
import { SectionHeader } from './SectionHeader';

export function Contact() {
  return (
    <InkSection id="contacto">
      <h2 className="henry-sr-only">Contacto</h2>
      <SectionHeader word="Contacto" variant="serif" />
      <div className="henry-contact">
        <p className="henry-contact__closing">{profile.closing}</p>
        <p className="henry-meta">¿Trabajamos juntos?</p>
        <a className="henry-contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <span className="henry-meta">{profile.phone}</span>
        <div className="henry-contact__links">
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
