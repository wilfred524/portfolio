import type { Figura } from '../ui/CampoParticulas';
import { puntosDeTexto } from './muestreo';
import type { Punto } from './ParticleEngine';

interface PiezaPlanificada {
  id: string;
  cuantas: number;
  destinos: Punto[];
  cede: boolean;
}

interface PlanVista {
  piezas: PiezaPlanificada[];
  total: number;
}

const HOLGURA = 0.6;
const POR_GLIFO = 70;
const SUELO = 24;

export function planificarVista(figuras: Figura[], materia: number): PlanVista {
  if (figuras.length === 0) return { piezas: [], total: 0 };

  const cuotas = figuras.map((f) => Math.max(SUELO, pesoDe(f) * POR_GLIFO));
  let exceso = cuotas.reduce((a, c) => a + c, 0) - materia;

  while (exceso > 0) {
    let mayor = 0;
    for (let i = 1; i < cuotas.length; i++) if (cuotas[i] > cuotas[mayor]) mayor = i;
    if (cuotas[mayor] <= SUELO) break;
    const siguiente = cuotas.reduce((a, c, i) => (i === mayor ? a : Math.max(a, c)), SUELO);
    const quita = Math.max(1, Math.min(exceso, cuotas[mayor] - siguiente));
    cuotas[mayor] -= quita;
    exceso -= quita;
  }

  const piezas = figuras.map((figura, i) => planificarRotulo(figura, cuotas[i]));
  return { piezas, total: piezas.reduce((a, p) => a + p.cuantas, 0) };
}

function pesoDe(figura: Figura): number {
  const el = document.querySelector<HTMLElement>(`[data-figura="${figura.id}"]`);
  const largo = (el?.textContent ?? '').replace(/\s/g, '').length || 2;
  return largo;
}

function planificarRotulo(figura: Figura, cuota: number): PiezaPlanificada {
  const el = document.querySelector<HTMLElement>(`[data-figura="${figura.id}"]`);
  if (!el) return { id: figura.id, cuantas: 0, destinos: [], cede: true };

  const destinos = puntosDeTexto(el, Math.round(cuota * (1 + HOLGURA)));
  return { id: figura.id, cuantas: Math.min(cuota, destinos.length), destinos, cede: true };
}
