import type { ChatChunk, ChatMessage, HealthResponse, Slot } from '@portfolio/shared';

/**
 * Cliente HTTP único del frontend.
 * TODA llamada al backend pasa por aquí, tipada con los
 * contratos de @portfolio/shared. En dev, /api se proxea
 * al backend Python (ver vite.config.ts).
 */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Envía un turno de conversación y va entregando los trozos según llegan.
 *
 * Se lee el cuerpo a mano en vez de usar `EventSource` porque este último solo sabe hacer
 * GET, y la conversación entera no cabe en una URL. El formato del flujo sigue siendo
 * SSE: líneas `data: {json}` separadas por una línea en blanco.
 */
async function chat(
  messages: ChatMessage[],
  offeredSlots: Slot[],
  onChunk: (chunk: ChatChunk) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, offered_slots: offeredSlots }),
    signal,
  });

  // Los rechazos del blindaje (429, 400, 503) llegan como JSON normal, antes de que el
  // flujo se abra: una vez enviada la primera línea del stream ya no hay estado que
  // cambiar, así que aquí todavía se puede leer el mensaje de error tal cual.
  if (!res.ok || !res.body) {
    let mensaje = `API ${res.status}`;
    try {
      const cuerpo = await res.json();
      if (cuerpo?.error) mensaje = cuerpo.error;
    } catch {
      /* la respuesta no era JSON: se queda el mensaje genérico */
    }
    throw new Error(mensaje);
  }

  const lector = res.body.getReader();
  const decodificador = new TextDecoder();
  let pendiente = '';

  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;

    pendiente += decodificador.decode(value, { stream: true });

    // Un `read()` no respeta las fronteras de los eventos: puede traer tres enteros y
    // medio. Se procesa hasta el último separador completo y el resto espera.
    const bloques = pendiente.split('\n\n');
    pendiente = bloques.pop() ?? '';

    for (const bloque of bloques) {
      const linea = bloque.trim();
      if (!linea.startsWith('data:')) continue;
      try {
        onChunk(JSON.parse(linea.slice(5)) as ChatChunk);
      } catch {
        /* un evento ilegible no debe cortar el resto del flujo */
      }
    }
  }
}

export const api = {
  health: () => request<HealthResponse>('/health'),
  chat,
};
