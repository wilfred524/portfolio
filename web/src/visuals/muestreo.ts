import type { Punto } from './ParticleEngine';
import { LADO_VB } from './piezas';

export interface Nube {
  contorno: Punto[];
  relleno: Punto[];
}

const cache = new Map<string, Nube>();

/**
 * Convierte una figura en la nube de puntos que las partículas van a ocupar.
 *
 * Se rasteriza con `Path2D` en un lienzo fuera de pantalla y se recorre el buffer a
 * pasos fijos. `Path2D` y no un SVG cargado como imagen: eso último es asíncrono y
 * arrastra el riesgo de contaminar el lienzo.
 *
 * El reparto entre contorno y relleno es lo que decide si la forma se lee. Un muestreo
 * uniforme reparte los puntos por área y deja el contorno con cuatro, que es donde vive
 * la forma: el resultado es una mancha. Aquí el contorno va primero.
 */
export function muestrear(d: string, lado = 240, paso = 6): Nube {
  const clave = `${d.length}:${d.slice(0, 24)}:${lado}:${paso}`;
  const guardado = cache.get(clave);
  if (guardado) return guardado;

  const vacia: Nube = { contorno: [], relleno: [] };
  const lienzo = document.createElement('canvas');
  lienzo.width = lado;
  lienzo.height = lado;
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  if (!ctx) return vacia;

  ctx.scale(lado / LADO_VB, lado / LADO_VB);
  ctx.fillStyle = '#fff';
  ctx.fill(new Path2D(d), 'evenodd');

  const { data } = ctx.getImageData(0, 0, lado, lado);
  const opaco = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= lado || y >= lado) return false;
    return data[(y * lado + x) * 4 + 3] > 128;
  };

  const contorno: Punto[] = [];
  const relleno: Punto[] = [];

  for (let y = 0; y < lado; y += paso) {
    for (let x = 0; x < lado; x += paso) {
      if (!opaco(x, y)) continue;
      const borde =
        !opaco(x - paso, y) || !opaco(x + paso, y) || !opaco(x, y - paso) || !opaco(x, y + paso);
      const punto = { x: x / lado, y: y / lado };
      (borde ? contorno : relleno).push(punto);
    }
  }

  const nube = { contorno, relleno };
  cache.set(clave, nube);
  return nube;
}

/**
 * Lleva la nube a un rectángulo de la pantalla, con siete de cada diez puntos en el
 * contorno. Repartirlos por área deja el borde con un puñado y la figura se ve como una
 * mancha: la forma vive en el contorno, no en el relleno.
 */
export function situar(nube: Nube, caja: DOMRect, cuantos: number): Punto[] {
  const total = nube.contorno.length + nube.relleno.length;
  if (total === 0) return [];

  const deseados = Math.min(cuantos, total);
  const enContorno = Math.min(nube.contorno.length, Math.round(deseados * 0.7));
  const enRelleno = Math.min(nube.relleno.length, deseados - enContorno);

  const salida: Punto[] = [];
  const tomar = (origen: Punto[], cantidad: number) => {
    for (let i = 0; i < cantidad; i++) {
      const p = origen[Math.floor((i * origen.length) / cantidad)];
      salida.push({ x: caja.left + p.x * caja.width, y: caja.top + p.y * caja.height });
    }
  };

  tomar(nube.contorno, enContorno);
  tomar(nube.relleno, enRelleno);
  return salida;
}
