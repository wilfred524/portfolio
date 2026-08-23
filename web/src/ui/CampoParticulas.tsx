import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../visuals/ParticleEngine';

/**
 * El campo de estrellas, detrás de todo.
 *
 * `pointer-events: none` y `aria-hidden`: es materia, no interfaz. No captura clics ni
 * gestos táctiles, y no añade nada que un lector de pantalla se pueda perder.
 *
 * Con movimiento reducido no se arranca el bucle: se pinta un fotograma asentado y ya.
 * Misma imagen, coste cero.
 */
export function CampoParticulas({ plano, reducido }: { plano: number; reducido: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const motor = useRef<ParticleEngine | null>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;

    const engine = new ParticleEngine(el);
    motor.current = engine;

    const medir = () => engine.redimensionar(window.innerWidth, window.innerHeight);
    medir();

    if (reducido) {
      engine.pintarQuieto();
    } else {
      engine.iniciar();
    }

    // ResizeObserver sobre el documento y no `window.resize`: en móvil, mostrar y ocultar
    // la barra de direcciones dispara resize constantemente.
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

  // Cambiar de plano lanza el viaje. Con movimiento reducido se reasienta sin animar.
  useEffect(() => {
    const engine = motor.current;
    if (!engine) return;
    if (reducido) engine.pintarQuieto();
    else engine.formar();
  }, [plano, reducido]);

  return <canvas ref={canvas} className="campo" aria-hidden="true" />;
}
