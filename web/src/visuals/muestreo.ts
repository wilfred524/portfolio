import type { Punto } from './ParticleEngine';
import { LADO_VB } from './piezas';

const cache = new Map<string, Punto[]>();

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
export function muestrear(d: string, lado = 240, paso = 6): Punto[] {
  const clave = `${d.length}:${d.slice(0, 24)}:${lado}:${paso}`;
  const guardado = cache.get(clave);
  if (guardado) return guardado;

  const lienzo = document.createElement('canvas');
  lienzo.width = lado;
  lienzo.height = lado;
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

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

  const puntos = [...contorno, ...relleno];
  cache.set(clave, puntos);
  return puntos;
}

/** Lleva los puntos normalizados a un rectángulo de la pantalla. */
export function situar(puntos: Punto[], caja: DOMRect, cuantos: number): Punto[] {
  if (puntos.length === 0) return [];
  const salida: Punto[] = [];
  for (let i = 0; i < cuantos; i++) {
    const p = puntos[Math.floor((i * puntos.length) / cuantos)];
    salida.push({ x: caja.left + p.x * caja.width, y: caja.top + p.y * caja.height });
  }
  return salida;
}
