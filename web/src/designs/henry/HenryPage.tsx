import './henry.css';
import '@fontsource/instrument-serif';
import '@fontsource/lora';
import '@fontsource/anton';
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
      <nav className="henry-nav">
        <span>{profile.name}</span>
        <span className="henry-meta">{profile.location}</span>
        <a href="#contacto">Contacto</a>
      </nav>
      <Hero />
      <Masthead />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <footer className="henry-footer">
        <span>© 2026 {profile.name}</span>
        <span>Diseño: sistema Henry — colección de diseños</span>
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
