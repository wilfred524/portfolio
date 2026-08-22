import { useContent } from '../../i18n/LanguageProvider';
import { track } from '../../lib/analytics';

/**
 * Pie con el colofón dentro: cómo está hecho el sitio y el enlace al código.
 *
 * A nivel intermedio, la prueba de que se aprende solo pesa tanto como el stack, así
 * que el colofón no es una nota al margen: es contenido. Va en el pie porque es lo
 * último que se lee, no porque importe menos.
 *
 * El enlace al repositorio registra `repositorio-abierto` como los del hero y el
 * contacto; en el diseño anterior este era el único que no lo hacía.
 */
export function SiteFooter() {
  const profile = useContent();

  return (
    <footer className="footer">
      <h2 className="label">{profile.ui.sections.colophon}</h2>
      <p className="prose">{profile.colophon}</p>

      <p>
        <a
          href={profile.repoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('repositorio-abierto', { origen: 'colofon' })}
        >
          {profile.ui.viewCode}
        </a>
      </p>

      <p className="footer__copy">© 2026 {profile.name}</p>
    </footer>
  );
}
