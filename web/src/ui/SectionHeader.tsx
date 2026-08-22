/**
 * Encabezado de sección: título y una regla que ocupa lo que sobra a la derecha.
 *
 * Es un `<h2>` real y visible, así que no necesita la pareja «decorativo aria-hidden +
 * encabezado para lectores» que usaba el diseño anterior, donde el título era una pieza
 * gráfica. La regla sí es decorativa y va oculta al árbol de accesibilidad.
 */
export function SectionHeader({ title, id }: { title: string; id?: string }) {
  return (
    <div className="section__head">
      <h2 className="section__title" id={id}>
        {title}
      </h2>
      <span className="section__rule" aria-hidden="true" />
    </div>
  );
}
