import { useEffect, useRef } from 'react';

/**
 * Añade la clase `is-visible` al elemento cuando entra al viewport.
 * Los estilos de cada diseño deciden qué significa "revelarse"
 * (translateY, opacidad, inversión de fondo…).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
