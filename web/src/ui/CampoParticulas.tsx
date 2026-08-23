import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../visuals/ParticleEngine';
import { planificarVista } from '../visuals/plan';

export interface Figura {
  id: string;
  /**
   * `pieza`: la nube forma la figura de un proyecto en su hueco y cede al trazo.
   * `texto`: la nube rellena los bloques de texto del plano y cede a las palabras.
   */
  tipo: 'pieza' | 'texto';
  /** Geometría de la figura, solo para las de tipo `pieza`. */
  d?: string;
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

    // Toda la vista se calcula de una vez, antes de mover nada: cuántas partículas lleva
    // cada figura y cuál es el volumen total de la transición.
    const plan = planificarVista(figuras, engine.libres(), engine.esMovil());

    const paso = (indice: number) => {
      if (cancelado) return;
      const pieza = plan.piezas[indice];
      if (!pieza) return;

      engine.formar(pieza.destinos, {
        pieza: pieza.id,
        cuantas: pieza.cuantas,
        duracion: 1100,
        ceder: pieza.cede,
        alFormar: () => {
          if (cancelado) return;
          revelar.current(pieza.id);
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
