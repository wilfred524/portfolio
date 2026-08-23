import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../visuals/ParticleEngine';
import { muestrear, puntosNecesarios, situar } from '../visuals/muestreo';

export interface Figura {
  id: string;
  d: string;
  /** Con hueco, la nube cede el sitio al SVG que aparece ahí. Sin él, se queda. */
  conHueco: boolean;
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
   * La cascada. Las partículas van **directas al hueco de cada pieza**: no hay figura
   * intermedia en grande, se unen ya en el componente final.
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

    const cajaDe = (id: string) =>
      document.querySelector(`[data-figura="${id}"]`)?.getBoundingClientRect();

    const paso = (indice: number) => {
      if (cancelado) return;
      const figura = figuras[indice];
      if (!figura) return;

      const caja = cajaDe(figura.id) ?? cuerpoDelPlano();
      const nube = muestrear(figura.d);
      // Sin hueco la nube ES la figura definitiva, así que necesita densidad de imagen y
      // no de esbozo: ahí no hay ningún trazo que la remate.
      const cuantas = figura.conHueco ? puntosNecesarios(nube, caja) : 240;

      engine.formar(situar(nube, caja, cuantas), {
        pieza: figura.id,
        cuantas,
        duracion: 1100,
        ceder: figura.conHueco,
        alFormar: () => {
          if (cancelado) return;
          revelar.current(figura.id);
          temporizador = window.setTimeout(() => paso(indice + 1), 220);
        },
      });
    };

    // Margen para que las cajas del plano que entra estén ya colocadas.
    temporizador = window.setTimeout(() => paso(0), 320);

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [plano, figuras, reducido, saltado]);

  return <canvas ref={canvas} className="campo" aria-hidden="true" />;
}

/** Caja cuadrada sobre el texto del plano activo, para las figuras sin hueco propio. */
function cuerpoDelPlano(): DOMRect {
  const cuerpo = document.querySelector('.plano.is-activo .plano__cuerpo');
  const caja = cuerpo?.getBoundingClientRect();
  const ancho = window.innerWidth;
  const alto = window.innerHeight;

  if (!caja || caja.width === 0) {
    const lado = Math.min(ancho, alto) * 0.55;
    return new DOMRect((ancho - lado) / 2, (alto - lado) / 2, lado, lado);
  }

  const lado = Math.min(caja.width, caja.height, Math.min(ancho, alto) * 0.62);
  return new DOMRect(
    caja.left + (caja.width - lado) / 2,
    caja.top + (caja.height - lado) / 2,
    lado,
    lado,
  );
}
