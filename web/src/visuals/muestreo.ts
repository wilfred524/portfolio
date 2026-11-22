import type { Punto } from './ParticleEngine';

const cache = new Map<string, Punto[]>();
const TOPE_CACHE = 48;

let medidor: CanvasRenderingContext2D | null = null;
let taller: CanvasRenderingContext2D | null = null;

function contexto(guardado: CanvasRenderingContext2D | null, leerMucho: boolean) {
  if (guardado) return guardado;
  return document
    .createElement('canvas')
    .getContext('2d', leerMucho ? { willReadFrequently: true } : undefined);
}

interface Renglon {
  texto: string;
  left: number;
  top: number;
  ancho: number;
  alto: number;
}

interface Fuente {
  css: string;
  espaciado: number;
  tam: number;
  zoom: number;
  clave: string;
}

export function puntosDeTexto(el: HTMLElement, cuantas: number): Punto[] {
  const lineas = renglones(el);
  if (lineas.length === 0 || cuantas < 4) return [];

  const estilo = getComputedStyle(el);
  const tamReal = parseFloat(estilo.fontSize) || 16;
  // Rasterizar en grande: un glifo de 20 px da tres puntos.
  const zoom = Math.max(1, 160 / tamReal);
  const espaciado = parseFloat(estilo.letterSpacing);
  const tam = tamReal * zoom;
  const fuente: Fuente = {
    css: `${estilo.fontStyle} ${estilo.fontWeight} ${tam}px ${estilo.fontFamily}`,
    espaciado: Number.isFinite(espaciado) ? espaciado * zoom : 0,
    tam,
    zoom,
    clave: `${estilo.fontWeight}|${estilo.fontFamily}|${Math.round(tamReal)}|${estilo.letterSpacing}`,
  };

  const total = lineas.reduce((a, l) => a + l.ancho, 0) || 1;
  const puntos: Punto[] = [];
  for (const linea of lineas) {
    puntos.push(...deRenglon(linea, fuente, Math.max(4, Math.round((cuantas * linea.ancho) / total))));
  }
  return puntos;
}

function renglones(el: HTMLElement): Renglon[] {
  const paseante = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const rango = document.createRange();
  const grupos: { texto: string; izq: number; der: number; arr: number; aba: number }[] = [];
  let nodo = paseante.nextNode() as Text | null;

  while (nodo) {
    for (let i = 0; i < nodo.data.length; i++) {
      rango.setStart(nodo, i);
      rango.setEnd(nodo, i + 1);
      const r = rango.getBoundingClientRect();
      if (r.height === 0) continue;

      const previo = grupos[grupos.length - 1];
      const mismo = previo && Math.abs(r.top - previo.arr) < r.height * 0.5;
      if (mismo) previo.texto += nodo.data[i];
      else grupos.push({ texto: nodo.data[i], izq: Infinity, der: -Infinity, arr: r.top, aba: r.bottom });

      if (nodo.data[i].trim() === '') continue;
      const g = grupos[grupos.length - 1];
      g.izq = Math.min(g.izq, r.left);
      g.der = Math.max(g.der, r.right);
      g.arr = Math.min(g.arr, r.top);
      g.aba = Math.max(g.aba, r.bottom);
    }
    nodo = paseante.nextNode() as Text | null;
  }

  return grupos
    .filter((g) => g.der > g.izq)
    .map((g) => ({ texto: g.texto.trim(), left: g.izq, top: g.arr, ancho: g.der - g.izq, alto: g.aba - g.arr }))
    .filter((l) => l.texto !== '' && l.ancho > 4);
}

function deRenglon(linea: Renglon, fuente: Fuente, cuantas: number): Punto[] {
  const clave = `${linea.texto}|${fuente.clave}|${cuantas}`;
  const guardado = cache.get(clave);

  medidor = contexto(medidor, false);
  if (!medidor) return [];
  medidor.font = fuente.css;
  medidor.letterSpacing = `${fuente.espaciado}px`;
  const ancho = medidor.measureText(linea.texto).width;
  if (ancho < 1) return [];

  const margen = Math.round(fuente.tam * 0.25);
  const W = Math.ceil(ancho) + margen * 2;
  const H = Math.ceil(fuente.tam * 1.4) + margen * 2;

  const escalaX = linea.ancho / (ancho || 1);
  const aPantalla = (x: number, y: number): Punto => ({
    x: linea.left + (x - margen) * escalaX,
    y: linea.top + linea.alto / 2 + (y - H / 2) / fuente.zoom,
  });

  if (guardado) return guardado.map((p) => aPantalla(p.x, p.y));

  taller = contexto(taller, true);
  if (!taller) return [];
  const ctx = taller;
  ctx.canvas.width = W;
  ctx.canvas.height = H;
  ctx.fillStyle = '#fff';
  ctx.font = fuente.css;
  // Sin esto el rasterizado sale más estrecho que el texto del DOM y las estrellas forman
  // una palabra apretada que no coincide con la que aparece debajo.
  ctx.letterSpacing = `${fuente.espaciado}px`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(linea.texto, margen, H / 2);
  const mapa = ctx.getImageData(0, 0, W, H).data;

  const opaco = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < W && y < H && mapa[(y * W + x) * 4 + 3] > 128;

  let paso = Math.max(3, Math.round(Math.sqrt((ancho * fuente.tam * 0.3) / cuantas)));
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

  if (cache.size >= TOPE_CACHE) cache.delete(cache.keys().next().value!);
  cache.set(clave, crudos);
  return crudos.map((p) => aPantalla(p.x, p.y));
}
