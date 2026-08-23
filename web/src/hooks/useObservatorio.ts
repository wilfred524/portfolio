import { useCallback, useEffect, useRef, useState } from 'react';
import { PLANOS, planoDesdeHash } from '../page/planos';

const CLAVE_MODO = 'wm.modo';
/**
 * Lo que tarda en confirmarse un cambio de plano. Es el hueco en el que lo que había se
 * rompe en estrellas: si el DOM se moviera antes, las partículas saldrían de donde el
 * contenido ya no está.
 */
const DISOLUCION = 420;

/**
 * Detecta si el visitante pidió menos movimiento, y **sigue escuchando**: el ajuste del
 * sistema se puede cambiar con la página abierta, y leerlo una sola vez al montar deja al
 * sitio animándose para alguien que acaba de pedir que no lo haga.
 */
export function useMovimientoReducido() {
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

/**
 * Navegación del observatorio: qué plano está activo y en qué modo se lee la página.
 *
 * El modo documento apila los planos con scroll, para buscar con Ctrl+F o imprimir.
 * El plano activo vive en el hash para poder enviar un enlace directo a un plano.
 */
export function useObservatorio() {
  const reducido = useMovimientoReducido();

  const [plano, setPlano] = useState(() => planoDesdeHash(window.location.hash));
  /** El plano pedido. Marca el HUD desde el clic, sin esperar a la disolución. */
  const [pedido, setPedido] = useState(plano);
  const cambio = useRef<number | undefined>(undefined);
  /** +1 avanzando, -1 retrocediendo: el plano entra y sale por el lado que le toca. */
  const [sentido, setSentido] = useState<1 | -1>(1);
  const [documento, setDocumento] = useState<boolean>(() => {
    const guardado = localStorage.getItem(CLAVE_MODO);
    if (guardado === 'documento') return true;
    if (guardado === 'observatorio') return false;
    return false;
  });

  // El ajuste del sistema manda mientras el visitante no haya elegido.
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
    // replaceState: con `location.hash` cada plano apilaría una entrada de historial y
    // salir de la página costaría siete pulsaciones de «atrás».
    history.replaceState(null, '', `#/${PLANOS[destino].id}`);

    // Re-apuntar durante la disolución es barato: se cancela el cambio anterior y se
    // confirma el nuevo. Nunca hay dos transiciones encoladas.
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

  // Las flechas no se capturan dentro de un campo de texto ni con un modificador: ahí
  // son del visitante, no de la narración.
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

  return { plano, pedido, sentido, irA, documento, conmutarModo, reducido };
}
