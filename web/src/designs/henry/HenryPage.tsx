import './henry.css';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/antonio';
import { Link } from 'react-router-dom';
import { profile } from '../../content/profile';
import { useReveal } from '../../hooks/useReveal';
import { Hero } from './components/Hero';
import { Masthead } from './components/Masthead';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';

export default function HenryPage() {
  return (
    <div className="design-henry">
      <div className="henry-ticker">{profile.ticker}</div>
      {/* Nav mínima arriba-izquierda, sin barra ni borde (spec: "no background bar") */}
      <nav className="henry-nav" aria-label="Principal">
        <Link to="/disenos">Diseños</Link>
        <a href="#contacto">Contacto</a>
      </nav>
      <Hero />
      <div className="henry-coordline">
        {`${profile.location} — ${profile.role} — ${profile.availability}`}
      </div>
      <Masthead />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <footer className="henry-footer">
        <span>© 2026 {profile.name}</span>
        <span className="henry-credit">
          Interpretación del sistema de diseño{' '}
          <a href="https://henry.codes" target="_blank" rel="noreferrer">
            «Henry» de Henry Desroches
          </a>
          , catalogado en{' '}
          <a
            href="https://styles.refero.design/style/ff4b9eff-dc0b-4886-bd65-c2f5e9069318"
            target="_blank"
            rel="noreferrer"
          >
            refero.design
          </a>
          . Reconstruido en React; contenido y código propios.
        </span>
      </footer>
    </div>
  );
}

/** Sección que se invierte de Paper a Ink cuando entra al viewport. */
export function InkSection({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLElement>(0.25);
  return (
    <section id={id} ref={ref} className="henry-section henry-section--ink">
      {children}
    </section>
  );
}
