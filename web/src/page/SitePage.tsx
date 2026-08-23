import '@fontsource-variable/inter';
import '../styles/site.css';
import { useState } from 'react';
import type { ProjectItem } from '../content';
import { useContent } from '../i18n/LanguageProvider';
import { useObservatorio } from '../hooks/useObservatorio';
import { CampoParticulas } from '../ui/CampoParticulas';
import { Flechas, Hud } from '../ui/Hud';
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
 * **Los siete planos se montan siempre**, los inactivos con `inert`: así el HTML servido
 * conserva todo el contenido y la búsqueda del navegador, los buscadores y los lectores
 * de pantalla lo siguen encontrando. El coste está en el canvas, que es uno solo.
 *
 * El modo documento es el mismo árbol con otra clase raíz, no una segunda implementación.
 */
export default function SitePage() {
  const profile = useContent();
  const { plano, sentido, irA, documento, conmutarModo, reducido } = useObservatorio();
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

      {/* Primer hijo y por debajo del contenido, sin z-index negativo: #root crea su
          propio contexto de apilamiento y ahí un -1 quedaría tapado por cualquier fondo. */}
      {!documento && <CampoParticulas plano={plano} reducido={reducido} />}

      <Hud plano={plano} irA={irA} documento={documento} conmutarModo={conmutarModo} />
      {!documento && <Flechas plano={plano} irA={irA} />}

      {/* El sentido lo consume el CSS para decidir por qué lado entra cada plano. */}
      <main className="planos" data-sentido={sentido}>
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
              // Retira el plano oculto del orden de tabulación sin sacarlo del DOM:
              // nadie tabula a ciegas dentro de una pantalla que no ve.
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
