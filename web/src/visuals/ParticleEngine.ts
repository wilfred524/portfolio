/**
 * El campo del observatorio: una galaxia. Canvas 2D, sin librería y sin React dentro, que
 * el bucle de fotogramas no puede pasar por el estado de React.
 *
 * **Un solo sistema.** No hay cielo por un lado y materia por otro, ni partículas que
 * entren desde fuera del cuadro: todo lo que se ve pertenece al disco. Cuando una vista
 * necesita formar un rótulo recluta parte de él, y al soltarlo esa materia vuelve al flujo
 * y sigue girando. Por eso todas las vistas se leen como una sola cosa que se reordena.
 *
 * **El disco gira siempre**, con rotación diferencial: lo de dentro más rápido que lo de
 * fuera, como una galaxia real. Es lentísimo, pero es lo que impide que el fondo se lea
 * como un fondo de pantalla.
 *
 * Tres cosas que parecen mejorables y no lo son:
 *  - El brillo es un sprite pre-renderizado. `shadowBlur` con esta densidad cuesta entre
 *    8 y 14 ms por fotograma, el presupuesto entero.
 *  - Las líneas y las estelas se agrupan y se pintan con tres `stroke()`. Una llamada por
 *    segmento serían cientos por fotograma.
 *  - El delta va acotado. Sin tope, volver a la pestaña entrega un delta de minutos y las
 *    partículas se teletransportan fuera de pantalla.
 */

export interface Punto {
  x: number;
  y: number;
}

export type Estado = 'disco' | 'viaje' | 'asentada' | 'latente';

/** Forma del recorrido. Alternarlas evita que las transiciones se vuelvan previsibles. */
export type Curva = 'ese' | 'remolino' | 'estallido';

interface Particula {
  x: number;
  y: number;
  px: number;
  py: number;
  /** Sitio en el disco, en polares respecto al núcleo. */
  radio: number;
  angulo: number;
  /** Velocidad angular propia: mayor cerca del núcleo. */
  giro: number;
  /** Origen, destino y los dos controles de la Bézier que recorre. */
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  /** Cuándo sale, y a qué velocidad respecto al tiempo base del viaje. */
  retardo: number;
  ritmo: number;
  tam: number;
  brillo: number;
  /** Fase del titileo, para que el disco no lata a la vez. */
  fase: number;
  /** Temperatura: qué sprite y qué color de núcleo le tocan. */
  tinte: number;
  alfa: number;
  estado: Estado;
  pieza: string | null;
}

const MAX_DT = 32;
const MAX_ENLACE = 130;
const ESTELA = 5;
/** Brazos de la espiral. Dos es lo que mejor se lee sin parecer un remolino de dibujo. */
const BRAZOS = 2;
/** Cuánto se enrolla cada brazo: más alto, espiral más cerrada. */
const ENROLLE = 2.6;
/**
 * El disco se ve casi de canto: por eso lo que se ve es una banda y no una espiral
 * completa. Cuanto más bajo, más se concentra sobre la línea central.
 */
const ACHATADO = 0.26;
/** La banda va inclinada: horizontal se leería como un renglón, no como un cielo. */
const INCLINACION = -0.28;

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: HTMLCanvasElement[] = [];
  private particulas: Particula[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private nucleo = { x: 0, y: 0 };
  private radioMax = 1;
  private raf: number | null = null;
  private ultimo = 0;
  private tiempo = 0;
  private viaje = 1;
  private duracion = 1200;
  private fundido = 1;
  private cede = false;
  private alFormar: (() => void) | null = null;
  private conexiones = true;
  private colores = {
    core: '235,235,245',
    glow: '220,220,235',
    line: '180,180,200',
    tintes: ['235,235,245', '168,192,232', '219,195,168'],
  };

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('sin contexto 2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.leerColores();
    this.sprites = this.colores.tintes.map((rgb) => this.crearSprite(rgb));
  }

  /** Un halo por temperatura. Teñir en cada fotograma costaría mucho más que tres canvas. */
  private crearSprite(rgb: string) {
    const lado = 32;
    const s = document.createElement('canvas');
    s.width = lado;
    s.height = lado;
    const c = s.getContext('2d')!;
    const g = c.createRadialGradient(lado / 2, lado / 2, 0, lado / 2, lado / 2, lado / 2);
    g.addColorStop(0, `rgba(${rgb},1)`);
    g.addColorStop(0.25, `rgba(${rgb},0.55)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, lado, lado);
    return s;
  }

  /** Los colores salen de los tokens: el canvas no escribe ningún valor a mano. */
  private leerColores() {
    const raiz = getComputedStyle(document.documentElement);
    const leer = (nombre: string, respaldo: string) =>
      raiz.getPropertyValue(nombre).trim() || respaldo;
    const core = leer('--star-core', '235,235,245');
    this.colores = {
      core,
      glow: leer('--star-glow', '220,220,235'),
      line: leer('--star-line', '180,180,200'),
      // Orden: neutra, azul, cálida. El índice del tinte apunta a esta lista.
      tintes: [core, leer('--star-blue', '168,192,232'), leer('--star-warm', '219,195,168')],
    };
  }

  redimensionar(ancho: number, alto: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = ancho;
    this.h = alto;
    this.canvas.width = Math.floor(ancho * this.dpr);
    this.canvas.height = Math.floor(alto * this.dpr);
    this.canvas.style.width = `${ancho}px`;
    this.canvas.style.height = `${alto}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Núcleo descentrado y bajo: centrado competiría con el contenido, que vive en la
    // mitad superior de la pantalla.
    this.nucleo = { x: ancho * 0.34, y: alto * 0.58 };
    this.radioMax = Math.hypot(ancho, alto) * 0.9;

    const movil = ancho < 768;
    this.conexiones = !movil;
    this.poblar(movil ? 420 : 1200);
    this.pintar();
  }

  /**
   * Reparte el disco: dos brazos en espiral, densidad que cae hacia fuera y un núcleo más
   * brillante. Repartir al azar da una nube uniforme, que es justo lo que no es una
   * galaxia.
   */
  private poblar(cantidad: number) {
    const enPiezas = this.particulas.filter(
      (p) => p.estado === 'asentada' || p.estado === 'latente',
    );
    const faltan = Math.max(0, cantidad - enPiezas.length);
    const nuevas: Particula[] = [];

    for (let i = 0; i < faltan; i++) {
      nuevas.push(this.enDisco(i));
    }

    this.particulas = [...nuevas, ...enPiezas];
  }

  /** Una partícula nueva en su sitio del disco. */
  private enDisco(indice: number): Particula {
    // Raíz: concentra hacia el núcleo sin dejar el borde vacío.
    const t = Math.pow(Math.random(), 0.62);
    const radio = t * this.radioMax;
    const brazo = (indice % BRAZOS) * ((Math.PI * 2) / BRAZOS);
    // La dispersión se ensancha hacia fuera, como en los brazos reales.
    const ruido = (Math.random() - 0.5) * (0.35 + t * 1.1);
    const angulo = brazo + t * ENROLLE + ruido;
    const sitio = this.puntoDeDisco(radio, angulo);
    const cerca = 1 - t;

    return {
      x: sitio.x,
      y: sitio.y,
      px: sitio.x,
      py: sitio.y,
      radio,
      angulo,
      // Rotación diferencial: lo de dentro gira más rápido. En el borde una vuelta tarda
      // minutos, así que se percibe como respiración y no como giro.
      giro: 0.000007 + 0.00003 * cerca,
      ox: sitio.x,
      oy: sitio.y,
      tx: sitio.x,
      ty: sitio.y,
      c1x: sitio.x,
      c1y: sitio.y,
      c2x: sitio.x,
      c2y: sitio.y,
      retardo: 0,
      ritmo: 1,
      tam: 0.65 + cerca * 1.1 + Math.random() * 0.35,
      brillo: 0.14 + cerca * 0.44 + Math.random() * 0.14,
      fase: Math.random() * Math.PI * 2,
      // La mayoría neutras, unas cuantas azules y muy pocas cálidas: es el reparto que
      // hace que un cielo se lea como un cielo y no como una trama de puntos iguales.
      tinte: indice % 23 === 0 ? 2 : indice % 4 === 0 ? 1 : 0,
      alfa: 1,
      estado: 'disco',
      pieza: null,
    };
  }

  private puntoDeDisco(radio: number, angulo: number): Punto {
    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio * ACHATADO;
    const cos = Math.cos(INCLINACION);
    const sen = Math.sin(INCLINACION);
    return {
      x: this.nucleo.x + x * cos - y * sen,
      y: this.nucleo.y + x * sen + y * cos,
    };
  }

  /** Cuánta materia mueve una vista. Constante, para que el volumen no dé saltos. */
  materia() {
    return this.w < 768 ? 340 : 760;
  }

  /**
   * Recluta parte del disco y la manda a formar un rótulo.
   *
   * Se toma repartida por ángulo, no la más cercana: llevarse una zona entera deja un
   * agujero que se nota mucho más que unas cuantas ausencias repartidas.
   */
  formar(
    puntos: Punto[],
    opciones: {
      pieza: string;
      cuantas: number;
      duracion?: number;
      ceder?: boolean;
      curva?: Curva;
      alFormar?: () => void;
    },
  ) {
    // Cierra el fundido que quedara a medias, o la materia de la pieza anterior se queda
    // visible encima de su propio rótulo.
    for (const p of this.particulas) {
      if (p.estado === 'asentada' && p.pieza && this.cede) p.estado = 'latente';
    }

    const disponibles = this.particulas
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.estado === 'disco' || (p.estado === 'latente' && !p.pieza))
      .sort((a, b) => a.p.angulo - b.p.angulo);

    const cuantas = Math.min(opciones.cuantas, puntos.length, disponibles.length);
    const elegidas: number[] = [];
    for (let i = 0; i < cuantas; i++) {
      elegidas.push(disponibles[Math.floor((i * disponibles.length) / cuantas)].i);
    }

    const destinos = this.repartir(puntos, elegidas.length);
    const cx = destinos.reduce((a, p) => a + p.x, 0) / (destinos.length || 1);
    const cy = destinos.reduce((a, p) => a + p.y, 0) / (destinos.length || 1);
    this.asignar(elegidas, destinos, cx, cy, opciones.pieza, opciones.curva ?? 'ese');

    this.viaje = 0;
    this.fundido = 0;
    this.duracion = opciones.duracion ?? 1200;
    this.cede = opciones.ceder ?? false;
    this.alFormar = opciones.alFormar ?? null;
    this.pintar();
    this.iniciar();
  }

  /**
   * Rompe un rótulo: su materia vuelve al disco, a un sitio nuevo y no al que tenía.
   *
   * No se apaga ni se queda flotando: recorre una curva de vuelta al flujo. Es lo que hace
   * que el conjunto se lea como una galaxia que se reordena.
   */
  disolver(pieza: string, curva: Curva = 'remolino') {
    const suyas = this.particulas.filter((p) => p.pieza === pieza);
    if (suyas.length === 0) return;

    const cx = suyas.reduce((a, p) => a + p.x, 0) / suyas.length;
    const cy = suyas.reduce((a, p) => a + p.y, 0) / suyas.length;

    suyas.forEach((p, i) => {
      p.alfa = 1;
      p.pieza = null;
      p.estado = 'viaje';
      p.ox = p.x;
      p.oy = p.y;

      const t = Math.pow(Math.random(), 0.62);
      p.radio = t * this.radioMax;
      p.angulo = (i % BRAZOS) * Math.PI + t * ENROLLE + (Math.random() - 0.5) * (0.5 + t * 1.6);
      const destino = this.puntoDeDisco(p.radio, p.angulo);
      p.tx = destino.x;
      p.ty = destino.y;

      // Sale en la dirección en que estaba respecto al centro del rótulo: la forma se
      // infla un instante antes de deshacerse, y eso dice que aquello era algo.
      const dx = p.ox - cx;
      const dy = p.oy - cy;
      const d = Math.hypot(dx, dy) || 1;
      p.retardo = 0.24 * (i / suyas.length);
      p.ritmo = 0.75 + Math.random() * 0.6;
      this.controles(p, { x: dx / d, y: dy / d }, curva, i);
    });

    this.viaje = 0;
    this.duracion = 1100;
    this.cede = false;
    this.fundido = 1;
    this.pintar();
    this.iniciar();
  }

  /** Apaga la materia que quedara colgada de una vista que ya no está. */
  olvidar(vigentes: string[]) {
    const validas = new Set(vigentes);
    for (const p of this.particulas) {
      if (!p.pieza || validas.has(p.pieza)) continue;
      p.pieza = null;
      p.estado = 'latente';
    }
    this.pintar();
  }

  /**
   * Los dos puntos de control de la Bézier son los que deciden la forma del recorrido:
   * con qué inclinación sale la partícula y con cuál llega.
   *
   *  - `ese`: los controles salen a lados opuestos y la curva serpentea.
   *  - `remolino`: los dos al mismo lado y muy abiertos, y el trayecto se enrosca.
   *  - `estallido`: apenas se desvía, sale disparada y frena al llegar.
   */
  private controles(p: Particula, salida: Punto, curva: Curva, indice: number) {
    const dist = Math.hypot(p.tx - p.ox, p.ty - p.oy);
    const perp = { x: -salida.y, y: salida.x };
    const lado = indice % 2 === 0 ? 1 : -1;
    // La apertura crece con la distancia y se atenúa en trayectos cortos, donde una curva
    // amplia se vería como un rodeo sin motivo.
    const abre = Math.min(dist * 0.38, 260) * lado;
    const avance = dist * 0.45;

    if (curva === 'ese') {
      p.c1x = p.ox + salida.x * avance + perp.x * abre;
      p.c1y = p.oy + salida.y * avance + perp.y * abre;
      p.c2x = p.tx - salida.x * avance * 0.5 - perp.x * abre;
      p.c2y = p.ty - salida.y * avance * 0.5 - perp.y * abre;
    } else if (curva === 'remolino') {
      p.c1x = p.ox + perp.x * abre * 1.6 + salida.x * avance * 0.3;
      p.c1y = p.oy + perp.y * abre * 1.6 + salida.y * avance * 0.3;
      p.c2x = p.tx + perp.x * abre;
      p.c2y = p.ty + perp.y * abre;
    } else {
      p.c1x = p.ox + salida.x * avance * 1.5;
      p.c1y = p.oy + salida.y * avance * 1.5;
      p.c2x = p.tx + salida.x * avance * 0.25;
      p.c2y = p.ty + salida.y * avance * 0.25;
    }
  }

  /**
   * Empareja partículas y destinos por ángulo: al azar, cientos de trayectorias se cruzan
   * y el resultado es ruido en vez de una masa que se pliega.
   */
  private asignar(
    indices: number[],
    destinos: Punto[],
    cx: number,
    cy: number,
    pieza: string,
    curva: Curva,
  ) {
    const angulo = (p: Punto) => Math.atan2(p.y - cy, p.x - cx);
    const orden = indices
      .map((i) => ({ i, a: angulo(this.particulas[i]) }))
      .sort((a, b) => a.a - b.a);
    const puntos = [...destinos].sort((a, b) => angulo(a) - angulo(b));

    // Dirección del viaje del grupo: es la que da coherencia al conjunto.
    const ox = indices.reduce((a, i) => a + this.particulas[i].x, 0) / (indices.length || 1);
    const oy = indices.reduce((a, i) => a + this.particulas[i].y, 0) / (indices.length || 1);
    const largo = Math.hypot(cx - ox, cy - oy) || 1;
    const dir = { x: (cx - ox) / largo, y: (cy - oy) / largo };

    orden.forEach(({ i }, puesto) => {
      const p = this.particulas[i];
      const d = puntos[puesto];
      p.ox = p.x;
      p.oy = p.y;
      p.tx = d.x;
      p.ty = d.y;
      p.estado = 'viaje';
      p.pieza = pieza;
      // El retardo sale del puesto en el contorno, no del azar: el rótulo se traza.
      p.retardo = 0.24 * (puesto / Math.max(1, orden.length));
      // Y cada una a su ritmo: unas llegan y se asientan mientras otras aún vienen.
      p.ritmo = 0.75 + ((puesto * 37) % 60) / 100;
      this.controles(p, dir, curva, puesto);
    });
  }

  private repartir(puntos: Punto[], cantidad: number): Punto[] {
    const salida: Punto[] = [];
    for (let i = 0; i < cantidad; i++) {
      salida.push(puntos[Math.floor((i * puntos.length) / cantidad)]);
    }
    return salida;
  }

  iniciar() {
    if (this.raf !== null) return;
    this.ultimo = performance.now();
    const paso = (ahora: number) => {
      const dt = Math.min(ahora - this.ultimo, MAX_DT);
      this.ultimo = ahora;
      this.tiempo += dt;
      this.actualizar(dt);
      this.pintar();
      this.raf = requestAnimationFrame(paso);
    };
    this.raf = requestAnimationFrame(paso);
  }

  detener() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  /** Un fotograma asentado y quieto: es lo que se ve con movimiento reducido. */
  pintarQuieto() {
    this.detener();
    this.viaje = 1;
    this.fundido = 1;
    for (const p of this.particulas) {
      p.x = p.tx;
      p.y = p.ty;
      p.px = p.x;
      p.py = p.y;
      p.alfa = 1;
      if (p.estado === 'viaje') p.estado = p.pieza ? 'latente' : 'disco';
      if (p.estado === 'asentada' && p.pieza) p.estado = 'latente';
    }
    this.pintar();
  }

  private actualizar(dt: number) {
    if (this.viaje < 1) {
      this.viaje = Math.min(1, this.viaje + dt / this.duracion);
      if (this.viaje >= 1) {
        for (const p of this.particulas) {
          if (p.estado !== 'viaje') continue;
          p.estado = p.pieza ? 'asentada' : 'disco';
        }
        if (this.alFormar) {
          this.alFormar();
          this.alFormar = null;
        }
      }
    } else if (this.cede && this.fundido < 1) {
      this.fundido = Math.min(1, this.fundido + dt / 420);
      if (this.fundido >= 1) {
        for (const p of this.particulas) {
          if (p.estado === 'asentada' && p.pieza) p.estado = 'latente';
        }
      }
    }

    for (const p of this.particulas) {
      p.px = p.x;
      p.py = p.y;

      if (p.estado === 'viaje') {
        // Cada partícula recorre su Bézier a su propio ritmo, desde su propio retardo.
        const avance = Math.max(0, (this.viaje - p.retardo) / (1 - p.retardo)) * p.ritmo;
        const t = suavizar(Math.min(1, avance));
        const u = 1 - t;
        const w0 = u * u * u;
        const w1 = 3 * u * u * t;
        const w2 = 3 * u * t * t;
        const w3 = t * t * t;
        p.x = w0 * p.ox + w1 * p.c1x + w2 * p.c2x + w3 * p.tx;
        p.y = w0 * p.oy + w1 * p.c1y + w2 * p.c2y + w3 * p.ty;
      } else if (p.estado === 'disco') {
        // La galaxia gira. Es lentísimo, pero es lo que la mantiene viva.
        p.angulo += p.giro * dt;
        const sitio = this.puntoDeDisco(p.radio, p.angulo);
        p.x = sitio.x;
        p.y = sitio.y;
        p.tx = sitio.x;
        p.ty = sitio.y;
      }
    }
  }

  private pintar() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);

    const asentado = this.viaje >= 1;
    if (this.conexiones && asentado) this.pintarLineas();
    else this.pintarEstelas();

    const f = this.tiempo / 1000;
    for (const p of this.particulas) {
      if (p.estado === 'latente') continue;
      const cesion = p.estado === 'asentada' && p.pieza && this.cede ? 1 - this.fundido : 1;
      const pulso = 1 + Math.sin(f * 0.6 + p.fase) * 0.14;
      const alfa = Math.max(0, Math.min(1, p.brillo * cesion * p.alfa * pulso));
      if (alfa <= 0.01) continue;
      const lado = p.tam * 11;

      ctx.globalAlpha = alfa * 0.75;
      ctx.drawImage(this.sprites[p.tinte], p.x - lado / 2, p.y - lado / 2, lado, lado);

      ctx.globalAlpha = alfa;
      ctx.fillStyle = `rgb(${this.colores.tintes[p.tinte]})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private pintarEstelas() {
    const { ctx } = this;
    const grupos: [number, number, number, number][][] = [[], [], []];

    for (const p of this.particulas) {
      if (p.estado === 'latente') continue;
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      if (dx * dx + dy * dy < 1) continue;
      const nivel = p.tam > 1.5 ? 2 : p.tam > 1.1 ? 1 : 0;
      grupos[nivel].push([p.px - dx * ESTELA, p.py - dy * ESTELA, p.x, p.y]);
    }

    ctx.lineCap = 'round';
    grupos.forEach((segmentos, nivel) => {
      if (segmentos.length === 0) return;
      ctx.lineWidth = 0.9 + nivel * 0.9;
      ctx.strokeStyle = `rgba(${this.colores.glow}, ${0.13 + nivel * 0.11})`;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of segmentos) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    });
    ctx.lineCap = 'butt';
  }

  /** Constelación entre las del disco, con rejilla espacial para no comparar todo con todo. */
  private pintarLineas() {
    const { ctx } = this;
    const max2 = MAX_ENLACE * MAX_ENLACE;
    const grupos: [number, number, number, number][][] = [[], [], []];

    const cols = Math.max(1, Math.ceil(this.w / MAX_ENLACE));
    const filas = Math.max(1, Math.ceil(this.h / MAX_ENLACE));
    const celdas: number[][] = Array.from({ length: cols * filas }, () => []);
    const columna = (p: Particula) => Math.min(cols - 1, Math.max(0, Math.floor(p.x / MAX_ENLACE)));
    const fila = (p: Particula) => Math.min(filas - 1, Math.max(0, Math.floor(p.y / MAX_ENLACE)));

    const disco = this.particulas.map((p, i) => ({ p, i })).filter(({ p }) => p.estado === 'disco');
    disco.forEach(({ p, i }) => celdas[fila(p) * cols + columna(p)].push(i));

    for (const { p: a, i } of disco) {
      const c = columna(a);
      const f = fila(a);
      let enlaces = 0;

      for (let df = -1; df <= 1 && enlaces < 2; df++) {
        for (let dc = -1; dc <= 1 && enlaces < 2; dc++) {
          const nf = f + df;
          const nc = c + dc;
          if (nf < 0 || nf >= filas || nc < 0 || nc >= cols) continue;

          for (const j of celdas[nf * cols + nc]) {
            if (j <= i) continue;
            const b = this.particulas[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > max2) continue;
            const cercania = 1 - Math.sqrt(d2) / MAX_ENLACE;
            grupos[Math.min(2, Math.floor(cercania * 3))].push([a.x, a.y, b.x, b.y]);
            if (++enlaces >= 2) break;
          }
        }
      }
    }

    ctx.lineWidth = 0.5;
    grupos.forEach((segmentos, nivel) => {
      if (segmentos.length === 0) return;
      ctx.strokeStyle = `rgba(${this.colores.line}, ${0.03 + nivel * 0.028})`;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of segmentos) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    });
  }
}

function suavizar(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
