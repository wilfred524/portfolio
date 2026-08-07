import { useEffect, useRef } from 'react';

/**
 * Placa halftone: toma una imagen real y la convierte por código a 1-bit con
 * dithering ordenado (matriz Bayer 8×8), recoloreada a tinta/papel. La imagen se
 * funde con la página mediante una "presencia" que se desvanece de izquierda
 * (papel puro → invisible) a derecha (retrato) y se difumina en los bordes, de modo
 * que la placa no parece un recuadro pegado sino parte del papel. Un spotlight sigue
 * el cursor. Si la imagen no carga, cae a una esfera generada (nunca se ve rota).
 * Respeta prefers-reduced-motion.
 */

const W = 224;
const H = 224; // cuadrado: menos alto, más resolución = puntos más finos
const INK: [number, number, number] = [42, 39, 34]; // #2a2722
const PAPER: [number, number, number] = [250, 250, 250]; // #fafafa

// Matriz Bayer 8×8 de dithering ordenado, normalizada a (0,1).
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function HalftonePlate({ src = '/davinci.webp' }: { src?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.6, y: 0.4, active: false });
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = W;
    canvas.height = H;
    const out = ctx.createImageData(W, H);

    const gray = new Float32Array(W * H); // brillo de la imagen [0,1]
    const presence = new Float32Array(W * H); // cuánto se muestra vs papel [0,1]

    // Presencia: desvanecido izq→der + difuminado de bordes. Solo depende de la
    // geometría, así que se calcula una vez.
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const u = x / W;
        const v = y / H;
        const fadeLeft = smoothstep(0.0, 0.6, u); // izquierda → papel (más progresivo)
        const featherRight = 1 - smoothstep(0.9, 1.0, u);
        const featherTop = smoothstep(0.0, 0.08, v);
        const featherBottom = 1 - smoothstep(0.9, 1.0, v);
        presence[y * W + x] = fadeLeft * featherRight * featherTop * featherBottom;
      }
    }

    const paint = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const p = pointer.current;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          const pr = presence[idx];
          // Funde hacia papel (1.0) según la presencia; papel == fondo de la página.
          let bright = 1 - pr * (1 - gray[idx]);
          // Spotlight: aclara alrededor del cursor, escalado por presencia.
          if (!reduce && p.active) {
            const dx = x / W - p.x;
            const dy = y / H - p.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            bright += Math.max(0, 0.22 * (1 - d / 0.3)) * pr;
          }
          const on = Math.max(0, Math.min(1, bright)) > BAYER[y & 7][x & 7];
          const c = on ? PAPER : INK;
          const i = idx * 4;
          out.data[i] = c[0];
          out.data[i + 1] = c[1];
          out.data[i + 2] = c[2];
          out.data[i + 3] = 255;
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const fillFromSphere = () => {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = (x / W) * 2 - 1;
          const ny = (y / H) * 2 - 1;
          const r2 = nx * nx + ny * ny;
          let b = 1;
          if (r2 <= 0.8 * 0.8) {
            const nz = Math.sqrt(0.8 * 0.8 - r2) / 0.8;
            b = 0.1 + 0.95 * Math.max(0, nx * 0.4 - ny * 0.35 + nz * 0.85);
          }
          gray[y * W + x] = Math.max(0, Math.min(1, b));
        }
      }
      paint();
    };

    const fillFromImage = (image: HTMLImageElement) => {
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const octx = off.getContext('2d');
      if (!octx) return fillFromSphere();
      // cover-fit con zoom leve y encuadre hacia la derecha, para que el rostro
      // caiga en la zona más presente (el fade izquierdo no se lo come).
      const scale = Math.max(W / image.width, H / image.height) * 1.15;
      const w = image.width * scale;
      const h = image.height * scale;
      octx.drawImage(image, (W - w) * 0.62, (H - h) * 0.12, w, h);
      const data = octx.getImageData(0, 0, W, H).data;
      for (let i = 0; i < W * H; i++) {
        let l =
          (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) /
          255;
        // Gamma para aclarar el fondo del grabado + contraste para definir el rostro.
        l = Math.pow(l, 0.62);
        l = (l - 0.5) * 1.3 + 0.5;
        gray[i] = Math.max(0, Math.min(1, l));
      }
      paint();
    };

    const image = new Image();
    image.onload = () => fillFromImage(image);
    image.onerror = fillFromSphere;
    image.src = src;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const schedule = () => {
      if (!raf.current) {
        raf.current = requestAnimationFrame(() => {
          raf.current = 0;
          paint();
        });
      }
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Fuera de la placa no hay foco que seguir: si el puntero está en otra parte de la
      // página, se apaga en vez de calcular un spotlight que nadie va a ver.
      const dentro =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!dentro) {
        if (!pointer.current.active) return;
        pointer.current.active = false;
        schedule();
        return;
      }
      pointer.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        active: true,
      };
      schedule();
    };
    const onLeave = () => {
      pointer.current.active = false;
      schedule();
    };

    // El listener sigue en `window` y no en el canvas —el spotlight tiene que reaccionar
    // al acercarse, no solo al entrar—, pero `onMove` descarta lo que cae fuera antes de
    // repintar. Antes, cualquier movimiento del ratón en cualquier punto de la página, con
    // el hero a cinco pantallas de distancia, recorría los 50.176 píxeles del buffer con
    // una raíz cuadrada por píxel. Durante toda la sesión.
    window.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [src]);

  return <canvas ref={canvasRef} className="henry-plate-canvas" aria-hidden="true" />;
}
