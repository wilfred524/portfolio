import { CONSTELACIONES } from '../visuals/piezas';

/**
 * La figura ya formada: los mismos nodos que ocupaban las partículas, unidos por líneas.
 *
 * Se dibuja con el mismo material que el campo —puntos y trazos finos— para que el
 * relevo entre las estrellas y el objeto no se note: donde había una partícula queda un
 * nodo, en la misma coordenada.
 */
export function Constelacion({ id }: { id: string }) {
  const figura = CONSTELACIONES[id];
  if (!figura) return null;

  return (
    <svg viewBox="0 0 100 100" focusable="false" className="constelacion">
      <g className="constelacion__aristas">
        {figura.aristas.map(([a, b], i) => (
          <line
            key={i}
            x1={figura.nodos[a][0]}
            y1={figura.nodos[a][1]}
            x2={figura.nodos[b][0]}
            y2={figura.nodos[b][1]}
          />
        ))}
      </g>
      <g className="constelacion__nodos">
        {figura.nodos.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.6} />
        ))}
      </g>
    </svg>
  );
}
