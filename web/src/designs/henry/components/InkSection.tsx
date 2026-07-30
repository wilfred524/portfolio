import { useReveal } from '../../../hooks/useReveal';

/** Banda Ink a sangre completa. Vivía en HenryPage, lo que creaba un ciclo de imports. */
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
