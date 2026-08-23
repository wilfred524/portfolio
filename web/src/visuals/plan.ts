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
 * Densidad de una figura. Por debajo la letra se lee granulada; por encima deja de
 * dibujarse y se rellena, y lo que queda es una mancha maciza.
 */
const POR_GLIFO = 70;
const SUELO = 24;

/**
 * Mide las figuras del plano y decide cuánta materia se lleva cada una.
 *
 * Cada una pide la densidad que necesita para leerse, y **si no cabe todo, el recorte se
 * lo lleva la más grande**, que es siempre el rótulo del plano: tiene margen de sobra por
 * glifo, mientras que a una cifra la falta de puntos se le nota enseguida. Repartir en
 * proporción, que es lo evidente, iguala las densidades y deja a las cifras granuladas.
 *
 * Lo que no se usa se queda girando en el disco: es el fondo.
 */
export function planificarVista(figuras: Figura[], materia: number): PlanVista {
  if (figuras.length === 0) return { piezas: [], total: 0 };

  const cuotas = figuras.map((f) => Math.max(SUELO, pesoDe(f) * POR_GLIFO));
  let exceso = cuotas.reduce((a, c) => a + c, 0) - materia;

  while (exceso > 0) {
    let mayor = 0;
    for (let i = 1; i < cuotas.length; i++) if (cuotas[i] > cuotas[mayor]) mayor = i;
    if (cuotas[mayor] <= SUELO) break;
    // Se le quita hasta igualar a la siguiente, no de golpe: con dos figuras largas el
    // recorte se reparte entre las dos en vez de hundir una sola.
    const siguiente = cuotas.reduce((a, c, i) => (i === mayor ? a : Math.max(a, c)), SUELO);
    const quita = Math.max(1, Math.min(exceso, cuotas[mayor] - siguiente));
    cuotas[mayor] -= quita;
    exceso -= quita;
  }

  const piezas = figuras.map((figura, i) => planificarRotulo(figura, cuotas[i]));
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

/** Una figura: el rótulo del plano, o el número de un proyecto. */
function planificarRotulo(figura: Figura, cuota: number): PiezaPlanificada {
  const el = document.querySelector<HTMLElement>(`[data-figura="${figura.id}"]`);
  if (!el) return { id: figura.id, cuantas: 0, destinos: [], cede: true };

  const destinos = puntosDeTexto(el, Math.round(cuota * (1 + HOLGURA)));
  return { id: figura.id, cuantas: Math.min(cuota, destinos.length), destinos, cede: true };
}
