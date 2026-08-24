import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, Slot } from '@portfolio/shared';
import { useContent } from '../i18n/LanguageProvider';
import { api } from '../lib/api';

/* Se limpia al pintar y no al recibir: durante el streaming un `**` puede llegar partido
   entre dos trozos, y aquí siempre se trabaja sobre el texto ya acumulado. */
function sinMarcas(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/(^|[\s(])\*(\S.*?\S|\S)\*(?=[\s).,;:!?]|$)/gs, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '');
}

export function Chat({ enfocar }: { enfocar: boolean }) {
  const { ui } = useContent();
  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [entrada, setEntrada] = useState('');
  const [parcial, setParcial] = useState('');
  const [enCurso, setEnCurso] = useState(false);
  const [error, setError] = useState('');
  const huecos = useRef<Slot[]>([]);
  const abortar = useRef<AbortController | null>(null);
  const hilo = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const siguiendo = useRef(true);

  useEffect(() => () => abortar.current?.abort(), []);

  useEffect(() => {
    if (enfocar) campo.current?.focus();
  }, [enfocar]);

  useEffect(() => {
    const el = hilo.current;
    if (el && siguiendo.current) el.scrollTop = el.scrollHeight;
  }, [mensajes, parcial, enCurso, error]);

  function alDesplazar() {
    const el = hilo.current;
    if (!el) return;
    siguiendo.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 48;
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const texto = entrada.trim();
    if (!texto || enCurso) return;

    const historial: ChatMessage[] = [...mensajes, { role: 'user', content: texto }];
    setMensajes(historial);
    setEntrada('');
    setError('');
    setEnCurso(true);
    siguiendo.current = true;

    let respuesta = '';
    abortar.current = new AbortController();

    try {
      await api.chat(
        historial,
        huecos.current,
        (trozo) => {
          if (trozo.type === 'text') {
            respuesta += trozo.value;
            setParcial(respuesta);
          } else if (trozo.type === 'slots') {
            huecos.current = trozo.value;
          } else if (trozo.type === 'error') {
            setError(trozo.value);
          }
        },
        abortar.current.signal,
      );
    } catch (fallo) {
      setError(fallo instanceof Error && fallo.message ? fallo.message : ui.chat.error);
    } finally {
      if (respuesta) setMensajes([...historial, { role: 'assistant', content: respuesta }]);
      setParcial('');
      setEnCurso(false);
      abortar.current = null;
    }
  }

  return (
    <>
      <p className="chat__aviso">{ui.chat.disclaimer}</p>

      {/* aria-live se apaga durante el streaming: el texto parcial se reescribe en cada
          fragmento, y con `polite` el lector anuncia la misma respuesta decenas de veces. */}
      <div
        ref={hilo}
        onScroll={alDesplazar}
        className="chat__hilo"
        role="log"
        aria-label={ui.chat.logLabel}
        aria-live={enCurso ? 'off' : 'polite'}
        aria-busy={enCurso}
      >
        {mensajes.length === 0 && <p className="chat__agente">{ui.chat.intro}</p>}

        {mensajes.map((mensaje, indice) => (
          <p key={`${indice}-${mensaje.role}`} className={mensaje.role === 'assistant' ? 'chat__agente' : 'chat__visita'}>
            {mensaje.role === 'assistant' ? sinMarcas(mensaje.content) : mensaje.content}
          </p>
        ))}

        {parcial && <p className="chat__agente">{sinMarcas(parcial)}</p>}
        {enCurso && !parcial && <p className="chat__pensando">{ui.chat.thinking}…</p>}
        {error && (
          <p className="chat__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <form className="chat__entrada" onSubmit={enviar}>
        <label className="sr-only" htmlFor="chat-campo">
          {ui.chat.placeholder}
        </label>
        <input
          ref={campo}
          id="chat-campo"
          className="chat__campo"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={ui.chat.placeholder}
          /* Mismo techo que aplica el backend. */
          maxLength={1200}
          autoComplete="off"
          disabled={enCurso}
        />
        <button className="chat__enviar" type="submit" disabled={enCurso} aria-label={ui.chat.send}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </>
  );
}
