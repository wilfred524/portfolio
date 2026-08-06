import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../../i18n/LanguageProvider';
import { Chat } from './Chat';

/**
 * Envoltorio flotante del chat: botón abajo a la derecha, panel y bocadillo de
 * invitación. `Chat` no sabe que flota; aquí solo se decide cuándo se ve.
 *
 * POR QUÉ NO ES MODAL:
 * El chat es accesorio. Mientras el agente responde, el visitante debe poder seguir
 * leyendo, copiar el correo o usar la navegación. Atrapar el foco convertiría una
 * conversación opcional en un secuestro de la página, así que no hay trampa de foco, ni
 * `inert` sobre el resto, ni cierre al hacer clic fuera: querer seleccionar un texto no
 * puede cerrarte la conversación.
 *
 * POR QUÉ SE OCULTA Y NO SE DESMONTA:
 * Desmontar `Chat` al cerrar destruiría los mensajes y dispararía su limpieza, que aborta
 * la petición en curso. Quien cierra el panel a mitad de una respuesta y lo vuelve a
 * abrir debe encontrarla entera.
 */

// Se recuerda entre visitas que el bocadillo ya cumplió su función. Mismo prefijo que
// `wm.lang`, la clave que ya usa el selector de idioma.
const CLAVE_INVITACION = 'wm.chat.hint';

// El bocadillo entra después del botón para que no salten a la vez, que es lo que hace
// que un chat parezca un anuncio.
const RETARDO_INVITACION = 1200;

export function ChatWidget({ visible }: { visible: boolean }) {
  const { chat } = useContent().ui;

  const [abierto, setAbierto] = useState(false);
  // Montaje perezoso: nadie paga el chat hasta que lo abre. A partir de ahí se queda.
  const [montado, setMontado] = useState(false);
  const [invitacion, setInvitacion] = useState(false);

  const lanzadorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || abierto) return;
    if (localStorage.getItem(CLAVE_INVITACION) === 'off') return;

    const id = setTimeout(() => setInvitacion(true), RETARDO_INVITACION);
    return () => clearTimeout(id);
  }, [visible, abierto]);

  // El foco entra al campo de texto, que es lo que se espera al abrir un chat. Va en un
  // efecto y no en el `onClick` porque en la primera apertura el campo todavía no existe:
  // se monta en este mismo render.
  useEffect(() => {
    if (!abierto) return;
    const campo = document.getElementById('henry-chat-input');
    (campo ?? panelRef.current)?.focus();
  }, [abierto, montado]);

  function descartarInvitacion() {
    setInvitacion(false);
    localStorage.setItem(CLAVE_INVITACION, 'off');
  }

  function abrir() {
    setMontado(true);
    setAbierto(true);
    descartarInvitacion();
  }

  function cerrar() {
    // Solo se devuelve el foco si estaba dentro del panel. Si cerró con el ratón mientras
    // leía otra cosa, quitarle el foco de donde está es peor que no devolverlo.
    const veniaDeDentro = panelRef.current?.contains(document.activeElement);
    setAbierto(false);
    if (veniaDeDentro) lanzadorRef.current?.focus();
  }

  if (!visible) return null;

  return (
    <div className="henry-chatwidget">
      <div
        ref={panelRef}
        id="henry-chatwidget-panel"
        className="henry-chatwidget__panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="henry-chat-titulo"
        tabIndex={-1}
        hidden={!abierto}
        // El Escape se escucha en el panel y no en toda la ventana: al no ser modal, no
        // le corresponde interceptar la tecla del resto de la página.
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            cerrar();
          }
        }}
      >
        <button
          type="button"
          className="henry-chatwidget__close"
          onClick={cerrar}
          aria-label={chat.closeLabel}
        >
          ✕
        </button>
        {montado && <Chat />}
      </div>

      {invitacion && !abierto && (
        <div id="henry-chatwidget-hint" className="henry-chatwidget__hint">
          <span>{chat.invite}</span>
          <button
            type="button"
            className="henry-chatwidget__hint-close"
            onClick={descartarInvitacion}
            aria-label={chat.inviteDismiss}
          >
            ✕
          </button>
        </div>
      )}

      <button
        ref={lanzadorRef}
        type="button"
        className="henry-chatwidget__launcher"
        aria-expanded={abierto}
        aria-controls="henry-chatwidget-panel"
        aria-describedby={invitacion && !abierto ? 'henry-chatwidget-hint' : undefined}
        onClick={() => (abierto ? cerrar() : abrir())}
      >
        {chat.launcher}
      </button>
    </div>
  );
}
