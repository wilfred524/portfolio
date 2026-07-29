import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Registro de diseños de la colección.
 * Añadir un diseño nuevo = crear src/designs/<slug>/ (con su design.md,
 * su CSS scoped y su página) y sumar una entrada aquí.
 */

export interface DesignEntry {
  slug: string;
  name: string;
  description: string;
  year: string;
  /** Colores representativos para la tarjeta de la galería. */
  preview: { background: string; foreground: string };
  component: LazyExoticComponent<ComponentType>;
}

export const designs: DesignEntry[] = [
  {
    slug: 'henry',
    name: 'Henry',
    description:
      'Sistema editorial monocromático cálido inspirado en carteles tipográficos góticos: papel y tinta, jerarquía por escala, cero color.',
    year: '2026',
    preview: { background: '#fafafa', foreground: '#2a2722' },
    component: lazy(() => import('./henry/HenryPage')),
  },
];

export function getDesign(slug: string): DesignEntry | undefined {
  return designs.find((d) => d.slug === slug);
}
