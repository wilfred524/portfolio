import '@fontsource-variable/inter';
import '../styles/site.css';
import { useContent } from '../i18n/LanguageProvider';
import { LangSwitch } from '../ui/LangSwitch';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Contact } from './sections/Contact';
import { SiteFooter } from './sections/SiteFooter';

/**
 * La página. Una sola, sin router: el orden de las secciones ES la estructura del sitio.
 *
 * Este componente decide el orden y nada más; cada sección se pide su propio contenido
 * a `useContent()`. El canvas de la constelación entra en la capa 1 como primer hijo,
 * por debajo de `.site`.
 */
export default function SitePage() {
  const { ui } = useContent();

  return (
    <>
      {/* Primer elemento enfocable: quien navega con teclado no debería recorrer la
          navegación entera en cada carga para llegar al contenido. */}
      <a className="skip" href="#experiencia">
        {ui.nav.experience}
      </a>

      <div className="site">
        <nav className="nav" aria-label={ui.nav.ariaLabel}>
          <span className="nav__logo">wm.</span>
          <div className="nav__links">
            <a href="#experiencia">{ui.nav.experience}</a>
            <a href="#habilidades">{ui.nav.skills}</a>
            <a href="#contacto">{ui.nav.contact}</a>
            <LangSwitch />
          </div>
        </nav>

        <main>
          <Hero />
          <Projects />
          <Skills />
          <Contact />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
