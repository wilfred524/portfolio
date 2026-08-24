import { useEffect, useRef } from 'react';
import type { Employment, ProjectItem, UiStrings } from '../content';

const BLOCK_KEYS = ['problem', 'hard', 'result'] as const;

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

  useEffect(() => {
    const origen = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    return () => origen?.focus();
  }, []);

  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

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
    <div className="modal" onMouseDown={onClose}>
      <div
        ref={panel}
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        onKeyDown={alPulsarTecla}
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
