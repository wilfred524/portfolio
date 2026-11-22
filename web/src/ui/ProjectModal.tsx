import { useEffect, useRef, useState } from 'react';
import type { Employment, ProjectItem, UiStrings } from '../content';
import { useLangSwitch } from '../i18n/LanguageProvider';

const BLOCK_KEYS = ['problem', 'hard', 'result'] as const;
const ANCHO_DIAGRAMA = '(min-width: 60rem)';

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
  const dialogo = useRef<HTMLDialogElement>(null);
  const cerrar = useRef(onClose);
  cerrar.current = onClose;
  const labels = ui.project;
  const { lang } = useLangSwitch();
  const [cabe, setCabe] = useState(() => window.matchMedia(ANCHO_DIAGRAMA).matches);

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    el.showModal();
    const alCerrar = () => cerrar.current();
    el.addEventListener('close', alCerrar);

    let quitarRespaldo = () => {};
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const fuera = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pulsadoFuera = false;
      const alBajar = (e: PointerEvent) => {
        pulsadoFuera = fuera(e);
      };
      const alSubir = (e: PointerEvent) => {
        if (pulsadoFuera && fuera(e)) el.close();
      };
      el.addEventListener('pointerdown', alBajar);
      el.addEventListener('pointerup', alSubir);
      quitarRespaldo = () => {
        el.removeEventListener('pointerdown', alBajar);
        el.removeEventListener('pointerup', alSubir);
      };
    }

    return () => {
      el.removeEventListener('close', alCerrar);
      quitarRespaldo();
      if (el.open) el.close();
    };
  }, []);

  useEffect(() => {
    const consulta = window.matchMedia(ANCHO_DIAGRAMA);
    const alCambiar = () => setCabe(consulta.matches);
    consulta.addEventListener('change', alCambiar);
    return () => consulta.removeEventListener('change', alCambiar);
  }, []);

  const conDiagrama = Boolean(item.diagram);

  return (
    <dialog
      ref={dialogo}
      className={conDiagrama ? 'modal__panel modal__panel--ancho' : 'modal__panel'}
      aria-labelledby="modal-titulo"
      {...{ closedby: 'any' }}
    >
      <button type="button" className="modal__close" onClick={() => dialogo.current?.close()}>
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

      {item.diagram && (
        <>
          <h3 className="label">{labels.diagram}</h3>
          {cabe ? (
            <>
              <iframe
                className="modal__diagrama"
                src={`/diagramas/${lang}/${item.diagram}?embed=1&theme=dark`}
                title={`${item.title} · ${labels.diagram}`}
                sandbox="allow-scripts allow-downloads"
                loading="lazy"
                referrerPolicy="same-origin"
              />
              <p className="modal__ayuda">{labels.diagramHint}</p>
            </>
          ) : (
            <p>
              <a
                className="btn"
                href={`/diagramas/${lang}/${item.diagram}?theme=dark`}
                target="_blank"
                rel="noreferrer"
              >
                {labels.diagramOpen}
              </a>
            </p>
          )}
        </>
      )}

      <h3 className="label">{labels.stack}</h3>
      <p className="modal__stack">{item.tags.join(' · ')}</p>

      {item.url && (
        <p>
          <a className="btn" href={item.url} target="_blank" rel="noreferrer">
            {labels.visit}
          </a>
        </p>
      )}
    </dialog>
  );
}
