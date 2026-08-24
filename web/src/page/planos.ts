import type { UiStrings } from '../content';

export interface Plano {
  id: string;
  nombre: keyof UiStrings['planes'];
  proyectos?: string[];
}

export const PLANOS: Plano[] = [
  { id: 'start', nombre: 'threshold' },
  { id: 'context', nombre: 'context' },
  { id: 'data', nombre: 'data', proyectos: ['rules-engine', 'scoring', 'query-optimization'] },
  {
    id: 'platform',
    nombre: 'platform',
    proyectos: ['esignature', 'access-control', 'layered-migration', 'infrastructure'],
  },
  { id: 'own', nombre: 'own', proyectos: ['video-cli', 'portfolio-site'] },
  { id: 'stack', nombre: 'stack' },
  { id: 'contact', nombre: 'contact' },
];

export function planoDesdeHash(hash: string): number {
  const id = hash.replace(/^#\/?/, '').split('/')[0];
  const indice = PLANOS.findIndex((p) => p.id === id);
  return indice === -1 ? 0 : indice;
}
