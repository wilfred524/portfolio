import type { UiStrings } from '../content';

/**
 * Los planos del observatorio, en orden de narración.
 *
 * Esto es **presentación, no contenido**: el reparto de proyectos vive aquí y no en
 * `profile.*.ts` a propósito. Reordenar la narración no puede obligar a tocar el archivo
 * de perfil, porque de ese archivo salen también el CV y la paridad entre idiomas: un
 * cambio de guion no debe arrastrar a las otras superficies.
 *
 * El `id` viaja en la URL (`#/2-data`), así que **es estable y en inglés en los dos
 * idiomas**: un enlace enviado en una postulación no puede romperse porque el visitante
 * cambie de idioma.
 */
export interface Plano {
  id: string;
  /** Clave del nombre visible dentro de `ui.planes`. */
  nombre: keyof UiStrings['planes'];
  /** Los proyectos que se muestran en este plano, por su `ProjectItem.id`. */
  proyectos?: string[];
}

export const PLANOS: Plano[] = [
  { id: 'start', nombre: 'threshold' },
  { id: 'context', nombre: 'context' },
  /*
   * Los nueve proyectos se reparten 3 / 4 / 2, no 3 / 3 / 3, porque el criterio es
   * temático y no aritmético: así el último plano son exactamente los dos proyectos
   * propios y no una mezcla de trabajo remunerado con trabajo propio.
   *
   * El orden dentro de cada plano es el de seniority demostrada de `docs/perfil-publico.md`.
   */
  { id: 'data', nombre: 'data', proyectos: ['rules-engine', 'scoring', 'query-optimization'] },
  {
    id: 'platform',
    nombre: 'platform',
    proyectos: ['esignature', 'access-control', 'layered-migration', 'infrastructure'],
  },
  { id: 'own', nombre: 'own', proyectos: ['video-cli', 'portfolio-site'] },
  { id: 'toolkit', nombre: 'toolkit' },
  { id: 'contact', nombre: 'contact' },
];

/** Índice del plano cuyo id viaja en el hash, o 0 si no hay ninguno o no existe. */
export function planoDesdeHash(hash: string): number {
  const id = hash.replace(/^#\/?/, '').split('/')[0];
  const indice = PLANOS.findIndex((p) => p.id === id);
  return indice === -1 ? 0 : indice;
}
