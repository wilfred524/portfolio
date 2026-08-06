import { useEffect, useRef, useState } from 'react';

/**
 * Avisa cuando el elemento observado ha quedado por encima del viewport, es decir,
 * cuando el visitante ya lo ha pasado leyendo hacia abajo.
 *
 * Mismo mecanismo que `useReveal` —IntersectionObserver y una sola vez— pero devolviendo
 * estado en lugar de una clase, porque aquí lo que cambia no es el aspecto de un elemento
 * sino si otro llega a existir.
 *
 * **Es irreversible a propósito.** Una vez disparado, no vuelve a `false` aunque el
 * visitante suba: lo contrario haría parpadear el widget del chat cada vez que alguien
 * sube a releer el hero, que es justo el tipo de movimiento que la página evita.
 *
 * Con un enlace directo a una sección (`/#contacto`) dispara en el primer callback,
 * porque el centinela ya está por encima del viewport al cargar. Es lo correcto: quien
 * llega ahí ya se saltó la introducción.
 */
export function useScrolledPast<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [pasado, setPasado] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        // Se exige `top < 0` además de no intersecar: sin esa condición, un elemento que
        // todavía está por debajo del viewport —al cargar la página— contaría como
        // "pasado" y el widget aparecería de inmediato.
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setPasado(true);
          observer.unobserve(entry.target);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, pasado] as const;
}
