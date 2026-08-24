import '@fontsource-variable/inter';
import '@fontsource-variable/montserrat';
import '@fontsource-variable/space-grotesk';
import '../styles/site.css';
import { useEffect, useMemo, useState } from 'react';
import type { ProjectItem } from '../content';
import { useContent, useLangSwitch } from '../i18n/LanguageProvider';
import { useObservatorio } from '../hooks/useObservatorio';
import { CampoParticulas, type Figura } from '../ui/CampoParticulas';
import { ChatLanzador } from '../ui/ChatLanzador';
import { Flechas, Hud } from '../ui/Hud';
import { ProjectModal } from '../ui/ProjectModal';
import { PLANOS } from './planos';
import { Umbral } from './sections/Umbral';
import { Contexto } from './sections/Contexto';
import { Trabajo } from './sections/Trabajo';
import { Stack } from './sections/Stack';
import { Contacto } from './sections/Contacto';

export default function SitePage() {
  const profile = useContent();
  const { lang } = useLangSwitch();
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

  const numeros = useMemo(() => {
    const mapa = new Map<string, string>();
    let n = 0;
    for (const p of PLANOS) {
      for (const id of p.proyectos ?? []) mapa.set(id, String(++n).padStart(2, '0'));
    }
    return mapa;
  }, []);

  const figuras = useMemo<Figura[]>(() => {
    const actual = PLANOS[plano];
    return [
      { id: actual.id, tipo: 'rotulo' as const },
      ...(actual.proyectos ?? []).map((id) => ({ id, tipo: 'rotulo' as const })),
    ];
  }, [plano]);

  useEffect(() => {
    setSaltado(false);
    if (!documento) {
      setReveladas(new Set());
      return;
    }
    const todas = profile.projectGroups.flatMap((g) => g.items.map((i) => i.id));
    setReveladas(new Set([...PLANOS.map((p) => p.id), ...todas]));
  }, [figuras, documento, profile]);

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
          lang={lang}
          figuras={figuras}
          reducido={reducido}
          saltado={saltado}
          disolviendo={pedido !== plano}
          onRevelar={(id) => setReveladas((previas) => new Set(previas).add(id))}
        />
      )}

      <Hud plano={pedido} irA={irA} documento={documento} conmutarModo={conmutarModo} />
      {!documento && <Flechas plano={pedido} irA={irA} />}
      <ChatLanzador listo={documento || reveladas.has(PLANOS[plano].id)} />

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
                  reveladas={reveladas}
                  numeroDe={(id) => numeros.get(id) ?? ''}
                  onAbrir={setAbierto}
                />
              )}
              {p.id === 'stack' && <Stack titulo={profile.ui.planes[p.nombre]} />}
              {p.id === 'contact' && <Contacto titulo={profile.ui.planes[p.nombre]} />}
            </section>
          );
        })}
      </main>

      {abierto && (
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
