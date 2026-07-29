import type { HealthResponse } from '@portfolio/shared';

/**
 * Cliente HTTP único del frontend.
 * TODA llamada al backend pasa por aquí, tipada con los
 * contratos de @portfolio/shared. En dev, /api se proxea
 * al backend Express (ver vite.config.ts).
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

export const api = {
  health: () => request<HealthResponse>('/health'),
};
