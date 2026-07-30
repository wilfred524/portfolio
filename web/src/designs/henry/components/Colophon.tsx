import { useContent } from '../../../i18n/LanguageProvider';

/**
 * «Cómo está hecho». Tres líneas antes de Contacto: a nivel JR/intermedio la
 * capacidad de aprender solo pesa tanto como el stack, y este sitio es la prueba
 * más limpia que hay de ella — inspeccionable sin firmar nada.
 */
export function Colophon() {
  const profile = useContent();

  return (
    <div className="henry-subsection henry-colophon">
      <h2 className="henry-sr-only">{profile.ui.sections.colophon}</h2>
      <p className="henry-meta">{profile.ui.sections.colophon}</p>
      <p className="henry-colophon__text">{profile.colophon}</p>
      <a className="henry-linkbtn" href={profile.repoUrl} target="_blank" rel="noreferrer">
        {profile.ui.viewCode} ↗
      </a>
    </div>
  );
}
