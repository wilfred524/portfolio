import { useEffect, useRef } from 'react';
import { useContent } from '../i18n/LanguageProvider';
import { track } from '../lib/analytics';
import { PLANOS } from '../page/planos';
import { LangSwitch } from './LangSwitch';

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
  const barra = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = barra.current;
    if (!el) return;
    const medir = () =>
      document.documentElement.style.setProperty('--hud-h', `${el.offsetHeight}px`);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <header className="hud" ref={barra}>
      <button type="button" className="hud__marca" onClick={() => irA(0)}>
        WM.
      </button>

      {/* En modo documento la página se recorre con el scroll y los planos son anclas;
          el menú sigue sirviendo, así que se queda en los dos modos. */}
      <nav className="hud__planos" aria-label={planes.ariaLabel}>
        <ol>
          {PLANOS.map((p, indice) => (
            <li key={p.id}>
              <button
                type="button"
                className="hud__plano"
                aria-current={indice === plano ? 'true' : undefined}
                onClick={() => irA(indice)}
              >
                {planes[p.nombre]}
              </button>
            </li>
          ))}
        </ol>
      </nav>

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
    </header>
  );
}

export function Flechas({
  plano,
  irA,
}: {
  plano: number;
  irA: (indice: number) => void;
}) {
  const { planes } = useContent().ui;

  return (
    <>
      <button
        type="button"
        className="flecha flecha--izq"
        onClick={() => irA(plano - 1)}
        disabled={plano === 0}
        aria-label={planes.previous}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <button
        type="button"
        className="flecha flecha--der"
        onClick={() => irA(plano + 1)}
        disabled={plano === PLANOS.length - 1}
        aria-label={planes.next}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </>
  );
}
