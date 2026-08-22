import { useContent } from '../../i18n/LanguageProvider';
import { SectionHeader } from '../../ui/SectionHeader';

/**
 * Habilidades: una línea por área, no una fila por tecnología.
 *
 * Cada elemento de la lista es un literal buscable por sí solo («PHP», «Laravel», y no
 * «PHP / Laravel»): un filtro de vacantes que parte por el separador nunca produciría
 * los tokens sueltos. Por eso se unen con punto medio solo al pintar.
 */
export function Skills() {
  const profile = useContent();

  return (
    <section className="section" id="habilidades">
      <SectionHeader title={profile.ui.sections.skills} />

      {/* En dos columnas y no en una lista: siete áreas apiladas ocupaban una pantalla
          entera para lo que son siete líneas de texto. */}
      <dl className="cols">
        {profile.skillGroups.map((group) => (
          <div key={group.area} className="cols__item">
            <dt className="label">{group.area}</dt>
            <dd>{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
