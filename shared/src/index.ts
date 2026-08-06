/**
 * Contratos de la API compartidos entre web y api.
 * Toda comunicación frontend↔backend se tipa aquí: el frontend importa estos tipos
 * en su cliente HTTP (`web/src/lib/api.ts`).
 *
 * Desde que el backend pasó a Python, estos tipos ya no los importa el servidor: son un
 * contrato acordado, no compartido. Al cambiar algo aquí hay que cambiarlo también en
 * `api/_lib/modelos.py`, porque ningún compilador va a avisar.
 */

export interface HealthResponse {
  status: 'ok';
  service: 'portfolio-api';
  timestamp: string;
}

/** Envoltorio estándar de error de la API. */
export interface ApiError {
  error: string;
}

/* ── Chat ───────────────────────────────────────────────────────────────── */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Horario ofrecido para una llamada.
 *
 * Viaja al navegador y vuelve en la siguiente petición: al confirmar hay que saber a qué
 * instante exacto se refería «h2», y entre un turno y el siguiente la disponibilidad
 * puede cambiar. El backend no se fía de lo que vuelve — lo revalida contra el calendario
 * antes de crear nada.
 */
export interface Slot {
  id: string;
  /** ISO 8601 con zona. */
  inicio: string;
  fin: string;
  /** Ya redactado en español, listo para mostrarse. */
  etiqueta: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  offered_slots: Slot[];
}

/**
 * Cada evento del flujo SSE que devuelve `POST /api/chat`.
 * `text` llega muchas veces (un fragmento cada vez); `done` cierra el turno.
 */
export type ChatChunk =
  | { type: 'text'; value: string }
  | { type: 'slots'; value: Slot[] }
  | { type: 'error'; value: string }
  | { type: 'done' };
