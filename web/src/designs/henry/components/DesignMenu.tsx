import { useState } from 'react';
import { Link } from 'react-router-dom';
import { designs } from '../../registry';

/**
 * Desplegable "Diseños" para la nav superior: lista la colección del registro y navega.
 * Reemplaza al antiguo botón flotante. (Las transiciones entre diseños se harán aparte.)
 */
export function DesignMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="henry-menu"
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="henry-menu__toggle"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Diseños <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="henry-menu__list" role="menu">
          {designs.map((design) => (
            <li key={design.slug} role="none">
              <Link
                role="menuitem"
                to={design.slug === 'henry' ? '/' : `/disenos/${design.slug}`}
                onClick={() => setOpen(false)}
              >
                {design.name}
              </Link>
            </li>
          ))}
          <li role="none">
            <Link
              role="menuitem"
              className="henry-menu__all"
              to="/disenos"
              onClick={() => setOpen(false)}
            >
              Ver colección →
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
