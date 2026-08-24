import type { ChatChunk, ChatMessage, HealthResponse, Slot } from '@portfolio/shared';

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

  if (!res.ok || !res.body) {
    let mensaje = `API ${res.status}`;
    try {
      const cuerpo = await res.json();
      if (cuerpo?.error) mensaje = cuerpo.error;
    } catch {
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

    const bloques = pendiente.split('\n\n');
    pendiente = bloques.pop() ?? '';

    for (const bloque of bloques) {
      const linea = bloque.trim();
      if (!linea.startsWith('data:')) continue;
      try {
        onChunk(JSON.parse(linea.slice(5)) as ChatChunk);
      } catch {
      }
    }
  }
}

export const api = {
  health: () => request<HealthResponse>('/health'),
  chat,
};
