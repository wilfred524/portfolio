import './henry.css';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/antonio';
import { profile } from '../../content/profile';
import { DesignMenu } from './components/DesignMenu';
import { Hero } from './components/Hero';
import { Masthead } from './components/Masthead';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';

export default function HenryPage() {
  return (
    <div className="design-henry">
      {/* Nav mínima arriba-izquierda, sin barra ni borde (spec: "no background bar") */}
      <nav className="henry-nav" aria-label="Principal">
        <DesignMenu />
        <a href="#contacto">Contacto</a>
      </nav>
      <Hero />
      <Masthead />
      {/* Experiencia y Habilidades comparten banda Paper: mantiene la alternancia
          Paper/Ink tras disolverse «Sobre mí» y deja el cierre en negro al contacto. */}
      <section id="proyectos" className="henry-section">
        <Projects />
        <Skills />
      </section>
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
