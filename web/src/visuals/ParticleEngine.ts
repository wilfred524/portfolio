
/**
 * Cuatro cosas de aquí parecen mejorables y no lo son. El brillo es un sprite
 * pre-renderizado: `shadowBlur` con esta densidad cuesta 8-14 ms por fotograma. Las líneas
 * se acumulan en un buffer y se pintan con tres `stroke()`. Nada de lo que corre por
 * fotograma reserva memoria, ni un objeto ni una cadena. Y el delta va acotado: sin tope,
 * volver a la pestaña entrega un delta de minutos y las partículas se van de pantalla.
 */

export interface Punto {
  x: number;
  y: number;
}

export type Curva = 'ese' | 'remolino' | 'estallido';

interface Estrella {
  x: number;
  y: number;
  radio: number;
  angulo: number;
  giro: number;
  tam: number;
  brillo: number;
  fase: number;
  tinte: number;
}

type EstadoChispa = 'viaje' | 'asentada' | 'latente';

interface Chispa {
  x: number;
  y: number;
  px: number;
  py: number;
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  retardo: number;
  ritmo: number;
  tam: number;
  brillo: number;
  fase: number;
  tinte: number;
  alfa: number;
  estado: EstadoChispa;
  pieza: string | null;
  origen: number;
  vuelve: boolean;
}

const MAX_DT = 32;
const MAX_ENLACE = 130;
const ESTELA = 5;
const ENLACES = 2;
const BRAZOS = 2;
const ENROLLE = 2.6;
const ACHATADO = 0.26;
const INCLINACION = -0.28;
const COS_INC = Math.cos(INCLINACION);
const SEN_INC = Math.sin(INCLINACION);
const MS_CIELO = 90;
const ENCENDIDO = 0.09;
const MS_CESION = 420;

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lienzoCielo: HTMLCanvasElement;
  private cieloCtx: CanvasRenderingContext2D;
  private sprites: HTMLCanvasElement[] = [];
  private cielo: Estrella[] = [];
  private porAngulo: number[] = [];
  private cursor = 0;
  private chispas: Chispa[] = [];
  private libres: Chispa[] = [];

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
  private pendiente = MS_CIELO;

  private celdas: number[][] = [];
  private cols = 1;
  private filas = 1;
  private trazos: Float32Array[] = [];
  private cuantos = [0, 0, 0];

  private colores = {
    glow: '220,220,235',
    line: '180,180,200',
    tintes: ['235,235,245', '168,192,232', '219,195,168'],
  };
  private relleno: string[] = [];

  constructor(materia: HTMLCanvasElement, cielo: HTMLCanvasElement) {
    const ctx = materia.getContext('2d', { alpha: true });
    const cieloCtx = cielo.getContext('2d', { alpha: true });
    if (!ctx || !cieloCtx) throw new Error('sin contexto 2d');
    this.canvas = materia;
    this.ctx = ctx;
    this.lienzoCielo = cielo;
    this.cieloCtx = cieloCtx;

    this.leerColores();
    this.sprites = this.colores.tintes.map((rgb) => this.crearSprite(rgb));
  }

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

  private leerColores() {
    const raiz = getComputedStyle(document.documentElement);
    const leer = (nombre: string, respaldo: string) =>
      raiz.getPropertyValue(nombre).trim() || respaldo;
    const core = leer('--star-core', '235,235,245');
    this.colores = {
      glow: leer('--star-glow', '220,220,235'),
      line: leer('--star-line', '180,180,200'),
      tintes: [core, leer('--star-blue', '168,192,232'), leer('--star-warm', '219,195,168')],
    };
    this.relleno = this.colores.tintes.map((rgb) => `rgb(${rgb})`);
  }

  redimensionar(ancho: number, alto: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = ancho;
    this.h = alto;
    for (const lienzo of [this.canvas, this.lienzoCielo]) {
      lienzo.width = Math.floor(ancho * this.dpr);
      lienzo.height = Math.floor(alto * this.dpr);
      lienzo.style.width = `${ancho}px`;
      lienzo.style.height = `${alto}px`;
    }
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.cieloCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.nucleo = { x: ancho * 0.34, y: alto * 0.58 };
    this.radioMax = Math.hypot(ancho, alto) * 0.9;

    const movil = ancho < 768;
    this.conexiones = !movil;
    this.poblarCielo(movil ? 520 : 1100);
    this.reservarRejilla();

    for (const e of this.cielo) this.situar(e);
    this.pintarCielo();
    this.componer();
  }

  private poblarCielo(cantidad: number) {
    for (let i = this.cielo.length; i < cantidad; i++) this.cielo.push(this.nacerEstrella(i));
    if (this.cielo.length > cantidad) this.cielo.length = cantidad;

    this.porAngulo = this.cielo.map((_, i) => i);
    this.porAngulo.sort((a, b) => this.cielo[a].angulo - this.cielo[b].angulo);
  }

  private nacerEstrella(indice: number): Estrella {
    const t = Math.pow(Math.random(), 0.62);
    const brazo = (indice % BRAZOS) * ((Math.PI * 2) / BRAZOS);
    const ruido = (Math.random() - 0.5) * (0.35 + t * 1.1);
    const cerca = 1 - t;

    const e: Estrella = {
      x: 0,
      y: 0,
      radio: t * this.radioMax,
      angulo: brazo + t * ENROLLE + ruido,
      giro: 0.000007 + 0.00003 * cerca,
      tam: 0.65 + cerca * 1.1 + Math.random() * 0.35,
      brillo: 0.14 + cerca * 0.44 + Math.random() * 0.14,
      fase: Math.random() * Math.PI * 2,
      tinte: indice % 23 === 0 ? 2 : indice % 4 === 0 ? 1 : 0,
    };
    this.situar(e);
    return e;
  }

  private situar(e: Estrella) {
    const x = Math.cos(e.angulo) * e.radio;
    const y = Math.sin(e.angulo) * e.radio * ACHATADO;
    e.x = this.nucleo.x + x * COS_INC - y * SEN_INC;
    e.y = this.nucleo.y + x * SEN_INC + y * COS_INC;
  }

  private reservarRejilla() {
    this.cols = Math.max(1, Math.ceil(this.w / MAX_ENLACE));
    this.filas = Math.max(1, Math.ceil(this.h / MAX_ENLACE));
    this.celdas = [];
    for (let i = 0; i < this.cols * this.filas; i++) this.celdas.push([]);
    const tope = Math.max(64, this.cielo.length * ENLACES * 4);
    this.trazos = [new Float32Array(tope), new Float32Array(tope), new Float32Array(tope)];
  }

  materia() {
    return this.w < 768 ? 420 : 1050;
  }

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
    if (this.cede) {
      for (const c of this.chispas) if (c.estado === 'asentada' && c.pieza) c.estado = 'latente';
    }

    const total = this.porAngulo.length;
    const cuantas = Math.min(opciones.cuantas, puntos.length, total);
    if (cuantas > 0) {
      const nacidas: Chispa[] = [];
      for (let i = 0; i < cuantas; i++) {
        const salto = Math.floor((i * total) / cuantas);
        nacidas.push(this.encender(this.porAngulo[(this.cursor + salto) % total]));
      }
      this.cursor = (this.cursor + 1 + Math.floor(total / 3)) % total;
      this.asignar(nacidas, puntos, opciones.pieza, opciones.curva ?? 'ese');
    }

    this.viaje = 0;
    this.fundido = 0;
    this.duracion = opciones.duracion ?? 1200;
    this.cede = opciones.ceder ?? false;
    this.alFormar = opciones.alFormar ?? null;
    this.congelarCielo();
    this.iniciar();
  }

  private encender(origen: number): Chispa {
    const e = this.cielo[origen];
    const c = this.libres.pop() ?? crearChispa();
    c.x = c.px = c.ox = e.x;
    c.y = c.py = c.oy = e.y;
    c.tam = e.tam;
    c.brillo = Math.max(e.brillo, 0.42);
    c.fase = e.fase;
    c.tinte = e.tinte;
    c.alfa = 0;
    c.estado = 'viaje';
    c.origen = origen;
    c.vuelve = false;
    this.chispas.push(c);
    return c;
  }

  disolver(pieza: string, curva: Curva = 'remolino') {
    const suyas: Chispa[] = [];
    for (const c of this.chispas) if (c.pieza === pieza) suyas.push(c);
    if (suyas.length === 0) return;

    let cx = 0;
    let cy = 0;
    for (const c of suyas) {
      cx += c.x;
      cy += c.y;
    }
    cx /= suyas.length;
    cy /= suyas.length;

    for (let i = 0; i < suyas.length; i++) {
      const c = suyas[i];
      const e = this.cielo[c.origen] ?? this.cielo[0];
      c.alfa = 1;
      c.pieza = null;
      c.estado = 'viaje';
      c.vuelve = true;
      c.ox = c.x;
      c.oy = c.y;
      c.tx = e.x;
      c.ty = e.y;

      const dx = c.ox - cx;
      const dy = c.oy - cy;
      const d = Math.hypot(dx, dy) || 1;
      c.retardo = 0.24 * (i / suyas.length);
      c.ritmo = 0.75 + ((i * 37) % 60) / 100;
      this.controles(c, dx / d, dy / d, curva, i);
    }

    this.viaje = 0;
    this.duracion = 1100;
    this.cede = false;
    this.fundido = 1;
    this.congelarCielo();
    this.iniciar();
  }

  olvidar(vigentes: string[]) {
    for (let i = this.chispas.length - 1; i >= 0; i--) {
      const c = this.chispas[i];
      if (c.pieza && vigentes.includes(c.pieza)) continue;
      this.apagar(i);
    }
    this.componer();
  }

  private apagar(indice: number) {
    const c = this.chispas[indice];
    c.pieza = null;
    c.alfa = 0;
    c.estado = 'latente';
    this.libres.push(c);
    this.chispas[indice] = this.chispas[this.chispas.length - 1];
    this.chispas.pop();
  }

  private controles(c: Chispa, sx: number, sy: number, curva: Curva, indice: number) {
    const dist = Math.hypot(c.tx - c.ox, c.ty - c.oy);
    const px = -sy;
    const py = sx;
    const lado = indice % 2 === 0 ? 1 : -1;
    const abre = Math.min(dist * 0.38, 260) * lado;
    const avance = dist * 0.45;

    if (curva === 'ese') {
      c.c1x = c.ox + sx * avance + px * abre;
      c.c1y = c.oy + sy * avance + py * abre;
      c.c2x = c.tx - sx * avance * 0.5 - px * abre;
      c.c2y = c.ty - sy * avance * 0.5 - py * abre;
    } else if (curva === 'remolino') {
      c.c1x = c.ox + px * abre * 1.6 + sx * avance * 0.3;
      c.c1y = c.oy + py * abre * 1.6 + sy * avance * 0.3;
      c.c2x = c.tx + px * abre;
      c.c2y = c.ty + py * abre;
    } else {
      c.c1x = c.ox + sx * avance * 1.5;
      c.c1y = c.oy + sy * avance * 1.5;
      c.c2x = c.tx + sx * avance * 0.25;
      c.c2y = c.ty + sy * avance * 0.25;
    }
  }

  private asignar(nacidas: Chispa[], puntos: Punto[], pieza: string, curva: Curva) {
    const n = nacidas.length;
    const destinos: Punto[] = [];
    for (let i = 0; i < n; i++) destinos.push(puntos[Math.floor((i * puntos.length) / n)]);

    let cx = 0;
    let cy = 0;
    let ox = 0;
    let oy = 0;
    for (let i = 0; i < n; i++) {
      cx += destinos[i].x;
      cy += destinos[i].y;
      ox += nacidas[i].x;
      oy += nacidas[i].y;
    }
    cx /= n;
    cy /= n;
    ox /= n;
    oy /= n;

    const angulo = (x: number, y: number) => Math.atan2(y - cy, x - cx);
    const orden = nacidas.slice().sort((a, b) => angulo(a.x, a.y) - angulo(b.x, b.y));
    destinos.sort((a, b) => angulo(a.x, a.y) - angulo(b.x, b.y));

    const largo = Math.hypot(cx - ox, cy - oy) || 1;
    const dx = (cx - ox) / largo;
    const dy = (cy - oy) / largo;

    for (let puesto = 0; puesto < n; puesto++) {
      const c = orden[puesto];
      c.tx = destinos[puesto].x;
      c.ty = destinos[puesto].y;
      c.pieza = pieza;
      c.retardo = 0.24 * (puesto / n);
      c.ritmo = 0.75 + ((puesto * 37) % 60) / 100;
      this.controles(c, dx, dy, curva, puesto);
    }
  }

  iniciar() {
    if (this.raf !== null) return;
    this.ultimo = performance.now();
    const paso = (ahora: number) => {
      const dt = Math.min(ahora - this.ultimo, MAX_DT);
      this.ultimo = ahora;
      this.tiempo += dt;
      this.latir(dt);
      this.raf = requestAnimationFrame(paso);
    };
    this.raf = requestAnimationFrame(paso);
  }

  detener() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  pintarQuieto() {
    this.detener();
    this.viaje = 1;
    this.fundido = 1;
    for (let i = this.chispas.length - 1; i >= 0; i--) this.apagar(i);
    this.pintarCielo();
    this.componer();
  }

  private latir(dt: number) {
    if (this.enTransicion()) {
      this.avanzar(dt);
      this.componer();
      return;
    }

    this.pendiente += dt;
    if (this.pendiente < MS_CIELO) return;
    for (const e of this.cielo) {
      e.angulo += e.giro * this.pendiente;
      this.situar(e);
    }
    this.pendiente = 0;
    this.pintarCielo();
    if (this.chispas.length > 0) this.componer();
  }

  private enTransicion() {
    return this.viaje < 1 || (this.cede && this.fundido < 1);
  }

  private congelarCielo() {
    this.pendiente = 0;
  }

  private avanzar(dt: number) {
    if (this.viaje < 1) {
      this.viaje = Math.min(1, this.viaje + dt / this.duracion);
      if (this.viaje >= 1) {
        for (let i = this.chispas.length - 1; i >= 0; i--) {
          const c = this.chispas[i];
          if (c.estado !== 'viaje') continue;
          if (c.vuelve) this.apagar(i);
          else c.estado = 'asentada';
        }
        if (this.alFormar) {
          this.alFormar();
          this.alFormar = null;
        }
      }
    } else if (this.cede && this.fundido < 1) {
      this.fundido = Math.min(1, this.fundido + dt / MS_CESION);
      if (this.fundido >= 1) {
        for (const c of this.chispas) if (c.estado === 'asentada' && c.pieza) c.estado = 'latente';
      }
    }

    for (const c of this.chispas) {
      c.px = c.x;
      c.py = c.y;
      if (c.estado !== 'viaje') continue;

      const avance = Math.max(0, (this.viaje - c.retardo) / (1 - c.retardo)) * c.ritmo;
      if (!c.vuelve && c.alfa < 1) c.alfa = Math.min(1, avance / ENCENDIDO);
      const t = suavizar(Math.min(1, avance));
      const u = 1 - t;
      const w0 = u * u * u;
      const w1 = 3 * u * u * t;
      const w2 = 3 * u * t * t;
      const w3 = t * t * t;
      c.x = w0 * c.ox + w1 * c.c1x + w2 * c.c2x + w3 * c.tx;
      c.y = w0 * c.oy + w1 * c.c1y + w2 * c.c2y + w3 * c.ty;
    }
  }

  private componer() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    if (this.chispas.length === 0) return;

    if (this.viaje < 1) this.pintarEstelas();

    const f = this.tiempo / 1000;
    for (const c of this.chispas) {
      if (c.estado === 'latente') continue;
      const cesion = c.estado === 'asentada' && c.pieza && this.cede ? 1 - this.fundido : 1;
      const pulso = 1 + Math.sin(f * 0.6 + c.fase) * 0.14;
      const alfa = Math.max(0, Math.min(1, c.brillo * cesion * c.alfa * pulso));
      if (alfa <= 0.01) continue;
      const lado = c.tam * 11;

      ctx.globalAlpha = alfa * 0.75;
      ctx.drawImage(this.sprites[c.tinte], c.x - lado / 2, c.y - lado / 2, lado, lado);

      ctx.globalAlpha = alfa;
      ctx.fillStyle = this.relleno[c.tinte];
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.tam, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private pintarEstelas() {
    const { ctx } = this;
    this.cuantos[0] = this.cuantos[1] = this.cuantos[2] = 0;

    for (const c of this.chispas) {
      if (c.estado !== 'viaje' || c.alfa <= 0.01) continue;
      const dx = c.x - c.px;
      const dy = c.y - c.py;
      if (dx * dx + dy * dy < 1) continue;
      const nivel = c.tam > 1.5 ? 2 : c.tam > 1.1 ? 1 : 0;
      this.anotar(nivel, c.px - dx * ESTELA, c.py - dy * ESTELA, c.x, c.y);
    }

    ctx.lineCap = 'round';
    for (let nivel = 0; nivel < 3; nivel++) {
      ctx.lineWidth = 0.9 + nivel * 0.9;
      this.trazar(ctx, nivel, `rgba(${this.colores.glow}, ${0.13 + nivel * 0.11})`);
    }
    ctx.lineCap = 'butt';
  }

  private pintarCielo() {
    const ctx = this.cieloCtx;
    ctx.clearRect(0, 0, this.w, this.h);
    if (this.conexiones) this.pintarLineas(ctx);

    const f = this.tiempo / 1000;
    for (const e of this.cielo) {
      const pulso = 1 + Math.sin(f * 0.6 + e.fase) * 0.14;
      const alfa = Math.max(0, Math.min(1, e.brillo * pulso));
      if (alfa <= 0.01) continue;
      const lado = e.tam * 11;

      ctx.globalAlpha = alfa * 0.75;
      ctx.drawImage(this.sprites[e.tinte], e.x - lado / 2, e.y - lado / 2, lado, lado);

      ctx.globalAlpha = alfa;
      ctx.fillStyle = this.relleno[e.tinte];
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.tam, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private pintarLineas(ctx: CanvasRenderingContext2D) {
    const max2 = MAX_ENLACE * MAX_ENLACE;
    const { cols, filas, celdas } = this;
    this.cuantos[0] = this.cuantos[1] = this.cuantos[2] = 0;
    for (let i = 0; i < celdas.length; i++) celdas[i].length = 0;

    for (let i = 0; i < this.cielo.length; i++) {
      const e = this.cielo[i];
      const c = Math.min(cols - 1, Math.max(0, Math.floor(e.x / MAX_ENLACE)));
      const f = Math.min(filas - 1, Math.max(0, Math.floor(e.y / MAX_ENLACE)));
      celdas[f * cols + c].push(i);
    }

    for (let i = 0; i < this.cielo.length; i++) {
      const a = this.cielo[i];
      const c = Math.min(cols - 1, Math.max(0, Math.floor(a.x / MAX_ENLACE)));
      const f = Math.min(filas - 1, Math.max(0, Math.floor(a.y / MAX_ENLACE)));
      let enlaces = 0;

      for (let df = -1; df <= 1 && enlaces < ENLACES; df++) {
        const nf = f + df;
        if (nf < 0 || nf >= filas) continue;
        for (let dc = -1; dc <= 1 && enlaces < ENLACES; dc++) {
          const nc = c + dc;
          if (nc < 0 || nc >= cols) continue;

          const celda = celdas[nf * cols + nc];
          for (let k = 0; k < celda.length; k++) {
            const j = celda[k];
            if (j <= i) continue;
            const b = this.cielo[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > max2) continue;
            const cercania = 1 - Math.sqrt(d2) / MAX_ENLACE;
            this.anotar(Math.min(2, Math.floor(cercania * 3)), a.x, a.y, b.x, b.y);
            if (++enlaces >= ENLACES) break;
          }
        }
      }
    }

    ctx.lineWidth = 0.5;
    for (let nivel = 0; nivel < 3; nivel++) {
      this.trazar(ctx, nivel, `rgba(${this.colores.line}, ${0.03 + nivel * 0.028})`);
    }
  }

  private anotar(nivel: number, x1: number, y1: number, x2: number, y2: number) {
    const buffer = this.trazos[nivel];
    const n = this.cuantos[nivel];
    if (n + 4 > buffer.length) return;
    buffer[n] = x1;
    buffer[n + 1] = y1;
    buffer[n + 2] = x2;
    buffer[n + 3] = y2;
    this.cuantos[nivel] = n + 4;
  }

  private trazar(ctx: CanvasRenderingContext2D, nivel: number, color: string) {
    const n = this.cuantos[nivel];
    if (n === 0) return;
    const buffer = this.trazos[nivel];
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i < n; i += 4) {
      ctx.moveTo(buffer[i], buffer[i + 1]);
      ctx.lineTo(buffer[i + 2], buffer[i + 3]);
    }
    ctx.stroke();
  }
}

function crearChispa(): Chispa {
  return {
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    ox: 0,
    oy: 0,
    tx: 0,
    ty: 0,
    c1x: 0,
    c1y: 0,
    c2x: 0,
    c2y: 0,
    retardo: 0,
    ritmo: 1,
    tam: 1,
    brillo: 0.5,
    fase: 0,
    tinte: 0,
    alfa: 0,
    estado: 'latente',
    pieza: null,
    origen: 0,
    vuelve: false,
  };
}

function suavizar(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
