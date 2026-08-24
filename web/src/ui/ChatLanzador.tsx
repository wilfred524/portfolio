import { useEffect, useRef, useState } from 'react';
import { useContent } from '../i18n/LanguageProvider';
import { track } from '../lib/analytics';
import { Chat } from './Chat';

const CLAVE_LLAMADA = 'wm.chat-llamada';
const RETIRO = 7000;

export function ChatLanzador({ listo }: { listo: boolean }) {
  const { ui } = useContent();
  const [abierto, setAbierto] = useState(false);
  const [llamando, setLlamando] = useState(false);
  const lanzador = useRef<HTMLButtonElement>(null);
  const reloj = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!listo || abierto) return;
    if (localStorage.getItem(CLAVE_LLAMADA)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setLlamando(true);
    reloj.current = window.setTimeout(() => setLlamando(false), RETIRO);
    return () => clearTimeout(reloj.current);
  }, [listo, abierto]);

  function callar() {
    clearTimeout(reloj.current);
    setLlamando(false);
    localStorage.setItem(CLAVE_LLAMADA, 'visto');
  }

  function conmutar() {
    callar();
    setAbierto((estaba) => {
      if (!estaba) track('chat-abierto', { origen: 'lanzador' });
      return !estaba;
    });
  }

  function cerrar() {
    setAbierto(false);
    lanzador.current?.focus();
  }

  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') cerrar();
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [abierto]);

  return (
    <>
      {abierto && (
        <div className="chat" role="dialog" aria-labelledby="chat-titulo">
          <div className="chat__cab">
            <h2 className="chat__titulo" id="chat-titulo">
              {ui.chat.title}
            </h2>
            <button type="button" className="chat__cerrar" onClick={cerrar} aria-label={ui.chat.closeLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <Chat enfocar={abierto} />
        </div>
      )}

      {llamando && (
        <div className="chat__llamada">
          {ui.chat.invite}
          <button type="button" className="chat__descartar" onClick={callar}>
            {ui.chat.inviteDismiss}
          </button>
        </div>
      )}

      <button
        ref={lanzador}
        type="button"
        className={llamando ? 'lanzador is-llamando' : 'lanzador'}
        onClick={conmutar}
        aria-expanded={abierto}
      >
        {llamando && (
          <>
            <span className="lanzador__pulso" aria-hidden="true" />
            <span className="lanzador__pulso" aria-hidden="true" />
          </>
        )}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 5h16v11H9l-5 4V5z" />
        </svg>
        {ui.chat.launcher}
      </button>
    </>
  );
}
