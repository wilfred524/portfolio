import { profile } from '../../../content/profile';

/**
 * «Cómo está hecho». Tres líneas antes de Contacto: a nivel JR/intermedio la
 * capacidad de aprender solo pesa tanto como el stack, y este sitio es la prueba
 * más limpia que hay de ella — inspeccionable sin firmar nada.
 */
export function Colophon() {
  return (
    <div className="henry-subsection henry-colophon">
      <h2 className="henry-sr-only">Cómo está hecho este sitio</h2>
      <p className="henry-meta">Cómo está hecho este sitio</p>
      <p className="henry-colophon__text">{profile.colophon}</p>
      <a className="henry-linkbtn" href={profile.repoUrl} target="_blank" rel="noreferrer">
        Ver el código ↗
      </a>
    </div>
  );
}
