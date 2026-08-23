import type { Punto } from './ParticleEngine';

const cache = new Map<string, Punto[]>();

/**
 * Convierte el texto de un elemento del DOM en la nube de puntos que las partículas van a
 * ocupar, **para que formen las letras de verdad**.
 *
 * Dos cosas hay que hacer bien o no sale una letra, sale una mancha:
 *
 *  - **Rasterizar en grande.** El texto se dibuja a unos 160 px de altura de fuente, no al
 *    tamaño en que se ve. Muestrear un glifo de 20 px da tres puntos por letra.
 *  - **Respetar dónde está.** La caja se mide sobre el propio texto y no sobre el
 *    elemento que lo contiene: un número centrado por la rejilla y un titular alineado a
 *    la izquierda ocupan sitios muy distintos dentro de la misma casilla.
 *
 * El paso se ajusta a las partículas que se quieran, y el contorno va primero: lo que hace
 * legible un glifo es su perfil, no su relleno.
 */
export function puntosDeTexto(el: HTMLElement, cuantas: number): Punto[] {
  const texto = (el.textContent ?? '').trim();
  const caja = cajaDelTexto(el);
  if (!texto || cuantas < 4 || !caja || caja.width < 4) return [];

  const estilo = getComputedStyle(el);
  const tamReal = parseFloat(estilo.fontSize) || 16;
  const familia = estilo.fontFamily;
  const peso = estilo.fontWeight;

  const clave = `${texto}|${peso}|${familia}|${Math.round(tamReal)}|${cuantas}`;
  const guardado = cache.get(clave);

  // Resolución de trabajo: fuente de ~160 px, que es donde un glifo tiene perfil de sobra.
  const zoom = Math.max(1, 160 / tamReal);
  const tam = tamReal * zoom;

  const medidor = document.createElement('canvas').getContext('2d');
  if (!medidor) return [];
  const fuente = `${estilo.fontStyle} ${peso} ${tam}px ${familia}`;
  medidor.font = fuente;
  const ancho = medidor.measureText(texto).width;
  if (ancho < 1) return [];

  const margen = Math.round(tam * 0.25);
  const W = Math.ceil(ancho) + margen * 2;
  const H = Math.ceil(tam * 1.4) + margen * 2;

  let mapa: Uint8ClampedArray;
  if (!guardado) {
    const lienzo = document.createElement('canvas');
    lienzo.width = W;
    lienzo.height = H;
    const ctx = lienzo.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.fillStyle = '#fff';
    ctx.font = fuente;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, margen, H / 2);
    mapa = ctx.getImageData(0, 0, W, H).data;
  } else {
    mapa = new Uint8ClampedArray();
  }

  // La caja ya es la del texto, así que empieza donde empieza.
  const izquierda = caja.left;
  const medio = caja.top + caja.height / 2;

  const aPantalla = (x: number, y: number): Punto => ({
    x: izquierda + (x - margen) / zoom,
    y: medio + (y - H / 2) / zoom,
  });

  if (guardado) {
    // La caché guarda coordenadas relativas al texto, no a la pantalla.
    return guardado.map((p) => aPantalla(p.x, p.y));
  }

  const opaco = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < W && y < H && mapa[(y * W + x) * 4 + 3] > 128;

  // Paso adaptado: se busca el que produce aproximadamente las partículas pedidas.
  let paso = Math.max(3, Math.round(Math.sqrt((ancho * tam * 0.3) / cuantas)));
  let contorno: Punto[] = [];
  let relleno: Punto[] = [];

  for (let intento = 0; intento < 5; intento++) {
    contorno = [];
    relleno = [];
    for (let y = 0; y < H; y += paso) {
      for (let x = 0; x < W; x += paso) {
        if (!opaco(x, y)) continue;
        const borde =
          !opaco(x - paso, y) || !opaco(x + paso, y) || !opaco(x, y - paso) || !opaco(x, y + paso);
        (borde ? contorno : relleno).push({ x, y });
      }
    }
    const total = contorno.length + relleno.length;
    if (total >= cuantas * 0.85 && total <= cuantas * 2.2) break;
    if (total < cuantas * 0.85 && paso <= 3) break;
    paso = Math.max(3, Math.round(paso * (total > cuantas ? 1.25 : 0.8)));
  }

  if (contorno.length === 0) return [];

  const deseados = Math.min(cuantas, contorno.length + relleno.length);
  const enContorno = Math.min(contorno.length, Math.round(deseados * 0.75));
  const enRelleno = Math.min(relleno.length, deseados - enContorno);

  const crudos: Punto[] = [];
  const tomar = (origen: Punto[], cantidad: number) => {
    for (let i = 0; i < cantidad; i++) {
      crudos.push(origen[Math.floor((i * origen.length) / cantidad)]);
    }
  };
  tomar(contorno, enContorno);
  tomar(relleno, enRelleno);

  cache.set(clave, crudos);
  return crudos.map((p) => aPantalla(p.x, p.y));
}

/**
 * La caja que ocupa el texto en pantalla, no la del elemento que lo contiene. Un `Range`
 * mide lo que de verdad se ve, sea cual sea la alineación o el tipo de contenedor.
 */
export function cajaDelTexto(el: HTMLElement): DOMRect | null {
  if (!el.firstChild) return null;
  const rango = document.createRange();
  rango.selectNodeContents(el);
  const caja = rango.getBoundingClientRect();
  return caja.width > 0 ? caja : null;
}
