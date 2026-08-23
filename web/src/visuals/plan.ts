import type { Figura } from '../ui/CampoParticulas';
import { puntosDeTexto } from './muestreo';
import type { Punto } from './ParticleEngine';

export interface PiezaPlanificada {
  id: string;
  cuantas: number;
  destinos: Punto[];
  /** Si cede, el rótulo aparece debajo y la nube se apaga. */
  cede: boolean;
}

export interface PlanVista {
  piezas: PiezaPlanificada[];
  /** Suma de todas: es el volumen que la transición va a mover. */
  total: number;
}

/** Margen de destinos de más que se calculan, por si a una pieza le tocan más de las previstas. */
const HOLGURA = 0.6;

/**
 * Mide el rótulo del plano y decide cuánta materia se lleva.
 *
 * Un rótulo corto no se lleva toda la que hay: pasado un tope por glifo la letra deja de
 * dibujarse y se rellena, y lo que se ve es una mancha maciza. Lo que no se usa se queda
 * girando en el disco.
 */
export function planificarVista(figuras: Figura[], materia: number): PlanVista {
  if (figuras.length === 0) return { piezas: [], total: 0 };

  // **La materia es constante**: no se calcula cuánta necesita cada vista, se reparte la
  // que hay. Así el volumen en pantalla es el mismo en todos los planos, que es lo que
  // hace que la interacción se sienta pareja en vez de dar saltos de densidad.
  const pesos = figuras.map(pesoDe);
  const suma = pesos.reduce((a, p) => a + p, 0) || 1;

  const piezas = figuras.map((figura, i) => {
    // Un tope por glifo: pasado ese punto la letra deja de dibujarse y se rellena, y lo
    // que se ve es una mancha maciza en vez de una forma.
    const cuota = Math.max(24, Math.min(pesos[i] * 70, Math.round((materia * pesos[i]) / suma)));
    return planificarRotulo(figura, cuota);
  });

  return { piezas, total: piezas.reduce((a, p) => a + p.cuantas, 0) };
}

/**
 * Cuánta materia pide una pieza en relación con las demás. No es un número absoluto: solo
 * sirve para repartir. Un rótulo largo pesa más que uno de dos cifras.
 */
function pesoDe(figura: Figura): number {
  const el = document.querySelector<HTMLElement>(`[data-figura="${figura.id}"]`);
  // Sin espacios: no hay nada que dibujar en ellos.
  const largo = (el?.textContent ?? '').replace(/\s/g, '').length || 2;
  return largo;
}

/** El rótulo del plano: lo único que forman las estrellas. */
function planificarRotulo(figura: Figura, cuota: number): PiezaPlanificada {
  const el = document.querySelector<HTMLElement>(`[data-figura="${figura.id}"]`);
  if (!el) return { id: figura.id, cuantas: 0, destinos: [], cede: true };

  const destinos = puntosDeTexto(el, Math.round(cuota * (1 + HOLGURA)));
  return { id: figura.id, cuantas: Math.min(cuota, destinos.length), destinos, cede: true };
}
