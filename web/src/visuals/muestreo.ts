import type { Punto } from './ParticleEngine';
import { LADO_VB, type Constelacion } from './piezas';

/** Lleva un punto del lienzo de 100x100 a la caja de pantalla, sin deformarlo. */
function proyector(caja: DOMRect) {
  const escala = Math.min(caja.width, caja.height) / LADO_VB;
  const x0 = caja.left + (caja.width - LADO_VB * escala) / 2;
  const y0 = caja.top + (caja.height - LADO_VB * escala) / 2;
  return (p: [number, number]): Punto => ({ x: x0 + p[0] * escala, y: y0 + p[1] * escala });
}

/**
 * Reparte partículas sobre una constelación.
 *
 * Los nodos van primero y siempre: son los vértices del objeto y donde el SVG pinta sus
 * puntos, así que ahí la partícula y el dibujo coinciden exactamente. El resto se reparte
 * por las aristas en proporción a su longitud, para que un lado largo no quede con las
 * mismas estrellas que uno corto.
 */
export function puntosDeConstelacion(figura: Constelacion, caja: DOMRect, cuantas: number): Punto[] {
  const aPantalla = proyector(caja);
  const salida: Punto[] = figura.nodos.map(aPantalla);
  if (salida.length >= cuantas || figura.aristas.length === 0) return salida.slice(0, cuantas);

  const largos = figura.aristas.map(([a, b]) =>
    Math.hypot(figura.nodos[b][0] - figura.nodos[a][0], figura.nodos[b][1] - figura.nodos[a][1]),
  );
  const total = largos.reduce((a, l) => a + l, 0) || 1;
  const porRepartir = cuantas - salida.length;

  figura.aristas.forEach(([a, b], i) => {
    const cuantos = Math.round((porRepartir * largos[i]) / total);
    if (cuantos <= 0) return;
    const p = figura.nodos[a];
    const q = figura.nodos[b];
    for (let n = 1; n <= cuantos; n++) {
      const t = n / (cuantos + 1);
      salida.push(aPantalla([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]));
    }
  });

  return salida;
}

/**
 * Cuántas partículas necesita una constelación en una caja concreta. El criterio es la
 * separación entre estrellas a lo largo del trazo: apretadas se apelmazan y separadas
 * dejan de leerse como línea.
 */
export function puntosNecesarios(figura: Constelacion, caja: DOMRect, min = 70, max = 140): number {
  const escala = Math.min(caja.width, caja.height) / LADO_VB;
  const largo = figura.aristas.reduce(
    (a, [i, j]) =>
      a +
      Math.hypot(figura.nodos[j][0] - figura.nodos[i][0], figura.nodos[j][1] - figura.nodos[i][1]),
    0,
  );
  return Math.round(Math.max(min, Math.min(max, (largo * escala) / 8 + figura.nodos.length)));
}

/** Puntos en renglones sobre una caja de texto, para los planos que no llevan figura. */
export function puntosDeTexto(caja: DOMRect, altoRenglon: number, paso: number): Punto[] {
  const salida: Punto[] = [];
  const renglones = Math.max(1, Math.round(caja.height / altoRenglon));

  for (let r = 0; r < renglones; r++) {
    // El último renglón se corta, como el de un párrafo real.
    const ancho = r === renglones - 1 && renglones > 1 ? caja.width * 0.62 : caja.width;
    const cuantos = Math.max(2, Math.round(ancho / paso));
    const y = caja.top + ((r + 0.5) * caja.height) / renglones;
    for (let i = 0; i < cuantos; i++) {
      salida.push({ x: caja.left + (i / Math.max(1, cuantos - 1)) * ancho, y });
    }
  }

  return salida;
}
