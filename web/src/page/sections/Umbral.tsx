import { useContent } from '../../i18n/LanguageProvider';

/**
 * Plano 0. Decide si el visitante sigue, así que es el único **sin coreografía de
 * entrada**: su texto está en su sitio al primer pintado.
 *
 * Dos salidas: seguir la narración, o el atajo al trabajo para quien ya sabe qué busca.
 */
export function Umbral({ irA }: { irA: (indice: number) => void }) {
  const profile = useContent();
  const { planes } = profile.ui;

  return (
    <div className="plano__cuerpo umbral">
      <p className="label">{profile.role}</p>
      <h1 className="umbral__nombre">{profile.name}</h1>

      {/* Punto medio y no raya: la raya está descartada en todas las superficies del
          perfil salvo rangos de fechas. */}
      <p className="umbral__stack">{profile.stack}</p>
      <p className="umbral__credencial">{profile.credential}</p>

      <div className="umbral__acciones">
        <button type="button" className="btn btn--solid" onClick={() => irA(1)}>
          {planes.enter}
        </button>
        <button type="button" className="btn" onClick={() => irA(2)}>
          {planes.skipToWork}
        </button>
        <a className="btn" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </div>

      <div className="umbral__pie">
        <span className="available">{profile.availability}</span>
        <span className="meta">{profile.trajectory}</span>
      </div>
    </div>
  );
}
