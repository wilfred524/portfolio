import '@fontsource-variable/inter';
import '@fontsource-variable/montserrat';
import '@fontsource-variable/space-grotesk';
import '../styles/site.css';
import { useEffect, useMemo, useState } from 'react';
import type { ProjectItem } from '../content';
import { useContent } from '../i18n/LanguageProvider';
import { useObservatorio } from '../hooks/useObservatorio';
import { CampoParticulas, type Figura } from '../ui/CampoParticulas';
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
  const { plano, pedido, sentido, irA, documento, conmutarModo, reducido } = useObservatorio();
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

  // Numeración corrida por los nueve proyectos, en el orden en que se recorren: es el
  // índice del trabajo, no una posición dentro de su plano.
  const numeros = useMemo(() => {
    const mapa = new Map<string, string>();
    let n = 0;
    for (const p of PLANOS) {
      for (const id of p.proyectos ?? []) mapa.set(id, String(++n).padStart(2, '0'));
    }
    return mapa;
  }, []);

  /**
   * Una sola figura por plano: su rótulo. Toda la materia se concentra en un texto en vez
   * de repartirse entre varios, que es lo que hacía que ninguno llegara a leerse. El
   * resto del contenido entra con el mismo fundido que ya usan los planos de texto.
   */
  const figuras = useMemo<Figura[]>(
    () => [{ id: PLANOS[plano].id, tipo: 'rotulo' as const }],
    [plano],
  );

  // En modo documento no hay cascada: todas las piezas se ven de entrada, y las de
  // todos los planos, no solo las del activo.
  useEffect(() => {
    setSaltado(false);
    if (!documento) {
      setReveladas(new Set());
      return;
    }
    setReveladas(new Set(PLANOS.map((p) => p.id)));
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
          disolviendo={pedido !== plano}
          onRevelar={(id) => setReveladas((previas) => new Set(previas).add(id))}
        />
      )}

      <Hud plano={pedido} irA={irA} documento={documento} conmutarModo={conmutarModo} />
      {!documento && <Flechas plano={pedido} irA={irA} />}

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
              className={[
                'plano',
                activo ? 'is-activo' : '',
                activo && pedido !== plano ? 'is-disolviendo' : '',
                reveladas.has(p.id) ? 'is-formado' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={profile.ui.planes[p.nombre]}
              inert={!activo}
            >
              {p.id === 'start' && <Umbral irA={irA} />}
              {p.id === 'context' && <Contexto />}
              {proyectos.length > 0 && (
                <Trabajo
                  id={p.id}
                  titulo={profile.ui.planes[p.nombre]}
                  proyectos={proyectos}
                  empleo={empleo}
                  numeroDe={(id) => numeros.get(id) ?? ''}
                  onAbrir={setAbierto}
                />
              )}
              {p.id === 'toolkit' && <Instrumental titulo={profile.ui.planes[p.nombre]} />}
              {p.id === 'contact' && <Contacto titulo={profile.ui.planes[p.nombre]} />}
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
