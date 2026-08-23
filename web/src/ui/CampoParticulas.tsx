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
  disolviendo,
  onRevelar,
}: {
  plano: number;
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

    salientes.forEach((figura, i) => {
      relojes.push(
        window.setTimeout(() => {
          if (!cancelado) engine.disolver(figura.id);
        }, i * 70),
      );
    });

    return () => {
      cancelado = true;
      relojes.forEach(clearTimeout);
    };
  }, [disolviendo, figuras, reducido]);

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

    let plan: ReturnType<typeof planificarVista> | null = null;

    const paso = (indice: number) => {
      if (cancelado || !plan) return;
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
          temporizador = window.setTimeout(() => paso(indice + 1), 460);
        },
      });
    };

    /**
     * Las cajas no se pueden medir hasta que el plano ha terminado de deslizarse: entra
     * con un `translateX` de 3 rem, así que medir antes coloca las estrellas a medio
     * camino de donde acabará el texto.
     */
    const arrancar = () => {
      if (cancelado || plan) return;
      plan = planificarVista(figuras, engine.libres(), engine.esMovil());
      paso(0);
    };

    const activo = document.querySelector('.plano.is-activo');
    const alTerminar = (evento: Event) => {
      if ((evento as TransitionEvent).propertyName === 'transform') arrancar();
    };
    activo?.addEventListener('transitionend', alTerminar);
    // Respaldo: si el plano no llega a animarse, el evento no se dispara nunca.
    temporizador = window.setTimeout(arrancar, 820);

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
      activo?.removeEventListener('transitionend', alTerminar);
    };
  }, [plano, figuras, reducido, saltado]);

  return <canvas ref={canvas} className="campo" aria-hidden="true" />;
}
