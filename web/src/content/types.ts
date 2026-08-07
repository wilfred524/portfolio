/**
 * Forma del contenido. Cada idioma vive en su archivo (`profile.es.ts`, `profile.en.ts`)
 * y ambos declaran `satisfies Profile`, de modo que `npm run typecheck` falla si a uno
 * le falta una clave. Es lo que impide que una traducción quede a medias sin avisar.
 */

/**
 * Un contrato: dónde, con qué rol y entre qué fechas. Es el nivel que faltaba.
 *
 * Antes cada tarea repetía empresa, rol y periodo, y cinco tareas seguidas del mismo
 * empleo se leían como cinco trabajos distintos. La verdad es más simple: **un empleo,
 * unos cuantos proyectos dentro, y tareas dentro de cada proyecto**. Dicho una vez.
 */
export interface Employment {
  /** Estable entre idiomas; es la clave que enlaza los grupos de proyectos con su empleo. */
  id: string;
  employer: string;
  /** Una línea que sitúa a la empresa: quien lee puede no conocerla. */
  tagline?: string;
  role: string;
  period: string;
  /** Modalidad (jornada, remoto), como en un CV convencional. */
  mode?: string;
}

export interface ProjectItem {
  /**
   * Identificador estable, idéntico en los dos idiomas. Es la clave con la que el
   * generador de CV empareja cada proyecto con sus viñetas: antes se emparejaba por
   * título, que al traducirse dejaba de coincidir.
   */
  id: string;
  /** Título corto (una palabra o dos). */
  title: string;
  /**
   * Rol y periodo **solo cuando la tarea no cuelga de un empleo**: los proyectos propios
   * los necesitan; las tareas de un contrato los heredan de su `Employment` y repetirlos
   * es justo el ruido que se quiso quitar.
   */
  role?: string;
  period?: string;
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

/**
 * Un proyecto, con las tareas que se hicieron dentro.
 *
 * `employmentId` dice de qué contrato cuelga. Sin él, el grupo es trabajo propio y se
 * renderiza aparte, sin cabecera de empleo.
 */
export interface ProjectGroup {
  category: string;
  employmentId?: string;
  /** Aclaración de la marca cuando no coincide con el empleador (una filial, un cliente). */
  note?: string;
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
  /** Chat del agente. Su lógica vive en el backend; aquí solo está lo que se lee. */
  chat: {
    title: string;
    intro: string;
    placeholder: string;
    send: string;
    thinking: string;
    /** Se muestra cuando el backend no responde o rechaza la petición. */
    error: string;
    /** Etiqueta accesible de la zona donde aparecen las respuestas. */
    logLabel: string;
    /** Aviso de que responde un agente y no Wilfred. */
    disclaimer: string;
    /** Texto del botón flotante que abre el chat. */
    launcher: string;
    closeLabel: string;
    /** Bocadillo de invitación, que se muestra una sola vez. */
    invite: string;
    inviteDismiss: string;
  };
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
  /**
   * URL pública del sitio. Va en la línea de contacto del CV, junto a GitHub y LinkedIn:
   * es la pieza que demuestra el trabajo. Si queda vacía no se pinta — mejor omitirla
   * que imprimir en un PDF una dirección que no resuelve.
   */
  siteUrl: string;
  /** Un solo documento por idioma: el botón no obliga a elegir idioma dos veces. */
  cv: { label: string; url: string };
  colophon: string;
  facts: Fact[];
  skillGroups: SkillGroup[];
  /** Los contratos, en orden. Cada grupo de proyectos apunta al suyo por `id`. */
  employments: Employment[];
  projectGroups: ProjectGroup[];
  social: { label: string; url: string }[];
  ui: UiStrings;
}
