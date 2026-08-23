import { useEffect, useRef } from 'react';
import { useContent } from '../i18n/LanguageProvider';
import { track } from '../lib/analytics';
import { PLANOS } from '../page/planos';
import { LangSwitch } from './LangSwitch';

/**
 * La capa persistente. No es un plano y no participa en la coreografía: está desde el
 * primer fotograma y no se mueve.
 *
 * En una página sin scroll, dejar el CV al final lo enterraría detrás de seis
 * transiciones; aquí está a un clic desde cualquier punto, igual que el idioma y el modo.
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
  const barra = useRef<HTMLElement>(null);

  /**
   * La barra publica su altura real: en inglés los nombres son más largos, y en pantalla
   * estrecha pasa a dos filas. Un hueco fijo se le queda corto y se come el rótulo.
   */
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

/**
 * Las dos flechas, una a cada lado de la pantalla.
 *
 * Son el control principal de la narración: avanzar y retroceder es lo único que se hace
 * el 90 % del tiempo, y merece un objetivo grande y en el sitio donde la vista ya está,
 * no un menú al que hay que subir.
 *
 * En los extremos se deshabilitan en vez de desaparecer: un control que se esfuma mueve
 * el resto de la interfaz y deja al visitante buscando lo que acaba de pulsar.
 */
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
