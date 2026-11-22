import { useCallback, useEffect, useRef, useState } from 'react';
import { guardar, leer } from '../lib/almacen';
import { PLANOS, planoDesdeHash } from '../page/planos';

const CLAVE_MODO = 'wm.modo';
const DISOLUCION = 240;
const UMBRAL_GESTO = 60;
const SIN_GESTO = 'input, textarea, [contenteditable], [role="dialog"], .hud';

const consultaReducido = () => window.matchMedia('(prefers-reduced-motion: reduce)');

function useMovimientoReducido() {
  const [reducido, setReducido] = useState(() => consultaReducido().matches);

  useEffect(() => {
    const mq = consultaReducido();
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);

  return reducido;
}

function planoInicial(): number {
  const indice = planoDesdeHash(window.location.hash);
  if (window.location.hash && `#/${PLANOS[indice].id}` !== window.location.hash) {
    history.replaceState(null, '', `#/${PLANOS[indice].id}`);
  }
  return indice;
}

export function useObservatorio() {
  const reducido = useMovimientoReducido();

  const [plano, setPlano] = useState(planoInicial);
  const [pedido, setPedido] = useState(plano);
  const [sentido, setSentido] = useState<1 | -1>(1);
  const [documento, setDocumento] = useState<boolean>(() => {
    const guardado = leer(CLAVE_MODO);
    if (guardado === 'documento') return true;
    if (guardado === 'observatorio') return false;
    return consultaReducido().matches;
  });

  const cambio = useRef<number | undefined>(undefined);
  const actual = useRef(pedido);
  const enDocumento = useRef(documento);
  enDocumento.current = documento;

  useEffect(() => {
    if (leer(CLAVE_MODO) === null) setDocumento(reducido);
  }, [reducido]);

  const irA = useCallback(
    (indice: number) => {
      const destino = Math.max(0, Math.min(PLANOS.length - 1, indice));
      if (`#/${PLANOS[destino].id}` !== window.location.hash) {
        history.replaceState(null, '', `#/${PLANOS[destino].id}`);
      }
      clearTimeout(cambio.current);

      if (enDocumento.current) {
        actual.current = destino;
        setPedido(destino);
        setPlano(destino);
        document
          .getElementById(PLANOS[destino].id)
          ?.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
        return;
      }

      if (destino === actual.current) return;
      setSentido(destino > actual.current ? 1 : -1);
      actual.current = destino;
      setPedido(destino);
      cambio.current = window.setTimeout(() => setPlano(destino), DISOLUCION);
    },
    [reducido],
  );

  useEffect(() => () => clearTimeout(cambio.current), []);

  useEffect(() => {
    const alCambiarHash = () => irA(planoDesdeHash(window.location.hash));
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, [irA]);

  const conmutarModo = useCallback(() => {
    setDocumento((estaba) => {
      guardar(CLAVE_MODO, estaba ? 'observatorio' : 'documento');
      return !estaba;
    });
  }, []);

  useEffect(() => {
    if (!documento) return;
    const secciones = PLANOS.map((p) => document.getElementById(p.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((e) => e.isIntersecting);
        if (!visible) return;
        const indice = PLANOS.findIndex((p) => p.id === visible.target.id);
        if (indice === -1 || indice === actual.current) return;
        actual.current = indice;
        setPedido(indice);
        setPlano(indice);
        history.replaceState(null, '', `#/${PLANOS[indice].id}`);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    secciones.forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, [documento]);

  useEffect(() => {
    if (documento) return;

    const alPulsar = (evento: KeyboardEvent) => {
      const destino = evento.target as HTMLElement | null;
      if (destino?.closest('input, textarea, [contenteditable], [role="dialog"]')) return;
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return;

      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        irA(actual.current + 1);
      } else if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        irA(actual.current - 1);
      }
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [documento, irA]);

  useEffect(() => {
    if (documento) return;

    let x0 = 0;
    let y0 = 0;
    let sigue = false;

    const alTocar = (evento: TouchEvent) => {
      const dedo = evento.touches[0];
      const destino = evento.target as HTMLElement | null;
      sigue = evento.touches.length === 1 && !destino?.closest(SIN_GESTO);
      if (!sigue || !dedo) return;
      x0 = dedo.clientX;
      y0 = dedo.clientY;
    };

    const alSoltar = (evento: TouchEvent) => {
      const dedo = evento.changedTouches[0];
      if (!sigue || !dedo) return;
      sigue = false;
      const dx = dedo.clientX - x0;
      const dy = dedo.clientY - y0;
      if (Math.abs(dx) < UMBRAL_GESTO || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      irA(actual.current + (dx < 0 ? 1 : -1));
    };

    window.addEventListener('touchstart', alTocar, { passive: true });
    window.addEventListener('touchend', alSoltar, { passive: true });
    return () => {
      window.removeEventListener('touchstart', alTocar);
      window.removeEventListener('touchend', alSoltar);
    };
  }, [documento, irA]);

  return { plano, pedido, sentido, irA, documento, conmutarModo, reducido };
}
