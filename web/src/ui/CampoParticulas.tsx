import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../visuals/ParticleEngine';
import { muestrear, situar } from '../visuals/muestreo';

export interface Figura {
  id: string;
  d: string;
  /** Con hueco, la nube cede el sitio al SVG que aparece ahí. Sin él, se queda. */
  conHueco: boolean;
}

/**
 * El campo de estrellas, detrás de todo, y la cascada que forma las figuras del plano.
 *
 * Es materia, no interfaz: no captura clics ni gestos, y no añade nada que un lector de
 * pantalla se pueda perder. Con movimiento reducido no se arranca el bucle.
 *
 * ResizeObserver y no `window.resize`: en móvil, mostrar y ocultar la barra de
 * direcciones lo dispara constantemente.
 */
export function CampoParticulas({
  plano,
  figuras,
  reducido,
  saltado,
  onRevelar,
}: {
  plano: number;
  figuras: Figura[];
  reducido: boolean;
  saltado: boolean;
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
    else engine.iniciar();

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
      if (reducido) return;
      if (document.hidden) engine.detener();
      else engine.iniciar();
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
   * La cascada. Un solo enjambre recorre el plano: forma la figura de la primera pieza,
   * cede su sitio al trazo, y viaja a la siguiente.
   *
   * Cada pieza queda legible en cuanto termina la suya, así que la cascada no bloquea la
   * lectura aunque dure unos segundos.
   */
  useEffect(() => {
    const engine = motor.current;
    if (!engine) return;

    if (reducido) {
      figuras.forEach((f) => revelar.current(f.id));
      engine.pintarQuieto();
      return;
    }

    // El contenido ya está a la vista: el enjambre no tiene nada que anunciar y vuelve
    // a ser cielo en vez de seguir formando figuras sobre piezas ya visibles.
    if (saltado) {
      engine.liberar();
      return;
    }

    let cancelado = false;
    let temporizador: number | undefined;

    const cajaDe = (id: string) =>
      document.querySelector(`[data-figura="${id}"]`)?.getBoundingClientRect();

    const paso = (indice: number) => {
      if (cancelado) return;
      const figura = figuras[indice];

      if (!figura) {
        engine.liberar();
        return;
      }

      const nube = muestrear(figura.d);
      const cuantos = 240;

      // Primero en grande y en el centro. En el hueco de la tarjeta, que mide poco más
      // de cien píxeles, una figura hecha de estrellas no se lee: parecía un borrón.
      engine.formar(situar(nube, escenario(), cuantos), {
        duracion: 1500,
        alFormar: () => {
          if (cancelado) return;

          // Reposo: la figura se queda quieta el tiempo justo para leerse.
          temporizador = window.setTimeout(() => {
            if (cancelado) return;
            const caja = cajaDe(figura.id);

            // Y ahora se recoge a su sitio en la lista, donde cede al trazo.
            engine.formar(situar(nube, caja ?? escenario(), cuantos), {
              duracion: 900,
              ceder: figura.conHueco,
              mismasParticulas: true,
              alFormar: () => {
                if (cancelado) return;
                revelar.current(figura.id);
                temporizador = window.setTimeout(() => paso(indice + 1), 520);
              },
            });
          }, 620);
        },
      });
    };

    temporizador = window.setTimeout(() => paso(0), 320);

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [plano, figuras, reducido, saltado]);

  return <canvas ref={canvas} className="campo" aria-hidden="true" />;
}

/** Donde la figura se forma en grande, antes de recogerse a su sitio. */
function escenario(): DOMRect {
  const lado = Math.min(window.innerWidth, window.innerHeight) * 0.62;
  return new DOMRect((window.innerWidth - lado) / 2, (window.innerHeight - lado) / 2, lado, lado);
}
