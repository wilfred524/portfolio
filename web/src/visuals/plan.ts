import type { Figura } from '../ui/CampoParticulas';
import { muestrear, puntosNecesarios, situar } from './muestreo';
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
/** Separación entre estrellas dentro de un renglón, y entre renglones. */
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

  // Más materia por figura: con el enjambre único la demanda instantánea es la de una
  // sola pieza, no la suma del plano, así que se puede dibujar mucho más definida.
  const min = movil ? 70 : 120;
  const max = movil ? 130 : 240;

  const techo = Math.max(60, Math.round(disponibles * TECHO));
  const base = figuras.map((figura) =>
    figura.tipo === 'texto'
      ? planificarTexto(figura, Math.round(techo / figuras.length))
      : planificarPieza(figura, min, max),
  );

  const necesario = base.reduce((a, p) => a + p.cuantas, 0) || 1;

  // Si vienen más partículas de las que pide la vista, no se apaga ninguna: las figuras
  // se dibujan más densas, hasta cierto punto.
  const extra = Math.min(Math.max(0, disponibles - necesario), Math.round(necesario * HOLGURA));

  const piezas = base.map((p) => {
    const parte = extra > 0 ? Math.round((extra * p.cuantas) / necesario) : 0;
    const cuantas = Math.min(p.destinos.length, p.cuantas + parte);
    return { id: p.id, cede: p.cede, cuantas, destinos: p.destinos.slice(0, cuantas) };
  });

  return { piezas, total: piezas.reduce((a, p) => a + p.cuantas, 0) };
}

function planificarPieza(figura: Figura, min: number, max: number): PiezaPlanificada {
  const caja = cajaDe(`[data-figura="${figura.id}"]`);
  const nube = muestrear(figura.d ?? '');
  const cuantas = caja ? puntosNecesarios(nube, caja, min, max) : min;
  const destinos = caja ? situar(nube, caja, Math.round(cuantas * (1 + HOLGURA))) : [];
  return { id: figura.id, cuantas, destinos, cede: true };
}

/**
 * Los planos sin proyectos no llevan una figura geométrica: las estrellas **ocupan los
 * propios bloques de texto**, en renglones, y ceden cuando las palabras aparecen encima.
 *
 * Una forma abstracta en el centro no se acoplaba a nada de lo que había alrededor; esto
 * hace que la constelación sea literalmente el texto antes de ser texto.
 */
function planificarTexto(figura: Figura, techo: number): PiezaPlanificada {
  const bloques = Array.from(document.querySelectorAll('.plano.is-activo [data-texto]'));
  const todos: Punto[] = [];

  for (const bloque of bloques) {
    const caja = bloque.getBoundingClientRect();
    if (caja.width < 8 || caja.height < 8) continue;

    const renglones = Math.max(1, Math.round(caja.height / ALTO_RENGLON));
    for (let r = 0; r < renglones; r++) {
      // El último renglón se corta, como el de un párrafo real.
      const ancho = r === renglones - 1 && renglones > 1 ? caja.width * 0.62 : caja.width;
      const cuantos = Math.max(2, Math.round(ancho / PASO_TEXTO));
      const y = caja.top + ((r + 0.5) * caja.height) / renglones;
      for (let i = 0; i < cuantos; i++) {
        todos.push({ x: caja.left + (i / Math.max(1, cuantos - 1)) * ancho, y });
      }
    }
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
