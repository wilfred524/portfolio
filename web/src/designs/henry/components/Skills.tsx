import { useContent } from '../../../i18n/LanguageProvider';
import { SectionHeader } from './SectionHeader';

/**
 * Cierra la banda Paper que abre Experiencia; no es banda propia (ver HenryPage).
 * Una línea por área en vez de una fila por tecnología: veinte filas idénticas
 * ocupaban un tercio de la página sin comunicar jerarquía.
 */
export function Skills() {
  const profile = useContent();

  return (
    <div className="henry-subsection">
      <h2 className="henry-sr-only">{profile.ui.sections.skills}</h2>
      <SectionHeader word={profile.ui.sections.skills} />
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
