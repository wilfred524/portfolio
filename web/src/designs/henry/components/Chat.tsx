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
/**
 * Quita los marcadores de Markdown que el modelo escribe de todas formas.
 *
 * El contexto le pide texto corrido, sin negritas ni encabezados, y aun así los cuela:
 * un modelo entrenado con Markdown lo produce por inercia. Como el chat pinta texto
 * plano, esos `**` se leían tal cual en pantalla.
 *
 * Se limpia al pintar y no al recibir: durante el streaming, un `**` puede llegar partido
 * entre dos trozos, y aquí siempre se trabaja sobre el texto ya acumulado.
 */
function sinMarcas(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/gs, '$1') // **negrita**
    .replace(/(^|[\s(])\*(\S.*?\S|\S)\*(?=[\s).,;:!?]|$)/gs, '$1$2') // *cursiva*
    .replace(/`([^`]+)`/g, '$1') // `código`
    .replace(/^#{1,6}\s+/gm, ''); // ## encabezados
}

export function Chat() {
  const { ui } = useContent();
  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [entrada, setEntrada] = useState('');
  const [parcial, setParcial] = useState('');
  const [enCurso, setEnCurso] = useState(false);
  const [error, setError] = useState('');
  const huecos = useRef<Slot[]>([]);
  const abortar = useRef<AbortController | null>(null);
  const hilo = useRef<HTMLDivElement>(null);
  // Si el visitante ha subido a releer algo, no se le arrastra de vuelta abajo.
  const siguiendo = useRef(true);

  // Al desmontar (cambio de idioma incluido) se corta el flujo abierto: sin esto, React
  // seguiría recibiendo trozos para un componente que ya no existe.
  useEffect(() => () => abortar.current?.abort(), []);

  /**
   * El hilo baja solo mientras el agente escribe.
   *
   * Sin esto, la respuesta crecía fuera de la vista: quien acababa de preguntar se
   * quedaba mirando su propio mensaje, sin saber que abajo ya le estaban contestando.
   *
   * Salto instantáneo y no suave: con un texto que llega token a token, cada animación
   * arrancaría antes de que termine la anterior y el hilo temblaría. Y `scrollTop` no
   * anima, así que respeta `prefers-reduced-motion` por construcción.
   */
  useEffect(() => {
    const el = hilo.current;
    if (el && siguiendo.current) el.scrollTop = el.scrollHeight;
  }, [mensajes, parcial, enCurso, error]);

  function alDesplazar() {
    const el = hilo.current;
    if (!el) return;
    // Margen de holgura: pegado al fondo casi nunca es exacto, y con una línea a medio
    // renderizar la cuenta se queda corta por unos píxeles.
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
    // Acaba de preguntar: quiere ver la respuesta, aunque antes hubiera subido a releer.
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

      {/* aria-live: el lector de pantalla anuncia cada respuesta cuando está COMPLETA.
          Mientras dura el streaming se apaga: el texto parcial se reescribe en cada
          fragmento que llega, y con `polite` el lector intentaba anunciar la misma
          respuesta decenas de veces mientras se escribía. `aria-busy` ya comunica que
          hay algo en curso. */}
      <div
        ref={hilo}
        onScroll={alDesplazar}
        className="henry-chat__log"
        role="log"
        aria-label={ui.chat.logLabel}
        aria-live={enCurso ? 'off' : 'polite'}
        aria-busy={enCurso}
      >
        {mensajes.map((mensaje, indice) => (
          <p
            key={`${indice}-${mensaje.role}`}
            className={`henry-chat__msg henry-chat__msg--${mensaje.role}`}
          >
            {mensaje.role === 'assistant' ? sinMarcas(mensaje.content) : mensaje.content}
          </p>
        ))}

        {parcial && (
          <p className="henry-chat__msg henry-chat__msg--assistant">{sinMarcas(parcial)}</p>
        )}

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
