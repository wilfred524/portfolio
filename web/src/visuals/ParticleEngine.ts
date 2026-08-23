/**
 * Campo de partículas del observatorio. Canvas 2D, sin librería y sin React dentro: el
 * bucle de fotogramas no pasa por el estado de React.
 *
 * **El campo no se mueve solo.** En reposo es una imagen fija y el bucle está detenido.
 *
 * Una partícula que sale del fondo **no vuelve nunca**: al fundirse en una pieza queda
 * anclada a su punto (`latente`), lista para volver a salir cuando esa pieza se disuelva.
 * El fondo se repone dando de alta partículas nuevas, no reciclando las usadas.
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

export type Estado = 'fondo' | 'viaje' | 'asentada' | 'latente' | 'dispersa';

interface Particula {
  x: number;
  y: number;
  px: number;
  py: number;
  /** Origen y destino del viaje en curso. */
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  curva: number;
  retardo: number;
  radio: number;
  brillo: number;
  /** Multiplicador de opacidad, para aparecer y para ceder al trazo. */
  alfa: number;
  estado: Estado;
  /** A qué pieza pertenece mientras está asentada o latente. */
  pieza: string | null;
}

const MAX_DT = 32;
const MAX_ENLACE = 130;
const ESTELA = 5;

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprite: HTMLCanvasElement;
  private particulas: Particula[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private capacidad = 0;
  private raf: number | null = null;
  private ultimo = 0;
  private viaje = 1;
  private duracion = 1200;
  private fundido = 1;
  private cede = false;
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
    this.capacidad = movil
      ? Math.max(140, Math.min(200, Math.round((ancho * alto) / 3600)))
      : Math.max(240, Math.min(460, Math.round((ancho * alto) / 3200)));

    this.poblar();
    this.pintar();
  }

  /**
   * Reparte el fondo por una rejilla con desplazamiento aleatorio dentro de cada celda.
   * Con `Math.random()` puro las estrellas se agrupan y media pantalla queda vacía.
   */
  private poblar() {
    const objetivo = this.capacidad;
    const columnas = Math.max(1, Math.round(Math.sqrt((objetivo * this.w) / this.h)));
    const filas = Math.max(1, Math.ceil(objetivo / columnas));
    const anchoCelda = this.w / columnas;
    const altoCelda = this.h / filas;

    const nuevas: Particula[] = [];
    for (let f = 0; f < filas && nuevas.length < objetivo; f++) {
      for (let c = 0; c < columnas && nuevas.length < objetivo; c++) {
        const x = (c + 0.15 + Math.random() * 0.7) * anchoCelda;
        const y = (f + 0.15 + Math.random() * 0.7) * altoCelda;
        nuevas.push(this.nacer(x, y, nuevas.length));
      }
    }

    // Las que ya estaban en una pieza no se tiran: siguen ancladas a su punto.
    const enPiezas = this.particulas.filter((p) => p.estado === 'latente' || p.estado === 'asentada');
    this.particulas = [...nuevas, ...enPiezas];
  }

  /** Punto del perímetro para un recorrido de 0 a 1, con margen fuera de pantalla. */
  private enPerimetro(t: number): [number, number] {
    const m = 24;
    const perimetro = 2 * (this.w + this.h);
    const d = t * perimetro;
    if (d < this.w) return [d, -m];
    if (d < this.w + this.h) return [this.w + m, d - this.w];
    if (d < 2 * this.w + this.h) return [2 * this.w + this.h - d, this.h + m];
    return [-m, perimetro - d];
  }

  private nacer(x: number, y: number, indice: number): Particula {
    const grande = indice % 9 === 0;
    return {
      x,
      y,
      px: x,
      py: y,
      ox: x,
      oy: y,
      tx: x,
      ty: y,
      curva: 0,
      retardo: 0,
      radio: grande ? 1.4 + Math.random() * 0.4 : 0.8 + Math.random() * 0.3,
      brillo: grande ? 0.45 + Math.random() * 0.25 : 0.24 + Math.random() * 0.2,
      alfa: 1,
      estado: 'fondo',
      pieza: null,
    };
  }

  /**
   * Manda a viajar hacia los puntos de una figura.
   *
   * El reclutamiento es **repartido por toda la pantalla**, no por cercanía: tomar las más
   * próximas vacía esa zona y el cielo acaba apelmazado en un lado. El emparejamiento con
   * los destinos sí va por ángulo, que es lo que evita que las trayectorias se crucen.
   */
  formar(
    puntos: Punto[],
    opciones: {
      pieza: string;
      cuantas: number;
      duracion?: number;
      ceder?: boolean;
      alFormar?: () => void;
    },
  ) {
    // Cierra el fundido que quedara a medias: si no, las partículas de la pieza anterior
    // se quedan visibles encima de su propio trazo para siempre.
    for (const p of this.particulas) {
      if (p.estado === 'asentada' && p.pieza && this.cede) p.estado = 'latente';
    }

    const necesarias = Math.min(opciones.cuantas, puntos.length);
    const elegidas: number[] = [];

    /**
     * Un solo enjambre recorre el sitio. Primero se echa mano de la materia que ya está
     * en juego —la que sostiene las piezas ya hechas, que sale de sus trazos— y solo si
     * no basta se toca el cielo. Así el volumen no crece plano a plano.
     */
    const enJuego = this.particulas
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.estado === 'latente' || p.estado === 'dispersa')
      // Primero las que acaban de salir de un trazo, que son las que se está viendo
      // viajar; la reserva apagada solo entra si no basta.
      .sort((a, b) => Number(b.p.estado === 'dispersa') - Number(a.p.estado === 'dispersa'));

    for (const { p, i } of enJuego) {
      if (elegidas.length >= necesarias) break;
      // Vuelve a hacerse visible saliendo de donde estaba: del trazo que sostenía.
      if (p.estado === 'latente') p.alfa = 0;
      elegidas.push(i);
    }

    const cielo = this.particulas
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.estado === 'fondo')
      // Orden de barrido: al tomar uno de cada N, el reparto cubre la pantalla entera.
      .sort((a, b) => a.p.y + a.p.x * 0.35 - (b.p.y + b.p.x * 0.35));

    const delCielo = Math.min(necesarias - elegidas.length, cielo.length);
    for (let i = 0; i < delCielo; i++) {
      // Índice proporcional y no un salto entero: con el salto redondeado a 1 se tomaban
      // las primeras del orden de barrido, o sea toda una esquina de la pantalla.
      elegidas.push(cielo[Math.floor((i * cielo.length) / delCielo)].i);
    }

    // Si el fondo no da para tanto, entran nuevas por el borde en vez de robar más cielo.
    // Repartidas por todo el perímetro y no siempre por el mismo lado, o el conjunto
    // entero parece venir del mismo sitio en cada transición.
    const faltan = necesarias - elegidas.length;
    const arranque = Math.random();
    for (let n = 0; n < faltan; n++) {
      const t = (arranque + n / Math.max(1, faltan)) % 1;
      const p = this.nacer(...this.enPerimetro(t), this.particulas.length);
      p.alfa = 0;
      this.particulas.push(p);
      elegidas.push(this.particulas.length - 1);
    }

    const destinos = this.repartir(puntos, elegidas.length);
    const cx = destinos.reduce((a, p) => a + p.x, 0) / destinos.length;
    const cy = destinos.reduce((a, p) => a + p.y, 0) / destinos.length;
    this.asignar(elegidas, destinos, cx, cy, opciones.pieza);

    // La materia que no entra en esta figura se apaga y queda en reserva. Dejarla a la
    // vista la acumulaba por encima de todo transición tras transición, y era lo que
    // ensuciaba la figura recién formada.
    const usadas = new Set(elegidas);
    this.particulas.forEach((p, i) => {
      if (usadas.has(i)) return;
      if (p.estado === 'dispersa' || (p.estado === 'asentada' && p.pieza === null)) {
        p.estado = 'latente';
        p.pieza = null;
      }
    });

    this.viaje = 0;
    this.fundido = 0;
    this.duracion = opciones.duracion ?? 1200;
    this.cede = opciones.ceder ?? false;
    this.alFormar = opciones.alFormar ?? null;
    this.iniciar();
  }

  /**
   * Devuelve el cielo a su densidad dando de alta partículas nuevas, no reciclando las
   * usadas: una recién nacida sí es de las que nunca se han movido.
   *
   * Se colocan en las celdas con menos estrellas, o el cielo se repone donde ya había y
   * las zonas que la figura vació se quedan vacías para siempre.
   */
  private reponerFondo() {
    const fondo = this.particulas.filter((p) => p.estado === 'fondo');
    const faltan = this.capacidad - fondo.length;
    if (faltan <= 0) return;

    const columnas = Math.max(1, Math.round(Math.sqrt((this.capacidad * this.w) / this.h)));
    const filas = Math.max(1, Math.ceil(this.capacidad / columnas));
    const anchoCelda = this.w / columnas;
    const altoCelda = this.h / filas;

    const censo = new Map<number, number>();
    for (const p of fondo) {
      const c = Math.min(columnas - 1, Math.max(0, Math.floor(p.x / anchoCelda)));
      const f = Math.min(filas - 1, Math.max(0, Math.floor(p.y / altoCelda)));
      const celda = f * columnas + c;
      censo.set(celda, (censo.get(celda) ?? 0) + 1);
    }

    const vacias = Array.from({ length: columnas * filas }, (_, i) => i)
      .map((i) => ({ i, n: censo.get(i) ?? 0 }))
      .sort((a, b) => a.n - b.n)
      .slice(0, faltan);

    for (const { i } of vacias) {
      const c = i % columnas;
      const f = Math.floor(i / columnas);
      const p = this.nacer(
        (c + 0.15 + Math.random() * 0.7) * anchoCelda,
        (f + 0.15 + Math.random() * 0.7) * altoCelda,
        this.particulas.length,
      );
      p.alfa = 0;
      this.particulas.push(p);
    }
  }

  /** Cuántas partículas pueden entrar en una figura ahora mismo. */
  libres() {
    return this.particulas.filter((p) => p.estado === 'fondo' || p.estado === 'dispersa').length;
  }

  esMovil() {
    return this.w < 768;
  }

  /** Rompe una pieza: sus partículas reaparecen sobre el trazo y se dispersan. */
  disolver(pieza: string) {
    let alguna = false;
    for (const p of this.particulas) {
      if (p.pieza !== pieza) continue;
      alguna = true;
      p.estado = 'dispersa';
      p.pieza = null;
      // Aparece justo donde estaba el trazo, que a la vez se está yendo: el ojo lee que
      // el dibujo se granuló, no que una cosa se fue y otra llegó.
      p.alfa = 0;
    }
    if (alguna) this.iniciar();
  }

  private asignar(indices: number[], destinos: Punto[], cx: number, cy: number, pieza: string) {
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
      p.estado = 'viaje';
      p.pieza = pieza;
      // Una sola comba para todo el grupo: si cada partícula elige la suya, el conjunto
      // es ruido en vez de una masa que se pliega.
      p.curva = 0.12;
      // El retardo sale del puesto en el contorno, no del azar: la figura se traza.
      p.retardo = 0.22 * (puesto / orden.length);
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
    return this.particulas.some((p) => p.estado === 'dispersa' || p.alfa < 1);
  }

  iniciar() {
    if (this.raf !== null) return;
    this.ultimo = performance.now();
    const paso = (ahora: number) => {
      const dt = Math.min(ahora - this.ultimo, MAX_DT);
      this.ultimo = ahora;
      this.actualizar(dt);
      this.pintar();
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

  /** Deja todo asentado y lo pinta una vez: es lo que se ve con movimiento reducido. */
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
      if (p.estado === 'viaje') p.estado = this.cede && p.pieza ? 'latente' : 'asentada';
      if (p.estado === 'asentada' && p.pieza && this.cede) p.estado = 'latente';
      if (p.estado === 'dispersa') p.estado = 'fondo';
    }
    this.pintar();
  }

  private actualizar(dt: number) {
    if (this.viaje < 1) {
      this.viaje = Math.min(1, this.viaje + dt / this.duracion);
      if (this.viaje >= 1) {
        for (const p of this.particulas) if (p.estado === 'viaje') p.estado = 'asentada';
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
        this.reponerFondo();
      }
    }

    for (const p of this.particulas) {
      p.px = p.x;
      p.py = p.y;
      if (p.alfa < 1) p.alfa = Math.min(1, p.alfa + dt / 700);

      if (p.estado === 'viaje') {
        const t = suavizar(Math.max(0, (this.viaje - p.retardo) / (1 - p.retardo)));
        const dx = p.tx - p.ox;
        const dy = p.ty - p.oy;
        p.x = p.ox + dx * t;
        p.y = p.oy + dy * t + Math.sin(t * Math.PI) * dx * p.curva;
      } else if (p.estado === 'dispersa') {
        // Deriva suave hasta que alguien la recluta.
        p.x += Math.cos(p.retardo * 12) * 0.35;
        p.y += Math.sin(p.retardo * 9) * 0.25;
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
      if (p.estado === 'latente') continue;
      const cesion = p.estado === 'asentada' && p.pieza && this.cede ? 1 - this.fundido : 1;
      const alfa = Math.max(0, Math.min(1, p.brillo * cesion * p.alfa));
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
      if (p.estado === 'latente') continue;
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

  /**
   * Constelación: solo entre las de fondo. Así se distingue de un vistazo qué es cielo y
   * qué es materia en tránsito, y de paso el bucle más caro solo recorre el fondo.
   */
  private pintarLineas() {
    const { ctx } = this;
    const max2 = MAX_ENLACE * MAX_ENLACE;
    const grupos: [number, number, number, number][][] = [[], [], []];

    const cols = Math.max(1, Math.ceil(this.w / MAX_ENLACE));
    const filas = Math.max(1, Math.ceil(this.h / MAX_ENLACE));
    const celdas: number[][] = Array.from({ length: cols * filas }, () => []);
    const columna = (p: Particula) => Math.min(cols - 1, Math.max(0, Math.floor(p.x / MAX_ENLACE)));
    const fila = (p: Particula) => Math.min(filas - 1, Math.max(0, Math.floor(p.y / MAX_ENLACE)));

    const fondo = this.particulas
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.estado === 'fondo');
    fondo.forEach(({ p, i }) => celdas[fila(p) * cols + columna(p)].push(i));

    for (const { p: a, i } of fondo) {
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
