import { Link } from 'react-router-dom';
import { designs } from '../designs/registry';
import './gallery.css';

export default function GalleryPage() {
  return (
    <main className="gallery">
      <header className="gallery__header">
        <p className="gallery__eyebrow">Colección</p>
        <h1 className="gallery__title">Diseños</h1>
        <p className="gallery__intro">
          Cada pieza implementa con fidelidad un sistema de diseño distinto:
          su spec, sus tokens y sus interacciones. La colección crece.
        </p>
      </header>
      <ul className="gallery__grid">
        {designs.map((design) => (
          <li key={design.slug}>
            <Link
              to={design.slug === 'henry' ? '/' : `/disenos/${design.slug}`}
              className="gallery__card"
              style={{
                background: design.preview.background,
                color: design.preview.foreground,
              }}
            >
              <span className="gallery__card-year">{design.year}</span>
              <span className="gallery__card-name">{design.name}</span>
              <span className="gallery__card-description">{design.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
