/**
 * Las figuras del observatorio: objetos reconocibles dibujados como constelaciones.
 *
 * Cada una es una lista de trazos (polilíneas sobre un lienzo de 100×100). De ahí salen
 * los nodos y las aristas: las partículas se convierten en los nodos y las líneas los
 * unen, así que el relevo entre estrellas y dibujo no se nota.
 *
 * La regla al dibujar: pocos vértices y bien separados. Un objeto se reconoce por su
 * silueta, no por su detalle, y cada vértice de más es una estrella que hay que gastar.
 */

export type Trazo = { puntos: [number, number][]; cerrado?: boolean };

export interface Constelacion {
  nodos: [number, number][];
  aristas: [number, number][];
}

/** Une los vértices que caen casi encima para que compartan estrella. */
export function aConstelacion(trazos: Trazo[]): Constelacion {
  const nodos: [number, number][] = [];
  const aristas: [number, number][] = [];

  const indiceDe = (p: [number, number]) => {
    const ya = nodos.findIndex((n) => Math.hypot(n[0] - p[0], n[1] - p[1]) < 2);
    if (ya >= 0) return ya;
    nodos.push(p);
    return nodos.length - 1;
  };

  for (const trazo of trazos) {
    const indices = trazo.puntos.map(indiceDe);
    for (let i = 0; i < indices.length - 1; i++) aristas.push([indices[i], indices[i + 1]]);
    if (trazo.cerrado && indices.length > 2) {
      aristas.push([indices[indices.length - 1], indices[0]]);
    }
  }

  return { nodos, aristas };
}

const marco = (x: number, y: number, w: number, h: number): Trazo => ({
  puntos: [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
  cerrado: true,
});

const linea = (x1: number, y1: number, x2: number, y2: number): Trazo => ({
  puntos: [
    [x1, y1],
    [x2, y2],
  ],
});

/** Polígono regular: el sustituto de un círculo cuando la figura son vértices. */
const redondo = (cx: number, cy: number, r: number, lados = 8, giro = 0): Trazo => ({
  puntos: Array.from({ length: lados }, (_, i) => {
    const a = giro + (i / lados) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  }),
  cerrado: true,
});

/** Arco abierto, para ciclos y flechas curvas. */
const arco = (cx: number, cy: number, r: number, desde: number, hasta: number, pasos = 5): Trazo => ({
  puntos: Array.from({ length: pasos }, (_, i) => {
    const a = desde + ((hasta - desde) * i) / (pasos - 1);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  }),
});

const G = Math.PI / 180;

/**
 * Un objeto por proyecto, elegido para que se entienda sin leer el texto de al lado.
 */
export const PIEZAS: Record<string, Trazo[]> = {
  // Tabla de políticas con un control ajustable en cada fila: las reglas son datos.
  'rules-engine': [
    marco(14, 20, 72, 60),
    linea(14, 38, 86, 38),
    linea(14, 56, 86, 56),
    linea(30, 29, 62, 29),
    { puntos: [[62, 29]] },
    linea(30, 47, 46, 47),
    { puntos: [[46, 47]] },
    linea(30, 65, 70, 65),
    { puntos: [[70, 65]] },
  ],

  // Documento con su línea de firma y la marca de validado.
  esignature: [
    {
      puntos: [
        [24, 10],
        [62, 10],
        [76, 24],
        [76, 90],
        [24, 90],
      ],
      cerrado: true,
    },
    linea(62, 10, 62, 24),
    linea(62, 24, 76, 24),
    linea(34, 40, 66, 40),
    linea(34, 52, 58, 52),
    {
      puntos: [
        [34, 74],
        [42, 66],
        [50, 78],
        [60, 64],
        [68, 72],
      ],
    },
  ],

  // Base de datos, ciclo mensual, y los registros que salen puntuados.
  scoring: [
    redondo(30, 22, 16, 6),
    linea(14, 22, 14, 58),
    linea(46, 22, 46, 58),
    redondo(30, 58, 16, 6),
    arco(66, 50, 20, -120 * G, 150 * G, 6),
    linea(52, 36, 66, 30),
    linea(66, 30, 64, 44),
  ],

  // Cronómetro: el antes y el después de la consulta.
  'query-optimization': [
    redondo(50, 56, 30, 10),
    linea(42, 14, 58, 14),
    linea(50, 14, 50, 26),
    linea(50, 56, 50, 36),
    linea(50, 56, 68, 62),
  ],

  // Llave sobre el árbol de módulos que abre.
  'access-control': [
    redondo(26, 30, 14, 6),
    linea(36, 38, 74, 74),
    linea(74, 74, 88, 74),
    linea(64, 64, 64, 78),
    linea(74, 74, 74, 88),
    linea(12, 66, 88, 66),
    linea(30, 66, 30, 82),
    linea(50, 66, 50, 90),
  ],

  // Capas apiladas, con la de arriba desplazada: la migración en curso.
  'layered-migration': [
    {
      puntos: [
        [22, 22],
        [78, 14],
        [86, 30],
        [30, 38],
      ],
      cerrado: true,
    },
    {
      puntos: [
        [16, 46],
        [72, 40],
        [80, 56],
        [24, 62],
      ],
      cerrado: true,
    },
    {
      puntos: [
        [16, 70],
        [72, 64],
        [80, 80],
        [24, 86],
      ],
      cerrado: true,
    },
  ],

  // Contenedor sobre la máquina, con el proxy delante.
  infrastructure: [
    marco(34, 30, 52, 46),
    linea(34, 44, 86, 44),
    linea(52, 44, 52, 76),
    linea(69, 44, 69, 76),
    marco(8, 40, 16, 30),
    linea(24, 55, 34, 55),
  ],

  // Tira de película que se corta en piezas verticales.
  'video-cli': [
    marco(8, 24, 84, 30),
    linea(8, 32, 92, 32),
    linea(8, 46, 92, 46),
    linea(34, 24, 34, 54),
    linea(62, 24, 62, 54),
    marco(20, 66, 18, 28),
    marco(46, 66, 18, 28),
    marco(72, 66, 18, 28),
  ],

  // La ventana del sitio y el agente que responde dentro.
  'portfolio-site': [
    marco(10, 18, 80, 60),
    linea(10, 32, 90, 32),
    { puntos: [[20, 25]] },
    { puntos: [[30, 25]] },
    {
      puntos: [
        [26, 44],
        [62, 44],
        [62, 64],
        [38, 64],
        [30, 72],
        [30, 64],
        [26, 64],
      ],
      cerrado: true,
    },
  ],
};

/** Cada figura, ya resuelta en nodos y aristas. */
export const CONSTELACIONES: Record<string, Constelacion> = Object.fromEntries(
  Object.entries(PIEZAS).map(([id, trazos]) => [id, aConstelacion(trazos)]),
);

export const LADO_VB = 100;
