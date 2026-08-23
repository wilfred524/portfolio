import type { Figura } from '../ui/CampoParticulas';
import { puntosDeConstelacion, puntosDeTexto, puntosNecesarios } from './muestreo';
import { CONSTELACIONES } from './piezas';
import type { Punto } from './ParticleEngine';

export interface PiezaPlanificada {
  id: string;
  cuantas: number;
  destinos: Punto[];
  /** Si cede, el trazo o el texto aparecen debajo y la nube se apaga. */
  cede: boolean;
}

export interface PlanVista {
  piezas: PiezaPlanificada[];
  /** Suma de todas: es el volumen que la transición va a mover. */
  total: number;
}

/** Densidad máxima a la que se puede espesar una figura al repartirle sobrantes. */
const HOLGURA = 0.6;
/** Parte del campo que puede llevarse una figura de texto. El resto sigue siendo cielo. */
const TECHO = 0.5;
const PASO_TEXTO = 9;
const ALTO_RENGLON = 13;

/**
 * Calcula la vista entera de una vez: mide todas las cajas en un solo bloque, decide
 * cuántas partículas lleva cada figura y reparte lo que sobre.
 *
 * De una vez y no figura a figura: medir el DOM en mitad de la animación obliga al
 * navegador a recalcular la disposición en cada paso, y así se conoce el volumen del
 * plano antes de empezar a moverlo.
 */
export function planificarVista(figuras: Figura[], disponibles: number, movil: boolean): PlanVista {
  if (figuras.length === 0) return { piezas: [], total: 0 };

  // Con el enjambre único, la demanda instantánea es la de una sola pieza y no la suma
  // del plano, así que se pueden dibujar mucho más definidas.
  const min = movil ? 70 : 120;
  const max = movil ? 130 : 240;
  const techo = Math.max(60, Math.round(disponibles * TECHO));

  const base = figuras.map((figura) =>
    figura.tipo === 'texto'
      ? planificarTexto(figura, Math.round(techo / figuras.length))
      : planificarPieza(figura, min, max),
  );

  const necesario = base.reduce((a, p) => a + p.cuantas, 0) || 1;
  const extra = Math.min(Math.max(0, disponibles - necesario), Math.round(necesario * HOLGURA));

  const piezas = base.map((p) => {
    const parte = extra > 0 ? Math.round((extra * p.cuantas) / necesario) : 0;
    const cuantas = Math.min(p.destinos.length, p.cuantas + parte);
    return { id: p.id, cede: p.cede, cuantas, destinos: p.destinos.slice(0, cuantas) };
  });

  return { piezas, total: piezas.reduce((a, p) => a + p.cuantas, 0) };
}

function planificarPieza(figura: Figura, min: number, max: number): PiezaPlanificada {
  const constelacion = CONSTELACIONES[figura.id];
  const caja = cajaDe(`[data-figura="${figura.id}"]`);
  if (!constelacion || !caja) return { id: figura.id, cuantas: min, destinos: [], cede: true };

  const cuantas = puntosNecesarios(constelacion, caja, min, max);
  const destinos = puntosDeConstelacion(constelacion, caja, Math.round(cuantas * (1 + HOLGURA)));
  return { id: figura.id, cuantas, destinos, cede: true };
}

/**
 * Los planos sin proyectos no llevan objeto: las estrellas ocupan los propios bloques de
 * texto, en renglones, y ceden cuando las palabras aparecen encima.
 */
function planificarTexto(figura: Figura, techo: number): PiezaPlanificada {
  const bloques = Array.from(document.querySelectorAll('.plano.is-activo [data-texto]'));
  const todos: Punto[] = [];

  for (const bloque of bloques) {
    const caja = bloque.getBoundingClientRect();
    if (caja.width < 8 || caja.height < 8) continue;
    todos.push(...puntosDeTexto(caja, ALTO_RENGLON, PASO_TEXTO));
  }

  // Un plano lleno de párrafos pide más renglones de los que el campo puede dar sin
  // vaciarse. Se toman repartidos por todos los bloques, no los primeros.
  const cuantas = Math.min(todos.length, techo);
  const salto = Math.max(1, todos.length / Math.max(1, cuantas));
  const destinos: Punto[] = [];
  for (let i = 0; destinos.length < cuantas && Math.floor(i) < todos.length; i += salto) {
    destinos.push(todos[Math.floor(i)]);
  }

  return { id: figura.id, cuantas: destinos.length, destinos, cede: true };
}

function cajaDe(selector: string): DOMRect | undefined {
  return document.querySelector(selector)?.getBoundingClientRect();
}
