import { useEffect, useRef } from 'react';
import { ParticleEngine, type Curva } from '../visuals/ParticleEngine';
import { planificarVista } from '../visuals/plan';

export interface Figura {
  id: string;
  tipo: 'rotulo';
}

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
  lang: string;
  figuras: Figura[];
  reducido: boolean;
  saltado: boolean;
  disolviendo: boolean;
  onRevelar: (id: string) => void;
}) {
  const lienzoMateria = useRef<HTMLCanvasElement>(null);
  const lienzoCielo = useRef<HTMLCanvasElement>(null);
  const motor = useRef<ParticleEngine | null>(null);
  const revelar = useRef(onRevelar);
  revelar.current = onRevelar;

  useEffect(() => {
    const el = lienzoMateria.current;
    const fondo = lienzoCielo.current;
    if (!el || !fondo) return;

    const engine = new ParticleEngine(el, fondo);
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

  useEffect(() => {
    const engine = motor.current;
    if (!engine || !disolviendo || reducido) return;

    let cancelado = false;
    const salientes = [...figuras].reverse();
    const relojes: number[] = [];

    engine.olvidar(figuras.map((f) => f.id));

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

    const arrancar = () => {
      if (cancelado || plan) return;
      document.fonts.ready.then(() => {
        if (cancelado || plan) return;
        engine.olvidar([]);
        const materia = engine.materia();
        plan = planificarVista(materia < 600 ? figuras.slice(0, 1) : figuras, materia);
        paso(0);
      });
    };

    let cuadro = requestAnimationFrame(() => {
      cuadro = requestAnimationFrame(arrancar);
    });

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
      cancelAnimationFrame(cuadro);
    };
  }, [plano, lang, figuras, reducido, saltado]);

  return (
    <>
      <canvas ref={lienzoCielo} className="campo campo--cielo" aria-hidden="true" />
      <canvas ref={lienzoMateria} className="campo campo--materia" aria-hidden="true" />
    </>
  );
}

function curvaDe(plano: number): Curva {
  const FORMAS: Curva[] = ['ese', 'remolino', 'estallido'];
  return FORMAS[plano % FORMAS.length];
}
