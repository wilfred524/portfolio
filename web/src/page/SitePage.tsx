import '@fontsource-variable/inter';
import '../styles/site.css';
import { useEffect, useMemo, useState } from 'react';
import type { ProjectItem } from '../content';
import { useContent } from '../i18n/LanguageProvider';
import { useObservatorio } from '../hooks/useObservatorio';
import { CampoParticulas, type Figura } from '../ui/CampoParticulas';
import { PIEZAS, PIEZAS_PLANO } from '../visuals/piezas';
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
  const [reveladas, setReveladas] = useState<Set<string>>(new Set());
  const [saltado, setSaltado] = useState(false);

  const porId = new Map<string, ProjectItem>();
  for (const grupo of profile.projectGroups) {
    for (const item of grupo.items) porId.set(item.id, item);
  }
  const empleoDe = new Map<string, string>();
  for (const grupo of profile.projectGroups) {
    if (!grupo.employmentId) continue;
    for (const item of grupo.items) empleoDe.set(item.id, grupo.employmentId);
  }

  // Las figuras del plano activo, en orden: es la cascada que sigue el enjambre.
  const figuras = useMemo<Figura[]>(() => {
    const actual = PLANOS[plano];
    if (actual.proyectos?.length) {
      return actual.proyectos
        .filter((id) => PIEZAS[id])
        .map((id) => ({ id, d: PIEZAS[id], conHueco: true }));
    }
    const propia = PIEZAS_PLANO[actual.id];
    return propia ? [{ id: actual.id, d: propia, conHueco: false }] : [];
  }, [plano]);

  // En modo documento no hay cascada: todas las piezas se ven de entrada, y las de
  // todos los planos, no solo las del activo.
  useEffect(() => {
    setSaltado(false);
    if (!documento) {
      setReveladas(new Set());
      return;
    }
    const todas = profile.projectGroups.flatMap((g) => g.items.map((i) => i.id));
    setReveladas(new Set(todas));
  }, [figuras, documento, profile]);

  // La coreografía nunca es una puerta: cualquier interacción la salta al final.
  const saltar = () => {
    if (documento || saltado) return;
    setSaltado(true);
    setReveladas(new Set(figuras.map((f) => f.id)));
  };

  return (
    <div
      className={documento ? 'obs obs--documento' : 'obs'}
      onPointerDown={saltar}
      onKeyDown={saltar}
    >
      <a className="skip" href={`#/${PLANOS[PLANOS.length - 1].id}`}>
        {profile.ui.planes.contact}
      </a>

      {!documento && (
        <CampoParticulas
          plano={plano}
          figuras={figuras}
          reducido={reducido}
          saltado={saltado}
          onRevelar={(id) => setReveladas((previas) => new Set(previas).add(id))}
        />
      )}

      <Hud plano={plano} irA={irA} documento={documento} conmutarModo={conmutarModo} />
      {!documento && <Flechas plano={plano} irA={irA} />}

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
              inert={!activo}
            >
              {p.id === 'start' && <Umbral irA={irA} />}
              {p.id === 'context' && <Contexto />}
              {proyectos.length > 0 && (
                <Trabajo
                  titulo={profile.ui.planes[p.nombre]}
                  proyectos={proyectos}
                  empleo={empleo}
                  reveladas={reveladas}
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
        /* La clave fuerza un montaje nuevo: sin ella, abrir otro proyecto reciclaría el
           panel y los efectos de foco y de bloqueo de scroll no volverían a correr. */
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
