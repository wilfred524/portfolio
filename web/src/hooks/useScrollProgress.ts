import { useEffect, useRef } from 'react';

/**
 * Progreso de ENTRADA ligado al scroll, en rango [0, 1]:
 *  - 0 cuando el elemento aparece por abajo del viewport,
 *  - 1 cuando alcanza su "línea de reposo" (por defecto ~55% de la altura),
 *  - y se MANTIENE en 1 al seguir subiendo (se asienta: no sigue interactuando,
 *    así el efecto no se ve sobrecargado).
 *
 * Escribe la variable CSS `--p` en el elemento; el CSS decide qué hacer con ella
 * (extender una regla con scaleX, alinear un texto fantasma con translateX, etc.).
 * Universal (todos los navegadores). Con `prefers-reduced-motion` deja `--p = 1`
 * (estado final, estático).
 */
/**
 * `restLine` es la altura del viewport, en tanto por uno, a la que el efecto llega a 1.
 * A 0.55 el recorrido eran 45vh de scroll y la transición pasaba casi inadvertida; a
 * 0.12 son 88vh —casi el doble— y el efecto se completa justo cuando el encabezado
 * alcanza la parte superior de la pantalla, que es donde la vista se detiene a leerlo.
 */
export function useScrollProgress<T extends HTMLElement>(restLine = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.style.setProperty('--p', '1');
      return;
    }

    let raf = 0;
    // El progreso no retrocede: "asentarse" significa quedarse en el máximo alcanzado,
    // no recalcularse hacia atrás cuando se sube el scroll.
    let settled = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const top = el.getBoundingClientRect().top;
      const rest = restLine * vh;
      // 0 cuando top = vh (entrando); 1 cuando top = rest (en reposo); se mantiene en 1.
      let p = (vh - top) / (vh - rest);

      // Un elemento cerca del pie de página nunca alcanza la línea de reposo: el scroll
      // se agota antes y su efecto quedaba congelado a medias (reglas de distinto largo).
      // Al tocar fondo, todo lo visible se da por asentado.
      const atBottom =
        window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      if (atBottom && top < vh) p = 1;

      settled = Math.max(settled, Math.max(0, Math.min(1, p)));
      el.style.setProperty('--p', settled.toFixed(4));
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
  }, [restLine]);

  return ref;
}
