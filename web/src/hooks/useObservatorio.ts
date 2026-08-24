import { useCallback, useEffect, useRef, useState } from 'react';
import { PLANOS, planoDesdeHash } from '../page/planos';

const CLAVE_MODO = 'wm.modo';
const DISOLUCION = 240;
const UMBRAL_GESTO = 60;

function useMovimientoReducido() {
  const [reducido, setReducido] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);

  return reducido;
}

export function useObservatorio() {
  const reducido = useMovimientoReducido();

  const [plano, setPlano] = useState(() => planoDesdeHash(window.location.hash));
  const [pedido, setPedido] = useState(plano);
  const cambio = useRef<number | undefined>(undefined);
  const [sentido, setSentido] = useState<1 | -1>(1);
  const [documento, setDocumento] = useState<boolean>(() => {
    const guardado = localStorage.getItem(CLAVE_MODO);
    if (guardado === 'documento') return true;
    if (guardado === 'observatorio') return false;
    return false;
  });

  useEffect(() => {
    if (reducido && localStorage.getItem(CLAVE_MODO) === null) setDocumento(true);
  }, [reducido]);

  useEffect(() => {
    const alCambiarHash = () => {
      const destino = planoDesdeHash(window.location.hash);
      setPedido(destino);
      setPlano(destino);
    };
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  const irA = useCallback((indice: number) => {
    const destino = Math.max(0, Math.min(PLANOS.length - 1, indice));
    setPedido((actual) => {
      if (destino !== actual) setSentido(destino > actual ? 1 : -1);
      return destino;
    });
    history.replaceState(null, '', `#/${PLANOS[destino].id}`);

    clearTimeout(cambio.current);
    cambio.current = window.setTimeout(() => setPlano(destino), DISOLUCION);
  }, []);

  useEffect(() => () => clearTimeout(cambio.current), []);

  const conmutarModo = useCallback(() => {
    setDocumento((actual) => {
      localStorage.setItem(CLAVE_MODO, actual ? 'observatorio' : 'documento');
      return !actual;
    });
  }, []);

  useEffect(() => {
    if (documento) return;

    const alPulsar = (evento: KeyboardEvent) => {
      const destino = evento.target as HTMLElement | null;
      if (destino?.closest('input, textarea, [contenteditable], [role="dialog"]')) return;
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return;

      if (evento.key === 'ArrowRight' || evento.key === 'PageDown') {
        evento.preventDefault();
        irA(pedido + 1);
      } else if (evento.key === 'ArrowLeft' || evento.key === 'PageUp') {
        evento.preventDefault();
        irA(pedido - 1);
      }
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [pedido, documento, irA]);

  useEffect(() => {
    if (documento) return;

    let x0 = 0;
    let y0 = 0;
    let sigue = false;

    const alTocar = (evento: TouchEvent) => {
      const dedo = evento.touches[0];
      const destino = evento.target as HTMLElement | null;
      sigue =
        evento.touches.length === 1 &&
        !destino?.closest('input, textarea, [contenteditable], [role="dialog"]');
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
      irA(pedido + (dx < 0 ? 1 : -1));
    };

    window.addEventListener('touchstart', alTocar, { passive: true });
    window.addEventListener('touchend', alSoltar, { passive: true });
    return () => {
      window.removeEventListener('touchstart', alTocar);
      window.removeEventListener('touchend', alSoltar);
    };
  }, [pedido, documento, irA]);

  return { plano, pedido, sentido, irA, documento, conmutarModo, reducido };
}
