import { useCallback, useEffect, useState } from 'react';
import { PLANOS, planoDesdeHash } from '../page/planos';

const CLAVE_MODO = 'wm.modo';

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
  /** +1 avanzando, -1 retrocediendo: el plano entra y sale por el lado que le toca. */
  const [sentido, setSentido] = useState<1 | -1>(1);
  const [documento, setDocumento] = useState<boolean>(() => {
    const guardado = localStorage.getItem(CLAVE_MODO);
    if (guardado === 'documento') return true;
    if (guardado === 'observatorio') return false;
    return false;
  });

  // El ajuste del sistema manda mientras el visitante no haya elegido: si pidió menos
  // movimiento, entra en modo documento sin tener que descubrir el conmutador.
  useEffect(() => {
    if (reducido && localStorage.getItem(CLAVE_MODO) === null) setDocumento(true);
  }, [reducido]);

  // Ir hacia atrás en el navegador devuelve al plano anterior, que es lo que espera
  // cualquiera que haya llegado por un enlace directo.
  useEffect(() => {
    const alCambiarHash = () => setPlano(planoDesdeHash(window.location.hash));
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  const irA = useCallback((indice: number) => {
    const destino = Math.max(0, Math.min(PLANOS.length - 1, indice));
    setPlano((actual) => {
      if (destino !== actual) setSentido(destino > actual ? 1 : -1);
      return destino;
    });
    // replaceState y no `location.hash = …`: cambiar el hash apila una entrada por cada
    // plano visitado, y entonces el botón «atrás» del navegador obliga a recorrer siete
    // veces la narración para salir de la página.
    history.replaceState(null, '', `#/${PLANOS[destino].id}`);
  }, []);

  const conmutarModo = useCallback(() => {
    setDocumento((actual) => {
      localStorage.setItem(CLAVE_MODO, actual ? 'observatorio' : 'documento');
      return !actual;
    });
  }, []);

  // Flechas y AvPág/RePág para moverse entre planos. No se capturan si el foco está en un
  // campo de texto (el chat) ni con un modificador pulsado: ahí las flechas son del
  // visitante, no de la narración.
  useEffect(() => {
    if (documento) return;

    const alPulsar = (evento: KeyboardEvent) => {
      const destino = evento.target as HTMLElement | null;
      if (destino?.closest('input, textarea, [contenteditable], [role="dialog"]')) return;
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return;

      if (evento.key === 'ArrowRight' || evento.key === 'PageDown') {
        evento.preventDefault();
        irA(plano + 1);
      } else if (evento.key === 'ArrowLeft' || evento.key === 'PageUp') {
        evento.preventDefault();
        irA(plano - 1);
      }
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [plano, documento, irA]);

  return { plano, sentido, irA, documento, conmutarModo, reducido };
}
