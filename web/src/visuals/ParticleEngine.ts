/**
 * Campo de partículas del observatorio.
 *
 * Clase sin React a propósito: el bucle de fotogramas no puede pasar por el estado de
 * React. Ni un `setState` por frame.
 *
 * Dos regímenes:
 *  - **Reposo**: cada partícula deriva alrededor de su ancla y late con fase propia.
 *  - **Viaje**: al cambiar de plano, el campo entero barre la pantalla y se reasienta en
 *    anclas nuevas. El barrido va siempre de izquierda a derecha, como una corriente:
 *    es ambiental, no direccional, y por eso no contradice al plano que entra por su lado.
 *
 * `formar()` acepta los puntos de una figura y está preparado para la fase siguiente, en
 * la que las partículas se condensan en la pieza de cada proyecto.
 */

export interface Punto {
  x: number;
  y: number;
}

interface Particula {
  x: number;
  y: number;
  /** Ancla: el sitio al que vuelve cuando no viaja. */
  hx: number;
  hy: number;
  /** Destino del viaje en curso. */
  tx: number;
  ty: number;
  /** Origen del viaje, para interpolar sin acumular error. */
  ox: number;
  oy: number;
  /** Desvío perpendicular de la curva: sin él las trayectorias son rectas. */
  curva: number;
  /** Reparte la salida para que el grupo no arranque de golpe. */
  retardo: number;
  semilla: number;
  radio: number;
  brillo: number;
}

const DURACION = 1100;
const MAX_DT = 32;

export class ParticleEngine {
  private ctx: CanvasRenderingContext2D;
  private sprite: HTMLCanvasElement;
  private particulas: Particula[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf: number | null = null;
  private ultimo = 0;
  private tiempo = 0;
  /** Progreso del viaje en [0,1]. Fuera de un viaje vale 1. */
  private viaje = 1;
  private conexiones = true;
  private colores = { core: '235,235,245', glow: '220,220,235', line: '180,180,200' };

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('sin contexto 2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = this.crearSprite();
    this.leerColores();
  }

  /**
   * El brillo es un sprite pre-renderizado y no `shadowBlur`.
   *
   * Con 150 partículas, `shadowBlur` cuesta entre 8 y 14 ms por fotograma: el presupuesto
   * entero. Un `drawImage` de un degradado ya pintado baja eso a menos de 1 ms.
   */
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
    // Las líneas son O(n²) y son lo caro, no las partículas. Apagadas en móvil sobra
    // presupuesto para mantener una densidad que se lea como un cielo y no como polvo.
    this.conexiones = !movil;
    const objetivo = movil
      ? Math.min(80, Math.round((ancho * alto) / 9000))
      : Math.min(150, Math.round((ancho * alto) / 9000));

    this.poblar(Math.max(30, objetivo));
  }

  private poblar(cantidad: number) {
    const previas = this.particulas;
    this.particulas = Array.from({ length: cantidad }, (_, i) => {
      const anterior = previas[i];
      const hx = Math.random() * this.w;
      const hy = Math.random() * this.h;
      return {
        x: anterior?.x ?? hx,
        y: anterior?.y ?? hy,
        hx,
        hy,
        tx: hx,
        ty: hy,
        ox: anterior?.x ?? hx,
        oy: anterior?.y ?? hy,
        curva: 0,
        retardo: Math.random() * 0.25,
        semilla: Math.random() * Math.PI * 2,
        radio: 0.4 + Math.random() * 1.1,
        brillo: 0.12 + Math.random() * 0.33,
      };
    });
  }

  /**
   * Arranca un viaje hacia anclas nuevas.
   *
   * `puntos` son las posiciones de una figura; sin ellos, el campo se redistribuye. Las
   * partículas se emparejan con su destino **por ángulo** alrededor del centro: con un
   * emparejamiento al azar, ciento cincuenta trayectorias se cruzan y el resultado es
   * ruido en vez de una sola masa que se pliega.
   */
  formar(puntos?: Punto[]) {
    const destinos: Punto[] = puntos?.length
      ? this.repartir(puntos, this.particulas.length)
      : this.particulas.map(() => ({ x: Math.random() * this.w, y: Math.random() * this.h }));

    const cx = this.w / 2;
    const cy = this.h / 2;
    const angulo = (p: Punto) => Math.atan2(p.y - cy, p.x - cx);

    const orden = this.particulas
      .map((p, i) => ({ i, a: angulo(p) }))
      .sort((a, b) => a.a - b.a);
    destinos.sort((a, b) => angulo(a) - angulo(b));

    orden.forEach(({ i }, puesto) => {
      const p = this.particulas[i];
      const d = destinos[puesto];
      p.ox = p.x;
      p.oy = p.y;
      p.tx = d.x;
      p.ty = d.y;
      p.hx = d.x;
      p.hy = d.y;
      // Signo alternado: sin él, todas las curvas se comban al mismo lado y el campo
      // entero parece un solo arco.
      p.curva = (puesto % 2 === 0 ? 1 : -1) * (0.12 + Math.random() * 0.18);
      p.retardo = Math.random() * 0.25;
    });

    this.viaje = 0;
  }

  /** Ajusta una lista de puntos al número de partículas, repitiendo o saltando. */
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
      // Sin el tope, volver a la pestaña tras un rato entrega un delta de minutos y las
      // partículas se teletransportan fuera de pantalla.
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

  /** Un solo fotograma, ya asentado: es lo que se ve con `prefers-reduced-motion`. */
  pintarQuieto() {
    this.viaje = 1;
    for (const p of this.particulas) {
      p.x = p.hx;
      p.y = p.hy;
    }
    this.pintar();
  }

  private actualizar(dt: number) {
    if (this.viaje < 1) this.viaje = Math.min(1, this.viaje + dt / DURACION);

    for (const p of this.particulas) {
      if (this.viaje < 1) {
        const t = suavizar(Math.max(0, (this.viaje - p.retardo) / (1 - p.retardo)));
        const dx = p.tx - p.ox;
        const dy = p.ty - p.oy;

        // Campana: el barrido acelera y frena dentro del viaje, en vez de arrastrar al
        // campo hasta el final. Siempre hacia la derecha: es una corriente, no una
        // dirección de navegación.
        const arrastre = Math.sin(t * Math.PI) * this.w * 0.18;

        p.x = p.ox + dx * t + arrastre;
        p.y = p.oy + dy * t + Math.sin(t * Math.PI) * dx * p.curva;
      } else {
        // Reposo: deriva lenta alrededor del ancla. Determinista, sin acumular estado.
        const f = this.tiempo / 1000;
        p.x = p.hx + Math.cos(f * 0.18 + p.semilla) * 9;
        p.y = p.hy + Math.sin(f * 0.13 + p.semilla * 1.7) * 7;
      }
    }
  }

  private pintar() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);

    const asentado = this.viaje >= 1;
    // Durante el viaje las líneas desaparecen: unir puntos que se están cruzando dibuja
    // una maraña, no una constelación.
    if (this.conexiones && asentado) this.pintarLineas();

    const f = this.tiempo / 1000;
    for (const p of this.particulas) {
      const pulso = Math.sin(f * 0.9 + p.semilla) * 0.08;
      const alfa = Math.max(0, Math.min(0.9, p.brillo + pulso));
      const lado = p.radio * 8;

      ctx.globalAlpha = alfa * 0.55;
      ctx.drawImage(this.sprite, p.x - lado / 2, p.y - lado / 2, lado, lado);

      ctx.globalAlpha = alfa;
      ctx.fillStyle = `rgb(${this.colores.core})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Constelación. Los segmentos se agrupan en tres niveles de opacidad y se pintan con
   * tres `stroke()`: uno por línea serían cien llamadas por fotograma.
   */
  private pintarLineas() {
    const { ctx } = this;
    const max = 120;
    const max2 = max * max;
    const grupos: [number, number, number, number][][] = [[], [], []];

    for (let i = 0; i < this.particulas.length; i++) {
      const a = this.particulas[i];
      let enlaces = 0;
      for (let j = i + 1; j < this.particulas.length && enlaces < 2; j++) {
        const b = this.particulas[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > max2) continue;
        const cercania = 1 - Math.sqrt(d2) / max;
        grupos[Math.min(2, Math.floor(cercania * 3))].push([a.x, a.y, b.x, b.y]);
        enlaces++;
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

/** Aceleración al salir y frenada al llegar. */
function suavizar(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
