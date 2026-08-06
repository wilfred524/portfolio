import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, Slot } from '@portfolio/shared';
import { useContent } from '../../../i18n/LanguageProvider';
import { api } from '../../../lib/api';

/**
 * Chat del agente. Vive dentro del panel flotante (`ChatWidget`), del que no sabe nada:
 * aquí solo se pinta la conversación.
 *
 * Deliberadamente delgado: pinta mensajes y consume el flujo, nada más. Toda la lógica
 * —qué sabe el agente, cuándo ofrece una llamada, qué se registra— vive en Python. Si
 * este componente crece, es que algo se ha colado en el lado equivocado.
 *
 * Los huecos de agenda que envía el backend se guardan tal cual y se devuelven en la
 * siguiente petición: el servidor no tiene memoria entre invocaciones y necesita saber a
 * qué instante se refería «h2» cuando el visitante lo confirma.
 */
export function Chat() {
  const { ui } = useContent();
  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [entrada, setEntrada] = useState('');
  const [parcial, setParcial] = useState('');
  const [enCurso, setEnCurso] = useState(false);
  const [error, setError] = useState('');
  const huecos = useRef<Slot[]>([]);
  const abortar = useRef<AbortController | null>(null);

  // Al desmontar (cambio de idioma incluido) se corta el flujo abierto: sin esto, React
  // seguiría recibiendo trozos para un componente que ya no existe.
  useEffect(() => () => abortar.current?.abort(), []);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const texto = entrada.trim();
    if (!texto || enCurso) return;

    const historial: ChatMessage[] = [...mensajes, { role: 'user', content: texto }];
    setMensajes(historial);
    setEntrada('');
    setError('');
    setEnCurso(true);

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
      // El mensaje del backend es más útil que uno genérico: distingue «demasiados
      // mensajes» de «el chat no está disponible». Si no llega ninguno, se usa el copy.
      setError(fallo instanceof Error && fallo.message ? fallo.message : ui.chat.error);
    } finally {
      if (respuesta) setMensajes([...historial, { role: 'assistant', content: respuesta }]);
      setParcial('');
      setEnCurso(false);
      abortar.current = null;
    }
  }

  return (
    <div className="henry-chat">
      {/* h2 y no h3: ya no cuelga del encabezado de Contacto, y hace de nombre accesible
          del panel (`aria-labelledby`). */}
      <h2 id="henry-chat-titulo" className="henry-chat__title">
        {ui.chat.title}
      </h2>

      {/* La intro solo mientras no hay conversación: en un panel estrecho, dejarla fija
          se come el espacio de lo que de verdad importa. */}
      {mensajes.length === 0 && <p className="henry-chat__intro">{ui.chat.intro}</p>}

      {/* aria-live: el lector de pantalla anuncia cada respuesta según se completa. */}
      <div
        className="henry-chat__log"
        role="log"
        aria-label={ui.chat.logLabel}
        aria-live="polite"
        aria-busy={enCurso}
      >
        {mensajes.map((mensaje, indice) => (
          <p
            key={`${indice}-${mensaje.role}`}
            className={`henry-chat__msg henry-chat__msg--${mensaje.role}`}
          >
            {mensaje.content}
          </p>
        ))}

        {parcial && <p className="henry-chat__msg henry-chat__msg--assistant">{parcial}</p>}

        {enCurso && !parcial && (
          <p className="henry-chat__msg henry-chat__msg--pending">{ui.chat.thinking}…</p>
        )}

        {error && (
          <p className="henry-chat__msg henry-chat__msg--error" role="alert">
            {error}
          </p>
        )}
      </div>

      <form className="henry-chat__form" onSubmit={enviar}>
        <label className="henry-sr-only" htmlFor="henry-chat-input">
          {ui.chat.placeholder}
        </label>
        <input
          id="henry-chat-input"
          className="henry-chat__input"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={ui.chat.placeholder}
          // Mismo techo que aplica el backend: mejor que el campo no deje escribir de más
          // a que la petición vuelva rechazada.
          maxLength={1200}
          autoComplete="off"
          disabled={enCurso}
        />
        <button className="henry-linkbtn henry-chat__send" type="submit" disabled={enCurso}>
          {enCurso ? ui.chat.thinking : ui.chat.send} →
        </button>
      </form>

      <p className="henry-meta henry-chat__disclaimer">{ui.chat.disclaimer}</p>
    </div>
  );
}
