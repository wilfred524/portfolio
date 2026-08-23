/**
 * Campo de partículas del observatorio. Canvas 2D, sin librería y sin React dentro: el
 * bucle de fotogramas no pasa por el estado de React.
 *
 * **El campo no se mueve solo.** En reposo es una imagen fija y el bucle está detenido:
 * las estrellas quietas son adorno, y solo se animan al pasar de plano.
 *
 * Al formar una figura se recluta una parte del campo. Esas partículas viajan, se
 * condensan y **se consumen** al fundirse en la pieza: no vuelven al cielo. Se reponen en
 * el viaje siguiente, apareciendo cuando ya hay movimiento en pantalla que lo disimule.
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

interface Particula {
  x: number;
  y: number;
  px: number;
  py: number;
  hx: number;
  hy: number;
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  curva: number;
  retardo: number;
  semilla: number;
  radio: number;
  brillo: number;
  figura: boolean;
  /** Ya se fundió en una pieza: no se pinta hasta que se repone. */
  consumida: boolean;
  /** De 0 a 1 mientras vuelve a aparecer tras haberse consumido. */
  aparicion: number;
}

const DURACION = 1500;
const MAX_DT = 32;
const MAX_ENLACE = 130;
const ESTELA = 5;
/** Cuánto del campo se lleva cada figura. El resto se queda de adorno. */
const RECLUTA = 0.34;
const FUNDIDO = 460;

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprite: HTMLCanvasElement;
  private particulas: Particula[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf: number | null = null;
  private ultimo = 0;
  private viaje = 1;
  private fundido = 1;
  private cede = false;
  private duracion = DURACION;
  private alFormar: (() => void) | null = null;
  private conexiones = true;
  private colores = { core: '235,235,245', glow: '220,220,235', line: '180,180,200' };

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('sin contexto 2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = this.crearSprite();
    this.leerColores();
  }

  private crearSprite() {
    const lado = 32;
    const s = document.createElement('canvas');
    s.width = lado;
    s.height = lado;
    const c = s.getContext('2d')!;
    const g = c.createRadialGradient(lado / 2, lado / 2, 0, lado / 2, lado / 2, lado / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, lado, lado);
    return s;
  }

  /** Los colores salen de los tokens: el canvas no escribe ningún valor a mano. */
  private leerColores() {
    const raiz = getComputedStyle(document.documentElement);
    const leer = (nombre: string, respaldo: string) =>
      raiz.getPropertyValue(nombre).trim() || respaldo;
    this.colores = {
      core: leer('--star-core', '235,235,245'),
      glow: leer('--star-glow', '220,220,235'),
      line: leer('--star-line', '180,180,200'),
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

    const movil = ancho < 768;
    this.conexiones = !movil;
    const objetivo = movil
      ? Math.min(160, Math.round((ancho * alto) / 6000))
      : Math.min(340, Math.round((ancho * alto) / 5200));

    this.poblar(Math.max(60, objetivo));
    this.pintar();
  }

  private poblar(cantidad: number) {
    const previas = this.particulas;
    this.particulas = Array.from({ length: cantidad }, (_, i) => {
      const anterior = previas[i];
      const hx = Math.random() * this.w;
      const hy = Math.random() * this.h;
      const x = anterior?.x ?? hx;
      const y = anterior?.y ?? hy;
      const grande = i % 9 === 0;
      return {
        x,
        y,
        px: x,
        py: y,
        hx,
        hy,
        tx: hx,
        ty: hy,
        ox: x,
        oy: y,
        curva: 0,
        retardo: Math.random() * 0.25,
        semilla: Math.random() * Math.PI * 2,
        radio: grande ? 1.4 + Math.random() * 0.4 : 0.8 + Math.random() * 0.3,
        brillo: grande ? 0.45 + Math.random() * 0.25 : 0.24 + Math.random() * 0.2,
        figura: false,
        consumida: false,
        aparicion: 1,
      };
    });
  }

  /**
   * Manda a viajar la parte del campo más cercana a la figura, para que el recorrido sea
   * corto. El emparejamiento va por ángulo: al azar, cientos de trayectorias se cruzan y
   * el resultado es ruido en vez de una masa que se pliega.
   */
  formar(
    puntos?: Punto[],
    opciones?: {
      alFormar?: () => void;
      ceder?: boolean;
      duracion?: number;
      /** Reutiliza las reclutadas: la figura se recoge en vez de rehacerse. */
      mismasParticulas?: boolean;
    },
  ) {
    if (!opciones?.mismasParticulas) this.reponer();

    const conFigura = !!puntos?.length;

    if (conFigura) {
      const cx = puntos!.reduce((a, p) => a + p.x, 0) / puntos!.length;
      const cy = puntos!.reduce((a, p) => a + p.y, 0) / puntos!.length;

      const yaReclutadas = this.particulas.map((p, i) => (p.figura ? i : -1)).filter((i) => i >= 0);
      const cuantas = Math.max(40, Math.round(this.particulas.length * RECLUTA));
      const elegidas =
        opciones?.mismasParticulas && yaReclutadas.length > 0
          ? yaReclutadas
          : this.particulas
              .map((p, i) => ({ i, d: (p.x - cx) ** 2 + (p.y - cy) ** 2, viva: !p.consumida }))
              .filter((e) => e.viva)
              .sort((a, b) => a.d - b.d)
              .slice(0, cuantas)
              .map((e) => e.i);

      const marcadas = new Set(elegidas);
      this.particulas.forEach((p, i) => (p.figura = marcadas.has(i)));
      this.asignar(elegidas, this.repartir(puntos!, elegidas.length), cx, cy);
      this.quietas(marcadas);
    } else {
      this.particulas.forEach((p) => (p.figura = false));
      this.quietas(new Set());
    }

    this.viaje = 0;
    this.fundido = 0;
    this.duracion = opciones?.duracion ?? DURACION;
    this.cede = opciones?.ceder ?? false;
    this.alFormar = opciones?.alFormar ?? null;
    this.iniciar();
  }

  /** Las que no viajan se quedan exactamente donde están. */
  private quietas(salvo: Set<number>) {
    this.particulas.forEach((p, i) => {
      if (salvo.has(i)) return;
      p.ox = p.x;
      p.oy = p.y;
      p.tx = p.hx;
      p.ty = p.hy;
      p.curva = 0;
      p.retardo = 0;
    });
  }

  /** Devuelve al cielo las que se fundieron en una pieza, apareciendo desde cero. */
  private reponer() {
    for (const p of this.particulas) {
      if (!p.consumida) continue;
      p.consumida = false;
      p.figura = false;
      p.aparicion = 0;
      p.hx = Math.random() * this.w;
      p.hy = Math.random() * this.h;
      p.x = p.hx;
      p.y = p.hy;
      p.px = p.x;
      p.py = p.y;
    }
  }

  private asignar(indices: number[], destinos: Punto[], cx: number, cy: number) {
    const angulo = (p: Punto) => Math.atan2(p.y - cy, p.x - cx);
    const orden = indices
      .map((i) => ({ i, a: angulo(this.particulas[i]) }))
      .sort((a, b) => a.a - b.a);
    const puntos = [...destinos].sort((a, b) => angulo(a) - angulo(b));

    orden.forEach(({ i }, puesto) => {
      const p = this.particulas[i];
      const d = puntos[puesto];
      p.ox = p.x;
      p.oy = p.y;
      p.tx = d.x;
      p.ty = d.y;
      p.hx = d.x;
      p.hy = d.y;
      p.curva = (puesto % 2 === 0 ? 1 : -1) * (0.1 + Math.random() * 0.14);
      p.retardo = Math.random() * 0.25;
    });
  }

  private repartir(puntos: Punto[], cantidad: number): Punto[] {
    const salida: Punto[] = [];
    for (let i = 0; i < cantidad; i++) {
      salida.push(puntos[Math.floor((i * puntos.length) / cantidad)]);
    }
    return salida;
  }

  private ocupado() {
    if (this.viaje < 1) return true;
    if (this.cede && this.fundido < 1) return true;
    return this.particulas.some((p) => p.aparicion < 1);
  }

  iniciar() {
    if (this.raf !== null) return;
    this.ultimo = performance.now();
    const paso = (ahora: number) => {
      const dt = Math.min(ahora - this.ultimo, MAX_DT);
      this.ultimo = ahora;
      this.actualizar(dt);
      this.pintar();
      // Sin nada que animar el bucle se para: en reposo el campo es una imagen fija.
      if (!this.ocupado()) {
        this.raf = null;
        return;
      }
      this.raf = requestAnimationFrame(paso);
    };
    this.raf = requestAnimationFrame(paso);
  }

  detener() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  /** Deja el campo asentado y lo pinta una vez: es lo que se ve con movimiento reducido. */
  pintarQuieto() {
    this.detener();
    this.viaje = 1;
    this.fundido = 1;
    for (const p of this.particulas) {
      p.x = p.hx;
      p.y = p.hy;
      p.px = p.x;
      p.py = p.y;
      p.aparicion = 1;
      if (p.figura) p.consumida = true;
    }
    this.pintar();
  }

  private actualizar(dt: number) {
    if (this.viaje < 1) {
      this.viaje = Math.min(1, this.viaje + dt / this.duracion);
      if (this.viaje >= 1 && this.alFormar) {
        this.alFormar();
        this.alFormar = null;
      }
    } else if (this.cede && this.fundido < 1) {
      this.fundido = Math.min(1, this.fundido + dt / FUNDIDO);
      // La figura ya es trazo: estas partículas se han gastado y no vuelven.
      if (this.fundido >= 1) {
        for (const p of this.particulas) if (p.figura) p.consumida = true;
      }
    }

    for (const p of this.particulas) {
      p.px = p.x;
      p.py = p.y;
      if (p.aparicion < 1) p.aparicion = Math.min(1, p.aparicion + dt / 900);

      if (this.viaje < 1) {
        const t = suavizar(Math.max(0, (this.viaje - p.retardo) / (1 - p.retardo)));
        const dx = p.tx - p.ox;
        const dy = p.ty - p.oy;
        const arrastre = p.figura ? Math.sin(t * Math.PI) * this.w * 0.05 : 0;
        p.x = p.ox + dx * t + arrastre;
        p.y = p.oy + dy * t + Math.sin(t * Math.PI) * dx * p.curva;
      } else {
        p.x = p.hx;
        p.y = p.hy;
      }
    }
  }

  private pintar() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);

    const asentado = this.viaje >= 1;
    if (this.conexiones && asentado) this.pintarLineas();
    else this.pintarEstelas();

    for (const p of this.particulas) {
      if (p.consumida) continue;
      const cesion = p.figura && this.cede ? 1 - this.fundido : 1;
      const alfa = Math.max(0, Math.min(1, p.brillo * cesion * p.aparicion));
      if (alfa <= 0.01) continue;
      const lado = p.radio * 11;

      ctx.globalAlpha = alfa * 0.8;
      ctx.drawImage(this.sprite, p.x - lado / 2, p.y - lado / 2, lado, lado);

      ctx.globalAlpha = alfa;
      ctx.fillStyle = `rgb(${this.colores.core})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private pintarEstelas() {
    const { ctx } = this;
    const grupos: [number, number, number, number][][] = [[], [], []];

    for (const p of this.particulas) {
      if (p.consumida) continue;
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      if (dx * dx + dy * dy < 1) continue;
      const nivel = p.radio > 1.3 ? 2 : p.radio > 1 ? 1 : 0;
      grupos[nivel].push([p.px - dx * ESTELA, p.py - dy * ESTELA, p.x, p.y]);
    }

    ctx.lineCap = 'round';
    grupos.forEach((segmentos, nivel) => {
      if (segmentos.length === 0) return;
      ctx.lineWidth = 0.9 + nivel * 0.9;
      ctx.strokeStyle = `rgba(${this.colores.glow}, ${0.14 + nivel * 0.12})`;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of segmentos) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    });
    ctx.lineCap = 'butt';
  }

  /** Constelación, con rejilla espacial: cada partícula solo mira sus celdas vecinas. */
  private pintarLineas() {
    const { ctx } = this;
    const max2 = MAX_ENLACE * MAX_ENLACE;
    const grupos: [number, number, number, number][][] = [[], [], []];

    const cols = Math.max(1, Math.ceil(this.w / MAX_ENLACE));
    const filas = Math.max(1, Math.ceil(this.h / MAX_ENLACE));
    const celdas: number[][] = Array.from({ length: cols * filas }, () => []);
    const columna = (p: Particula) => Math.min(cols - 1, Math.max(0, Math.floor(p.x / MAX_ENLACE)));
    const fila = (p: Particula) => Math.min(filas - 1, Math.max(0, Math.floor(p.y / MAX_ENLACE)));

    this.particulas.forEach((p, i) => {
      if (!p.consumida) celdas[fila(p) * cols + columna(p)].push(i);
    });

    for (let i = 0; i < this.particulas.length; i++) {
      const a = this.particulas[i];
      if (a.consumida) continue;
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
      ctx.strokeStyle = `rgba(${this.colores.line}, ${0.04 + nivel * 0.035})`;
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
