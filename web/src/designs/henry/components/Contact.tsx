import { profile } from '../../../content/profile';
import { InkSection } from '../HenryPage';

export function Contact() {
  return (
    <InkSection id="contacto">
      <div className="henry-contact">
        <p className="henry-meta">¿Trabajamos juntos?</p>
        <a className="henry-contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <span className="henry-meta">{profile.phone}</span>
        <div className="henry-contact__links">
          {profile.social.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </InkSection>
  );
}
