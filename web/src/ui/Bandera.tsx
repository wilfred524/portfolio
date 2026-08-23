import type { Lang } from '../content';

/**
 * Banderas del conmutador de idioma.
 *
 * SVG y no emoji: **Windows no dibuja los emoji de bandera**, ahí se ven como dos letras.
 *
 * Decorativas. El nombre accesible lo pone el idioma escrito (`aria-label`): una bandera
 * no es un idioma, así que la que se ve es una convención y el dato real va en el texto.
 */
export function Bandera({ lang }: { lang: Lang }) {
  const comun = {
    viewBox: '0 0 24 16',
    className: 'bandera',
    'aria-hidden': true,
    focusable: false,
  } as const;

  if (lang === 'es') {
    return (
      <svg {...comun}>
        <rect width="24" height="16" fill="#c60b1e" />
        <rect y="4" width="24" height="8" fill="#ffc400" />
      </svg>
    );
  }

  return (
    <svg {...comun}>
      <rect width="24" height="16" fill="#012169" />
      {/* Aspas blancas y rojas, y la cruz de San Jorge encima. Simplificado: a 24×16 el
          detalle fino de la bandera real no se distingue y solo ensucia. */}
      <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="1.5" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
    </svg>
  );
}
