/**
 * Contratos de la API compartidos entre web y api.
 * Toda comunicación frontend↔backend se tipa aquí:
 * el frontend importa estos tipos en su cliente HTTP
 * y el backend los usa en sus handlers.
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
