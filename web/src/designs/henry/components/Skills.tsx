import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

export function Skills() {
  return (
    <section className="henry-section">
      <h2 className="henry-sr-only">Habilidades</h2>
      <SectionHeader word="Habilidades" variant="serif" />
      <ul className="henry-skills__list">
        {profile.skills.map((skill) => (
          <li key={skill.name} className="henry-skill">
            <span className="henry-skill__name">{skill.name}</span>
            <span className="henry-meta">{skill.level}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
