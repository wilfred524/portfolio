/**
 * Las figuras del observatorio, en geometría paramétrica.
 *
 * Cada figura se define una sola vez y de aquí salen las dos cosas: los puntos que las
 * partículas ocupan al converger, y el `<path>` del SVG que queda después. Es lo que hace
 * que el relevo entre ambos no se note.
 *
 * Reglas de dibujo, impuestas por el muestreo:
 *  - Solo relleno. Un trazo fino desaparece al muestrear.
 *  - Rasgo mínimo de 8 unidades sobre 100, y hueco interior mínimo de 12.
 *  - Nada de texto: un glifo legible cuesta más puntos de los que hay.
 */

const VB = 100;

function rect(x: number, y: number, w: number, h: number) {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
}

function circulo(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`;
}

function rejilla(x: number, y: number, w: number, h: number, cols: number, filas: number) {
  const hueco = 4;
  const cw = (w - hueco * (cols - 1)) / cols;
  const ch = (h - hueco * (filas - 1)) / filas;
  let d = '';
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < cols; c++) {
      d += rect(x + c * (cw + hueco), y + f * (ch + hueco), cw, ch);
    }
  }
  return d;
}

/** Barra entre dos puntos, con grosor. Cualquier «línea» de una figura es esto. */
function barra(x1: number, y1: number, x2: number, y2: number, grosor: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const largo = Math.hypot(dx, dy) || 1;
  const nx = (-dy / largo) * (grosor / 2);
  const ny = (dx / largo) * (grosor / 2);
  return `M${x1 + nx} ${y1 + ny}L${x2 + nx} ${y2 + ny}L${x2 - nx} ${y2 - ny}L${x1 - nx} ${y1 - ny}z`;
}

/**
 * Cada figura evoca la acción del proyecto. Nada de escudos ni engranajes: un escudo
 * dice «seguridad» igual que en cualquier landing y no dice nada de un árbol de permisos.
 */
export const PIEZAS: Record<string, string> = {
  // Reglas como datos frente al motor que las lee.
  'rules-engine': rejilla(6, 22, 46, 56, 2, 3) + rect(64, 30, 30, 40),

  // Extraer, procesar y cargar en bloques: la misma tanda, una y otra vez.
  scoring: rect(6, 26, 18, 48) + barra(28, 50, 44, 50, 9) + rejilla(48, 26, 46, 48, 3, 3),

  // Antes y después, a la misma escala.
  'query-optimization': rect(8, 26, 84, 16) + rect(8, 58, 26, 16),

  // Máquina de estados: un tronco, una bifurcación y dos finales.
  esignature:
    circulo(16, 50, 11) +
    barra(27, 50, 45, 50, 8) +
    circulo(56, 26, 11) +
    circulo(56, 74, 11) +
    barra(45, 50, 56, 26, 8) +
    barra(45, 50, 56, 74, 8) +
    rect(78, 18, 16, 16) +
    rect(78, 66, 16, 16),

  // Árbol de permisos: módulo, opción, subproceso.
  'access-control':
    rect(42, 6, 16, 16) +
    barra(50, 22, 22, 44, 8) +
    barra(50, 22, 78, 44, 8) +
    rect(14, 44, 16, 16) +
    rect(70, 44, 16, 16) +
    rejilla(6, 76, 88, 18, 4, 1),

  // Capas apiladas, con la de arriba desprendida.
  'layered-migration':
    rect(10, 8, 80, 16) + rect(10, 34, 80, 16) + rect(10, 56, 80, 16) + rect(10, 78, 80, 16),

  // Contenedores dentro de una máquina, con el proxy delante.
  infrastructure:
    rect(6, 20, 12, 60) + rect(28, 14, 66, 12) + rejilla(28, 34, 66, 46, 2, 2),

  // Una banda larga que se corta en piezas verticales.
  'video-cli': rect(6, 14, 88, 18) + rejilla(6, 46, 88, 48, 4, 1),

  // Frontend y backend, unidos.
  'portfolio-site': rect(8, 20, 34, 60) + barra(42, 50, 58, 50, 10) + rect(58, 20, 34, 60),
};

export const LADO_VB = VB;
