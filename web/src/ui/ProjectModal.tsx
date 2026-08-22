import { useEffect, useRef } from 'react';
import type { Employment, ProjectItem, UiStrings } from '../content';

const BLOCK_KEYS = ['problem', 'hard', 'result'] as const;

/**
 * Detalle de un proyecto.
 *
 * **Este sí es un modal de verdad**, al contrario que el chat: mientras está abierto no
 * hay nada más que leer detrás, así que atrapa el foco, bloquea el scroll del documento
 * y se cierra con Escape o pulsando el fondo. El chat es accesorio y por eso convive con
 * la página; un detalle de proyecto sustituye a la página mientras dura.
 *
 * Se monta solo cuando se abre: quien no pulsa ninguna tarjeta no paga diez detalles.
 */
export function ProjectModal({
  item,
  employment,
  ui,
  onClose,
}: {
  item: ProjectItem;
  employment?: Employment;
  ui: UiStrings;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const labels = ui.project;

  // El foco entra al panel y vuelve a su origen al cerrar. `document.activeElement` se
  // guarda ANTES de mover el foco: después ya sería el propio panel.
  useEffect(() => {
    const origen = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    return () => origen?.focus();
  }, []);

  // El documento no se desplaza por detrás del modal. Se restaura el valor anterior en
  // vez de fijar 'visible': la página podría tener otro overflow por otra razón.
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  /**
   * Trampa de foco. Con `aria-modal="true"` los lectores de pantalla ya acotan el árbol,
   * pero la tabulación del navegador no: sin esto se sale del panel hacia la página de
   * detrás, que está visualmente tapada.
   */
  function alPulsarTecla(evento: React.KeyboardEvent) {
    if (evento.key === 'Escape') {
      evento.stopPropagation();
      onClose();
      return;
    }
    if (evento.key !== 'Tab') return;

    const focusables = panel.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables || focusables.length === 0) return;

    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  return (
    // El fondo cierra al pulsarlo. No es un botón porque su contenido son los controles
    // reales del modal; para quien no usa ratón, Escape y el botón de cerrar cumplen la
    // misma función, así que no queda ninguna acción sin equivalente accesible.
    <div className="modal" onMouseDown={onClose}>
      <div
        ref={panel}
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        onKeyDown={alPulsarTecla}
        // El clic dentro del panel no debe propagarse al fondo y cerrarlo. En mousedown
        // y no en click: seleccionar texto arrastrando hasta fuera cerraría el modal.
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose}>
          {labels.close}
        </button>

        <h2 className="modal__title" id="modal-titulo">
          {item.title}
        </h2>

        {/* Empresa y periodo: en la tarjeta no caben, y sin ellos un proyecto no se
            puede situar. Los propios traen los suyos; los del contrato, los del empleo. */}
        <p className="modal__meta">
          {employment
            ? `${employment.employer} · ${employment.role} · ${employment.period}`
            : [item.role, item.period].filter(Boolean).join(' · ')}
        </p>

        {item.metrics && item.metrics.length > 0 && (
          <>
            <h3 className="label">{labels.metrics}</h3>
            <ul className="modal__metrics">
              {item.metrics.map((metric) => (
                <li key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="modal__body">
          {item.body
            ? BLOCK_KEYS.map((key) => (
                <div key={key}>
                  <h3 className="label">{ui.blocks[key]}</h3>
                  <p>{item.body![key]}</p>
                </div>
              ))
            : item.brief && <p>{item.brief}</p>}
        </div>

        <h3 className="label">{labels.stack}</h3>
        <p className="modal__stack">{item.tags.join(' · ')}</p>

        {item.url && (
          <p>
            <a className="btn" href={item.url} target="_blank" rel="noreferrer">
              {labels.visit}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
