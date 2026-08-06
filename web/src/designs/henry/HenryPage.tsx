import './henry.css';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/antonio';
import { useContent } from '../../i18n/LanguageProvider';
import { useScrolledPast } from '../../hooks/useScrolledPast';
import { ChatWidget } from './components/ChatWidget';
import { Hero } from './components/Hero';
import { Masthead } from './components/Masthead';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Colophon } from './components/Colophon';
import { Contact } from './components/Contact';
import { LangSwitch } from './components/LangSwitch';

export default function HenryPage() {
  const profile = useContent();
  const { nav, credit } = profile.ui;
  // El chat no aparece hasta que el visitante ha pasado el hero: ofrecerlo antes de que
  // haya leído nada es lo que convierte un asistente en un anuncio.
  const [centinela, pasadoHero] = useScrolledPast<HTMLSpanElement>();

  return (
    <div className="design-henry">
      {/* Nav mínima arriba-izquierda, sin barra ni borde (spec: "no background bar").
          Apunta a las secciones reales de la página, no a una colección de diseños. */}
      <nav className="henry-nav" aria-label={nav.ariaLabel}>
        <a href="#experiencia">{nav.experience}</a>
        <a href="#habilidades">{nav.skills}</a>
        <a href="#contacto">{nav.contact}</a>
        <LangSwitch />
      </nav>
      <Hero />
      {/* Marca dónde acaba la presentación: el widget del chat la usa como umbral. */}
      <span ref={centinela} aria-hidden="true" />
      <Masthead />
      {/* Experiencia y Habilidades comparten banda Paper: mantiene la alternancia
          Paper/Ink tras disolverse «Sobre mí» y deja el cierre en negro al contacto. */}
      <section id="experiencia" className="henry-section">
        <Projects />
        <div id="habilidades">
          <Skills />
        </div>
        <Colophon />
      </section>
      <Contact />
      <footer className="henry-footer">
        <span>© 2026 {profile.name}</span>
        <span className="henry-credit">
          {credit.intro}{' '}
          <a href="https://henry.codes" target="_blank" rel="noreferrer">
            {credit.author}
          </a>
          , {credit.catalogued}{' '}
          <a
            href="https://styles.refero.design/style/ff4b9eff-dc0b-4886-bd65-c2f5e9069318"
            target="_blank"
            rel="noreferrer"
          >
            refero.design
          </a>
          . {credit.outro}
        </span>
      </footer>
      {/* Último hijo, y dentro de `.design-henry` a propósito: los tokens del diseño se
          declaran en esa clase, no en :root, así que fuera de aquí perdería el color y
          la tipografía. Al ir al final, tampoco se cuela en medio del orden de tabulación. */}
      <ChatWidget visible={pasadoHero} />
    </div>
  );
}
