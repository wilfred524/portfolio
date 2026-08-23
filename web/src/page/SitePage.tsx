import '@fontsource-variable/inter';
import '../styles/site.css';
import { useState } from 'react';
import type { ProjectItem } from '../content';
import { useContent } from '../i18n/LanguageProvider';
import { useObservatorio } from '../hooks/useObservatorio';
import { Hud } from '../ui/Hud';
import { ProjectModal } from '../ui/ProjectModal';
import { PLANOS } from './planos';
import { Umbral } from './sections/Umbral';
import { Contexto } from './sections/Contexto';
import { Trabajo } from './sections/Trabajo';
import { Instrumental } from './sections/Instrumental';
import { Contacto } from './sections/Contacto';

/**
 * El observatorio: una sola pantalla por la que se navega, en vez de una página que se
 * recorre con el scroll.
 *
 * **Los siete planos se montan siempre.** Los inactivos se ocultan con `inert` y
 * `aria-hidden`, nunca se desmontan: el HTML servido contiene las 34 tecnologías, los
 * nueve proyectos y todos los datos de perfil, así que la búsqueda del navegador, los
 * buscadores y los lectores de pantalla siguen encontrando el contenido entero. El coste
 * de rendimiento no está en un DOM oculto, está en el canvas, que es uno solo.
 *
 * En **modo documento** los mismos planos se apilan y se recorren con el scroll. No es una
 * segunda implementación: es el mismo árbol con otra clase raíz.
 */
export default function SitePage() {
  const profile = useContent();
  const { plano, irA, documento, conmutarModo } = useObservatorio();
  const [abierto, setAbierto] = useState<ProjectItem | null>(null);

  // Índice de proyectos por id: el reparto por planos vive en `planos.ts` (presentación),
  // así que hay que resolver cada id contra el contenido.
  const porId = new Map<string, ProjectItem>();
  for (const grupo of profile.projectGroups) {
    for (const item of grupo.items) porId.set(item.id, item);
  }
  const empleoDe = new Map<string, string>();
  for (const grupo of profile.projectGroups) {
    if (!grupo.employmentId) continue;
    for (const item of grupo.items) empleoDe.set(item.id, grupo.employmentId);
  }

  return (
    <div className={documento ? 'obs obs--documento' : 'obs'}>
      <a className="skip" href={`#/${PLANOS[PLANOS.length - 1].id}`}>
        {profile.ui.planes.contact}
      </a>

      <Hud plano={plano} irA={irA} documento={documento} conmutarModo={conmutarModo} />

      <main className="planos">
        {PLANOS.map((p, indice) => {
          const activo = documento || indice === plano;
          const proyectos = (p.proyectos ?? []).map((id) => porId.get(id)!).filter(Boolean);
          const empleoId = p.proyectos?.map((id) => empleoDe.get(id)).find(Boolean);
          const empleo = profile.employments.find((e) => e.id === empleoId);

          return (
            <section
              key={p.id}
              id={p.id}
              className={activo ? 'plano is-activo' : 'plano'}
              aria-label={profile.ui.planes[p.nombre]}
              // `inert` retira el plano oculto del orden de tabulación y del árbol de
              // accesibilidad sin sacarlo del DOM, que es justo lo que se busca: nadie
              // tabula a ciegas dentro de una pantalla que no ve, y el texto sigue ahí.
              inert={!activo}
            >
              {p.id === 'start' && <Umbral irA={irA} />}
              {p.id === 'context' && <Contexto />}
              {proyectos.length > 0 && (
                <Trabajo
                  titulo={profile.ui.planes[p.nombre]}
                  proyectos={proyectos}
                  empleo={empleo}
                  onAbrir={setAbierto}
                />
              )}
              {p.id === 'toolkit' && <Instrumental />}
              {p.id === 'contact' && <Contacto />}
            </section>
          );
        })}
      </main>

      {abierto && (
        // La clave fuerza un montaje nuevo por proyecto: sin ella, abrir otro reciclaría
        // el panel y los efectos de foco y de bloqueo de scroll no volverían a correr.
        <ProjectModal
          key={abierto.id}
          item={abierto}
          employment={profile.employments.find((e) => e.id === empleoDe.get(abierto.id))}
          ui={profile.ui}
          onClose={() => setAbierto(null)}
        />
      )}
    </div>
  );
}
