import { useContent } from '../i18n/LanguageProvider';
import { track } from '../lib/analytics';
import { PLANOS } from '../page/planos';
import { LangSwitch } from './LangSwitch';

/**
 * La capa persistente. No es un plano y no participa en la coreografía: está desde el
 * primer fotograma y no se mueve.
 *
 * Es lo que contesta a «¿y quien llega con prisa?». En una página sin scroll, dejar el CV
 * al final significaría enterrarlo detrás de seis transiciones; aquí está a un clic desde
 * cualquier punto de la narración, igual que el chat y el conmutador de idioma.
 */
export function Hud({
  plano,
  irA,
  documento,
  conmutarModo,
}: {
  plano: number;
  irA: (indice: number) => void;
  documento: boolean;
  conmutarModo: () => void;
}) {
  const profile = useContent();
  const { planes } = profile.ui;

  return (
    <div className="hud">
      <div className="hud__bar">
        <button type="button" className="hud__marca" onClick={() => irA(0)}>
          wm.
        </button>

        <div className="hud__acciones">
          <a
            className="btn btn--sm"
            href={profile.cv.url}
            download
            onClick={() => track('cv-descargado', { origen: 'hud' })}
          >
            {profile.cv.label}
          </a>
          <button type="button" className="btn btn--sm" onClick={conmutarModo}>
            {documento ? planes.observatoryMode : planes.documentMode}
          </button>
          <LangSwitch />
        </div>
      </div>

      {/* El rail solo tiene sentido mientras se navega por planos: en modo documento la
          página se recorre con el scroll y un índice flotante sobraría. */}
      {!documento && (
        <nav className="rail" aria-label={planes.ariaLabel}>
          <ol>
            {PLANOS.map((p, indice) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="rail__punto"
                  aria-current={indice === plano ? 'true' : undefined}
                  onClick={() => irA(indice)}
                >
                  {/* El número se ve; el nombre aparece al enfocar o al pasar por encima,
                      y es lo que lee un lector de pantalla. */}
                  <span aria-hidden="true" className="rail__num">
                    {String(indice + 1).padStart(2, '0')}
                  </span>
                  <span className="rail__nombre">{planes[p.nombre]}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
