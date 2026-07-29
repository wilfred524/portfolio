import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { designs } from '../designs/registry';
import './design-switcher.css';

/**
 * Botón flotante presente en todos los diseños: abre un panel
 * con la colección y permite saltar a un diseño específico.
 */
export function DesignSwitcher() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="design-switcher">
      {open && (
        <div className="design-switcher__panel" role="menu">
          <p className="design-switcher__title">Colección de diseños</p>
          {designs.map((design) => {
            const path = design.slug === 'henry' ? '/' : `/disenos/${design.slug}`;
            const active = location.pathname === path;
            return (
              <Link
                key={design.slug}
                to={path}
                role="menuitem"
                className={`design-switcher__item${active ? ' is-active' : ''}`}
                style={{
                  background: design.preview.background,
                  color: design.preview.foreground,
                }}
                onClick={() => setOpen(false)}
              >
                <span>{design.name}</span>
                <span className="design-switcher__year">{design.year}</span>
              </Link>
            );
          })}
          <Link
            to="/disenos"
            className="design-switcher__all"
            onClick={() => setOpen(false)}
          >
            Ver toda la colección →
          </Link>
        </div>
      )}
      <button
        type="button"
        className="design-switcher__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Cerrar' : 'Diseños'}
      </button>
    </div>
  );
}
