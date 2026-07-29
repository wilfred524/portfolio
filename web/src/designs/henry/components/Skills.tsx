import { profile } from '../../../content/profile';

export function Skills() {
  return (
    <section className="henry-section">
      <p className="henry-meta">Habilidades</p>
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
