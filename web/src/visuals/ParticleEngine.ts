/**
 * Campo de partículas del observatorio. Canvas 2D, sin librería y sin React dentro: el
 * bucle de fotogramas no pasa por el estado de React.
 *
 * En reposo cada partícula deriva alrededor de su ancla y late. Al cambiar de plano, el
 * campo barre la pantalla de izquierda a derecha y se reasienta en anclas nuevas.
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
  /** Reclutada para la figura en curso, frente a las que se quedan de cielo. */
  figura: boolean;
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
}

const DURACION = 1100;
const MAX_DT = 32;
const MAX_ENLACE = 120;
const ESTELA = 5;
/** Cuánto del campo se recluta: el resto sigue de cielo, o la pantalla se queda muerta. */
const RECLUTA = 0.6;
const FUNDIDO = 320;

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
  private tiempo = 0;
  private viaje = 1;
  /** 0 mientras las partículas de la figura se ven, 1 cuando ya cedieron al trazo. */
  private fundido = 0;
  private alFormar: (() => void) | null = null;
  private cede = false;
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
        figura: false,
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
        radio: grande ? 1.5 + Math.random() * 0.5 : 0.85 + Math.random() * 0.35,
        brillo: grande ? 0.5 + Math.random() * 0.3 : 0.28 + Math.random() * 0.24,
      };
    });
  }

  /**
   * Manda el campo a anclas nuevas. Sin `puntos`, se redistribuye como cielo.
   *
   * Con una figura solo se recluta parte del campo, y son las partículas más cercanas a
   * ella: así el recorrido es corto y el resto sigue de fondo. El emparejamiento va por
   * ángulo; al azar, cientos de trayectorias se cruzan y el resultado es ruido en vez de
   * una masa que se pliega.
   */
  formar(puntos?: Punto[], opciones?: { alFormar?: () => void; ceder?: boolean }) {
    const total = this.particulas.length;
    const conFigura = !!puntos?.length;
    const reclutadas = conFigura ? Math.round(total * RECLUTA) : 0;

    const cielo = () => ({ x: Math.random() * this.w, y: Math.random() * this.h });

    if (conFigura) {
      const cx = puntos!.reduce((a, p) => a + p.x, 0) / puntos!.length;
      const cy = puntos!.reduce((a, p) => a + p.y, 0) / puntos!.length;
      const cercanas = this.particulas
        .map((p, i) => ({ i, d: (p.x - cx) ** 2 + (p.y - cy) ** 2 }))
        .sort((a, b) => a.d - b.d)
        .slice(0, reclutadas)
        .map((e) => e.i);

      const marcadas = new Set(cercanas);
      this.particulas.forEach((p, i) => (p.figura = marcadas.has(i)));

      this.asignar(cercanas, this.repartir(puntos!, reclutadas), cx, cy);
      const resto = this.particulas.map((_, i) => i).filter((i) => !marcadas.has(i));
      this.asignar(resto, resto.map(cielo), this.w / 2, this.h / 2);
    } else {
      this.particulas.forEach((p) => (p.figura = false));
      const todas = this.particulas.map((_, i) => i);
      this.asignar(todas, todas.map(cielo), this.w / 2, this.h / 2);
    }

    this.viaje = 0;
    this.fundido = 0;
    this.alFormar = opciones?.alFormar ?? null;
    // Sin `ceder`, la figura se queda hecha de estrellas: es lo que pasa en los planos
    // donde no hay ningún trazo debajo al que dar el relevo.
    this.cede = opciones?.ceder ?? false;
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
      p.curva = (puesto % 2 === 0 ? 1 : -1) * (0.12 + Math.random() * 0.18);
      p.retardo = Math.random() * 0.25;
    });
  }

  /** Suelta las partículas de la figura: vuelven a ser cielo. */
  liberar() {
    const enFigura = this.particulas.map((p, i) => (p.figura ? i : -1)).filter((i) => i >= 0);
    if (enFigura.length === 0) return;
    this.particulas.forEach((p) => (p.figura = false));
    this.asignar(
      enFigura,
      enFigura.map(() => ({ x: Math.random() * this.w, y: Math.random() * this.h })),
      this.w / 2,
      this.h / 2,
    );
    this.viaje = 0;
    this.fundido = 0;
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

  private hayFigura() {
    return this.particulas.some((p) => p.figura);
  }

  /** Un fotograma ya asentado: es lo que se ve con `prefers-reduced-motion`. */
  pintarQuieto() {
    this.viaje = 1;
    for (const p of this.particulas) {
      p.x = p.hx;
      p.y = p.hy;
      p.px = p.x;
      p.py = p.y;
    }
    this.pintar();
  }

  private actualizar(dt: number) {
    if (this.viaje < 1) {
      this.viaje = Math.min(1, this.viaje + dt / DURACION);
      // La figura queda formada: se avisa una vez, y las partículas empiezan a ceder
      // el sitio al trazo que aparece debajo.
      if (this.viaje >= 1 && this.alFormar) {
        this.alFormar();
        this.alFormar = null;
      }
    } else if (this.cede && this.hayFigura() && this.fundido < 1) {
      this.fundido = Math.min(1, this.fundido + dt / FUNDIDO);
    }
    const f = this.tiempo / 1000;

    for (const p of this.particulas) {
      p.px = p.x;
      p.py = p.y;

      if (this.viaje < 1) {
        const t = suavizar(Math.max(0, (this.viaje - p.retardo) / (1 - p.retardo)));
        const dx = p.tx - p.ox;
        const dy = p.ty - p.oy;
        const arrastre = Math.sin(t * Math.PI) * this.w * 0.18;
        p.x = p.ox + dx * t + arrastre;
        p.y = p.oy + dy * t + Math.sin(t * Math.PI) * dx * p.curva;
      } else {
        p.x = p.hx + Math.cos(f * 0.18 + p.semilla) * 9;
        p.y = p.hy + Math.sin(f * 0.13 + p.semilla * 1.7) * 7;
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
      const pulso = Math.sin(f * 0.9 + p.semilla) * 0.1;
      const cesion = p.figura ? 1 - this.fundido : 1;
      const alfa = Math.max(0, Math.min(1, (p.brillo + pulso) * cesion));
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
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      if (dx * dx + dy * dy < 1) continue;
      const nivel = p.radio > 1.4 ? 2 : p.radio > 1 ? 1 : 0;
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

    this.particulas.forEach((p, i) => celdas[fila(p) * cols + columna(p)].push(i));

    for (let i = 0; i < this.particulas.length; i++) {
      const a = this.particulas[i];
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
