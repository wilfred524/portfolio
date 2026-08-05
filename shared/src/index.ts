/**
 * Contratos de la API compartidos entre web y api.
 * Toda comunicación frontend↔backend se tipa aquí: el frontend importa estos tipos
 * en su cliente HTTP (`web/src/lib/api.ts`).
 *
 * Desde que el backend pasó a Python, estos tipos ya no los importa el servidor: son un
 * contrato acordado, no compartido. Al cambiar algo aquí hay que cambiarlo también en
 * `api/`, porque ningún compilador va a avisar.
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
