import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

export function Skills() {
  return (
    <section className="henry-section">
      <h2 className="henry-sr-only">Habilidades</h2>
      <SectionHeader word="Habilidades" variant="serif" />
      {/* Mismo patrón de agrupación que Projects: label + regla, luego la lista */}
      {profile.skillGroups.map((group) => (
        <section key={group.area} className="henry-catgroup">
          <div className="henry-catgroup__label">
            <span className="henry-meta">{group.area}</span>
            <span className="henry-catgroup__rule" />
          </div>
          <ul className="henry-skills__list">
            {group.items.map((item) => (
              <li key={item} className="henry-skill">
                <span className="henry-skill__name">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
