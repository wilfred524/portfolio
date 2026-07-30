import { useEffect, useRef } from 'react';

/**
 * Parallax tipográfico ligado al scroll (fallback JS).
 *
 * Mecanismo híbrido: si el navegador soporta CSS scroll-driven animations
 * (`animation-timeline`), el CSS se encarga y este hook NO hace nada. En Safari/
 * Firefox (sin soporte) adjunta un listener de scroll — coalescido con
 * requestAnimationFrame — y actualiza una variable CSS `--slide` en rango [-1, 1]
 * según el progreso del elemento por el viewport (arriba = 1, centro = 0, abajo = -1),
 * que el CSS traduce a un translateX. Respeta `prefers-reduced-motion`.
 */
export function useScrollSlide<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const supportsNative =
      typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (supportsNative || reduce) return; // lo maneja el CSS (o no hay animación)

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Progreso del centro del elemento respecto al centro del viewport.
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.setProperty('--slide', clamped.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
