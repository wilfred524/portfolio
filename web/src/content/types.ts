/**
 * Forma del contenido. Cada idioma vive en su archivo (`profile.es.ts`, `profile.en.ts`)
 * y ambos declaran `satisfies Profile`, de modo que `npm run typecheck` falla si a uno
 * le falta una clave. Es lo que impide que una traducción quede a medias sin avisar.
 */

export interface ProjectItem {
  /**
   * Identificador estable, idéntico en los dos idiomas. Es la clave con la que el
   * generador de CV empareja cada proyecto con sus viñetas: antes se emparejaba por
   * título, que al traducirse dejaba de coincidir.
   */
  id: string;
  /**
   * Empleador al que pertenece el proyecto, también estable entre idiomas. El CV agrupa
   * la experiencia por contrato, no por marca.
   */
  employer?: string;
  /** Título corto (una palabra o dos). */
  title: string;
  /** Marca o plataforma. Ausente en proyectos propios. */
  company?: string;
  /** Rol desempeñado en el proyecto. */
  role: string;
  /** Marco temporal. Sin él, nueve meses de trabajo se leen como cuatro años. */
  period: string;
  /** Dato de escala, legible junto al título (antes enterrado en el texto fantasma). */
  metric?: string;
  /**
   * Cuerpo en tres partes, para los proyectos que van en extenso. La del medio es la
   * que contrata: ahí se demuestra criterio técnico, no ejecución.
   */
  body?: {
    problem: string;
    hard: string;
    result: string;
  };
  /**
   * Alternativa al `body`: un párrafo corto. Cinco tarjetas de longitud idéntica se
   * aplanan entre sí y ninguna destaca; tres en extenso y dos en resumen jerarquizan.
   */
  brief?: string;
  tags: string[];
  url?: string;
}

export interface ProjectGroup {
  category: string;
  items: ProjectItem[];
}

export interface Fact {
  label: string;
  /** Si va vacío, la línea no se renderiza: mejor omitir que publicar un dato inventado. */
  value: string;
  /** Documento que respalda el dato (p. ej. el certificado de inglés). */
  href?: string;
  hrefLabel?: string;
}

export interface SkillGroup {
  /** Área de dominio (Backend, Automatización…). Se rotula como categoría. */
  area: string;
  /** Tecnologías, ordenadas de mayor a menor dominio dentro del área. */
  items: string[];
}

/**
 * Textos de interfaz. Antes vivían incrustados en los componentes, lo que rompía el
 * invariante de CLAUDE.md y hacía imposible traducir la página.
 */
export interface UiStrings {
  nav: { experience: string; skills: string; contact: string; ariaLabel: string };
  sections: { experience: string; skills: string; contact: string; colophon: string };
  blocks: { problem: string; hard: string; result: string };
  viewCode: string;
  credit: {
    intro: string;
    author: string;
    catalogued: string;
    outro: string;
  };
}

export interface Profile {
  name: string;
  role: string;
  stack: string;
  credential: string;
  availability: string;
  trajectory: string;
  heroSlogan: { start: string; link: string; end: string };
  location: string;
  email: string;
  phone: string;
  repoUrl: string;
  /** Un solo documento por idioma: el botón no obliga a elegir idioma dos veces. */
  cv: { label: string; url: string };
  colophon: string;
  closing: string;
  facts: Fact[];
  skillGroups: SkillGroup[];
  projectGroups: ProjectGroup[];
  social: { label: string; url: string }[];
  ui: UiStrings;
}
