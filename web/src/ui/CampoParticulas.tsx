import { useEffect, useRef } from 'react';
import { ParticleEngine, type Curva } from '../visuals/ParticleEngine';
import { planificarVista } from '../visuals/plan';

export interface Figura {
  id: string;
  /** La nube forma el rótulo del plano y cede a él. */
  tipo: 'rotulo';
}

/**
 * El campo de estrellas y la cascada que forma las figuras del plano.
 *
 * Es materia, no interfaz: no captura clics ni gestos, y no añade nada que un lector de
 * pantalla se pueda perder. Con movimiento reducido no se arranca el bucle.
 *
 * ResizeObserver y no `window.resize`: en móvil, mostrar y ocultar la barra de
 * direcciones lo dispara constantemente.
 */
export function CampoParticulas({
  plano,
  lang,
  figuras,
  reducido,
  saltado,
  disolviendo,
  onRevelar,
}: {
  plano: number;
  /** El texto que se muestrea cambia con el idioma, así que la cascada se rehace. */
  lang: string;
  figuras: Figura[];
  reducido: boolean;
  saltado: boolean;
  disolviendo: boolean;
  onRevelar: (id: string) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const motor = useRef<ParticleEngine | null>(null);
  const revelar = useRef(onRevelar);
  revelar.current = onRevelar;

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;

    const engine = new ParticleEngine(el);
    motor.current = engine;

    const medir = () => engine.redimensionar(window.innerWidth, window.innerHeight);
    medir();

    if (reducido) engine.pintarQuieto();

    let pendiente: number | undefined;
    const observador = new ResizeObserver(() => {
      clearTimeout(pendiente);
      pendiente = window.setTimeout(() => {
        medir();
        if (reducido) engine.pintarQuieto();
      }, 150);
    });
    observador.observe(document.documentElement);

    const alCambiarVisibilidad = () => {
      if (document.hidden) engine.detener();
      else if (!reducido) engine.iniciar();
    };
    document.addEventListener('visibilitychange', alCambiarVisibilidad);

    return () => {
      clearTimeout(pendiente);
      observador.disconnect();
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      engine.detener();
      motor.current = null;
    };
  }, [reducido]);

  /**
   * Lo que hay se rompe antes de irse: las partículas salen de los trazos que sostenían,
   * en orden inverso al de lectura, y quedan sueltas para formar el plano siguiente.
   */
  useEffect(() => {
    const engine = motor.current;
    if (!engine || !disolviendo || reducido) return;

    let cancelado = false;
    const salientes = [...figuras].reverse();
    const relojes: number[] = [];

    // Restos de vistas anteriores: se apagan antes de romper la actual, o se quedarían
    // dibujados hasta que algo repinte el canvas.
    engine.olvidar(figuras.map((f) => f.id));

    // La forma va por vista y no al azar: cada una se rompe siempre igual, así que el
    // recorrido tiene memoria, pero dos seguidas no se rompen del mismo modo.
    const modo = curvaDe(plano);

    salientes.forEach((figura, i) => {
      relojes.push(
        window.setTimeout(() => {
          if (!cancelado) engine.disolver(figura.id, modo);
        }, i * 70),
      );
    });

    return () => {
      cancelado = true;
      relojes.forEach(clearTimeout);
    };
  }, [disolviendo, figuras, reducido, plano]);

  /**
   * Las partículas van **directas al rótulo**: no hay figura intermedia en grande, se unen
   * ya sobre el texto definitivo, con su tipografía y su caja.
   */
  useEffect(() => {
    const engine = motor.current;
    if (!engine) return;

    if (reducido || saltado) {
      figuras.forEach((f) => revelar.current(f.id));
      engine.pintarQuieto();
      return;
    }

    let cancelado = false;
    let temporizador: number | undefined;

    let plan: ReturnType<typeof planificarVista> | null = null;

    const paso = (indice: number) => {
      if (cancelado || !plan) return;
      const pieza = plan.piezas[indice];
      // Fin de la cascada: lo que no llegó a formarse aparece igual, con su texto.
      if (!pieza) {
        figuras.forEach((f) => revelar.current(f.id));
        return;
      }

      engine.formar(pieza.destinos, {
        pieza: pieza.id,
        cuantas: pieza.cuantas,
        duracion: 1400,
        ceder: pieza.cede,
        curva: curvaDe(plano),
        alFormar: () => {
          if (cancelado) return;
          revelar.current(pieza.id);
          temporizador = window.setTimeout(() => paso(indice + 1), 460);
        },
      });
    };

    /** El plano ya no se desliza, así que basta con esperar a que esté pintado. */
    const arrancar = () => {
      if (cancelado || plan) return;
      // Sin esperar a la tipografía, el rótulo se muestrea con la fuente de reserva y las
      // estrellas dibujan una forma que no es la que después aparece.
      document.fonts.ready.then(() => {
        if (cancelado || plan) return;
        // Antes de formar nada, apagar lo que quedara de la vista anterior, incluido el
        // rótulo en el idioma que se acaba de dejar.
        engine.olvidar([]);
        // En una pantalla estrecha no hay materia para el rótulo y las cifras: se forma
        // el rótulo, y las piezas entran con su texto sin pasar por las estrellas.
        const materia = engine.materia();
        plan = planificarVista(materia < 600 ? figuras.slice(0, 1) : figuras, materia);
        paso(0);
      });
    };

    // Dos fotogramas: uno para que React monte y otro para que el navegador calcule la
    // disposición. Con eso las cajas ya son las definitivas.
    let cuadro = requestAnimationFrame(() => {
      cuadro = requestAnimationFrame(arrancar);
    });

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
      cancelAnimationFrame(cuadro);
    };
  }, [plano, lang, figuras, reducido, saltado]);

  return <canvas ref={canvas} className="campo" aria-hidden="true" />;
}

/** La forma del recorrido de cada vista. Fija por plano: el sitio tiene memoria. */
function curvaDe(plano: number): Curva {
  const FORMAS: Curva[] = ['ese', 'remolino', 'estallido'];
  return FORMAS[plano % FORMAS.length];
}
