import type { Figura } from '../ui/CampoParticulas';
import { muestrear, puntosNecesarios, situar, type Nube } from './muestreo';
import type { Punto } from './ParticleEngine';

export interface PiezaPlanificada {
  id: string;
  caja: DOMRect;
  nube: Nube;
  /** Cuántas partículas le tocan, ya con el reparto de sobrantes aplicado. */
  cuantas: number;
  /** Sus destinos en coordenadas de pantalla. */
  destinos: Punto[];
  conHueco: boolean;
}

export interface PlanVista {
  piezas: PiezaPlanificada[];
  /** Suma de todas: es el volumen que la transición va a mover. */
  total: number;
}

/** Densidad máxima a la que se puede espesar una figura al repartirle sobrantes. */
const HOLGURA = 0.6;

/**
 * Calcula la vista entera de una vez: mide todas las cajas en un solo bloque, decide
 * cuántas partículas lleva cada figura y reparte lo que sobre.
 *
 * De una vez y no figura a figura: medir el DOM en mitad de la animación obliga al
 * navegador a recalcular la disposición en cada paso, y además hasta ahora era imposible
 * saber el volumen del plano antes de empezar a moverlo.
 */
export function planificarVista(figuras: Figura[], disponibles: number, movil: boolean): PlanVista {
  if (figuras.length === 0) return { piezas: [], total: 0 };

  const min = movil ? 40 : 70;
  const max = movil ? 72 : 140;
  const sinHueco = movil ? 150 : 240;

  // Primero todas las lecturas del DOM, juntas.
  const medidas = figuras.map((figura) => ({
    figura,
    caja: cajaDe(figura.id) ?? cuerpoDelPlano(),
  }));

  const base = medidas.map(({ figura, caja }) => {
    const nube = muestrear(figura.d);
    // Sin hueco la nube ES la figura definitiva: necesita densidad de imagen, no de
    // esbozo, porque no hay ningún trazo que la remate después.
    const cuantas = figura.conHueco ? puntosNecesarios(nube, caja, min, max) : sinHueco;
    return { figura, caja, nube, cuantas };
  });

  const necesario = base.reduce((a, p) => a + p.cuantas, 0);

  // Si vienen más partículas de las que pide la vista, no se apaga ninguna: las figuras
  // se dibujan más densas, hasta cierto punto.
  const sobran = Math.max(0, disponibles - necesario);
  const holgura = Math.round(necesario * HOLGURA);
  const extra = Math.min(sobran, holgura);

  const piezas: PiezaPlanificada[] = base.map((p) => {
    const parte = extra > 0 ? Math.round((extra * p.cuantas) / necesario) : 0;
    const cuantas = p.cuantas + parte;
    return {
      id: p.figura.id,
      caja: p.caja,
      nube: p.nube,
      cuantas,
      destinos: situar(p.nube, p.caja, cuantas),
      conHueco: p.figura.conHueco,
    };
  });

  return { piezas, total: piezas.reduce((a, p) => a + p.cuantas, 0) };
}

function cajaDe(id: string): DOMRect | undefined {
  return document.querySelector(`[data-figura="${id}"]`)?.getBoundingClientRect();
}

/** Caja cuadrada sobre el texto del plano activo, para las figuras sin hueco propio. */
function cuerpoDelPlano(): DOMRect {
  const cuerpo = document.querySelector('.plano.is-activo .plano__cuerpo');
  const caja = cuerpo?.getBoundingClientRect();
  const ancho = window.innerWidth;
  const alto = window.innerHeight;

  if (!caja || caja.width === 0) {
    const lado = Math.min(ancho, alto) * 0.55;
    return new DOMRect((ancho - lado) / 2, (alto - lado) / 2, lado, lado);
  }

  const lado = Math.min(caja.width, caja.height, Math.min(ancho, alto) * 0.62);
  return new DOMRect(
    caja.left + (caja.width - lado) / 2,
    caja.top + (caja.height - lado) / 2,
    lado,
    lado,
  );
}
