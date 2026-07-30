import { profile } from '../../../content/profile';
import { SectionHeader } from './SectionHeader';

/**
 * Cierra la banda Paper que abre Experiencia; no es banda propia (ver HenryPage).
 * Una línea por área en vez de una fila por tecnología: veinte filas idénticas
 * ocupaban un tercio de la página sin comunicar jerarquía.
 */
export function Skills() {
  return (
    <div className="henry-subsection">
      <h2 className="henry-sr-only">Habilidades</h2>
      <SectionHeader word="Habilidades" />
      <dl className="henry-skills">
        {profile.skillGroups.map((group) => (
          <div key={group.area} className="henry-skills__row">
            <dt className="henry-meta henry-skills__area">{group.area}</dt>
            <dd className="henry-skills__items">{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
