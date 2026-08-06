/**
 * Prosa del CV, en los dos idiomas.
 *
 * Los DATOS DUROS —nombre, contacto, empresas, periodos, habilidades, formación,
 * idiomas— NO viven aquí: los lee `build.mjs` desde `web/src/content/profile.ts`, que
 * es la misma fuente que alimenta la web. Así el CV no puede volver a contradecirla,
 * que es justo lo que pasaba con la versión anterior (fechas y alcance distintos).
 *
 * Aquí va solo lo que el CV necesita y la web no: titular, resumen, viñetas de logros
 * —el formato de CV pide frases cortas, no los bloques Problema/Lo difícil/Resultado—
 * y las certificaciones.
 *
 * Las viñetas se emparejan con los proyectos de profile.ts por su `title`.
 */

export const CERTIFICATIONS = [
  {
    es: 'Generative AI Fundamentals & Prompt Engineering for Developers · Coursera',
    en: 'Generative AI Fundamentals & Prompt Engineering for Developers · Coursera',
  },
  {
    es: 'Programación Intensiva en Python · Coursera',
    en: 'Intensive Python Programming Certification · Coursera',
  },
  {
    es: 'Google IT Automation with Python Professional Certificate · Coursera (en curso)',
    en: 'Google IT Automation with Python Professional Certificate · Coursera (in progress)',
  },
  {
    es: 'EF SET English Certificate · B2 global, lectura C2',
    en: 'EF SET English Certificate · B2 overall, C2 reading',
  },
];

export const TEXT = {
  es: {
    lang: 'es',
    docTitle: 'Wilfred Morales · Desarrollador backend',
    headline: 'Desarrollador backend · PHP/Laravel · PostgreSQL · Seguridad de plataforma',
    sections: {
      summary: 'Perfil',
      experience: 'Experiencia',
      education: 'Formación',
      skills: 'Habilidades',
      languages: 'Idiomas',
      certifications: 'Certificaciones',
    },
    present: 'actualidad',
    summary: [
      'Desarrollador backend. Entre octubre de 2025 y julio de 2026 trabajé en una fintech de crédito por libranza: préstamos con descuento directo de nómina, un sector regulado en Colombia. Disponible de inmediato.',
      'He construido y puesto en producción el motor de reglas de crédito, la firma electrónica con validación de identidad contra buró y el proceso mensual de puntaje crediticio que procesa unos 300.000 registros por corrida. También dirigí la migración de la plataforma a una arquitectura por capas.',
      'Cursando Ingeniería Informática en la UNET. Documentos colombianos, sin requisitos de visado ni patrocinio. Empleo de planta, remoto o híbrido en Colombia; también contratación internacional vía Deel (GMT-5).',
    ],
    bullets: {
      'rules-engine': [
        'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL: elegibilidad, embargos, límites de plazo y requisitos laborales y financieros por pagaduría. El área de negocio ajusta parámetros sin desplegar código.',
        'Implementé la evaluación completa: cálculo de capacidad de endeudamiento según Ley 1527 y Ley 50 para activos y pensionados, criterios de decisión, reglas especiales y reevaluación de solicitudes.',
        'Construí el portal público de solicitudes y sus validaciones de front y backend, con trazabilidad por asesor y protección antibot.',
      ],
      'esignature': [
        'Implementé la máquina de estados que sigue la cola del proveedor de validación de identidad, preservando la integridad del XML entre peticiones encadenadas.',
        'Entregué el módulo de libranzas de punta a punta: formulario multipaso con autoguardado, borrador en PDF, historial de correos y reintentos de subida a S3.',
        'Extraje un patrón de firma genérico para que los módulos siguientes lo implementaran en vez de repetir el flujo.',
      ],
      'scoring': [
        'Llevé a producción un modelo de riesgo que vivía en el cuaderno de un analista: contenedor con cron mensual que extrae de PostgreSQL, ejecuta el modelo y persiste los resultados. Antes no se calculaba de forma automática.',
        'Procesa unos 300.000 registros por corrida, con carga en bloques de cinco mil, control de estado en disco para no reprocesar el mismo artefacto y descarte de filas inválidas sin abortar la carga.',
        'Añadí la consulta en vivo por API para mostrar el puntaje de una cédula en la pantalla de visado.',
      ],
      'access-control': [
        'Consolidé el control de accesos sobre Spatie (guards, middleware y policies) con una migración que llevó usuarios y roles existentes al esquema nuevo sin interrumpir la operación.',
        'Trabajé en el endurecimiento de la autenticación y en la trazabilidad de eventos críticos de cara a una auditoría de seguridad.',
      ],
      'layered-migration': [
        'Dirigí y verifiqué la migración de una plataforma de seis años a una arquitectura por capas, con más de doscientos modelos Eloquent mezclados con controladores, colas y providers.',
        'Sin suite de pruebas de la que fiarse, la migración fue módulo a módulo con verificación en cada paso. Tres meses, con revisión del líder técnico.',
      ],
      'ai-automation': [
        'Procesos automatizados con n8n y la API de OpenAI para generación de contenido.',
        'Bot conversacional de Telegram integrado con n8n y PostgreSQL que atiende solicitudes de punta a punta.',
      ],
      'video-cli': [
        'Herramienta de línea de comandos en TypeScript que parte un vídeo largo en clips verticales: transcripción con Whisper, guion generado por un modelo cuya salida se valida contra un esquema, síntesis de voz y montaje de subtítulos con Remotion.',
        'Cada paso persiste su resultado en disco y el proceso es reanudable, para no repetir llamadas al modelo ya pagadas.',
      ],
    },
  },

  en: {
    lang: 'en',
    docTitle: 'Wilfred Morales · Backend Developer',
    headline: 'Backend Developer · PHP/Laravel · PostgreSQL · Platform Security',
    sections: {
      summary: 'Profile',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      certifications: 'Certifications',
    },
    present: 'Present',
    summary: [
      'Backend developer. From October 2025 to July 2026 I worked at a payroll-deduction lending fintech, a regulated sector in Colombia. Available immediately.',
      'I built and shipped the credit rules engine, the electronic signature flow with credit-bureau identity validation, and the monthly scoring pipeline that processes around 300,000 records per run. I also led the migration of the platform to a layered architecture.',
      'Currently studying Computer Engineering at UNET. Colombian documents: no visa or sponsorship required. Open to full-time roles in Colombia, remote or hybrid; also international contracting via Deel (GMT-5).',
    ],
    bullets: {
      'rules-engine': [
        'Modelled the data and translated business policy into a rules schema in PostgreSQL: eligibility, garnishments, term limits, and employment and financial requirements per payer. The business team now adjusts parameters without a deployment.',
        'Implemented the full evaluation logic: borrowing-capacity calculation under Colombian Law 1527 and Law 50 for active employees and pensioners, decision criteria, special rules, and application re-evaluation.',
        'Built the public application portal and its front-end and back-end validation, with per-advisor traceability and bot protection.',
      ],
      'esignature': [
        'Implemented the state machine that tracks the identity-validation provider queue, preserving XML integrity across chained requests.',
        'Delivered the payroll-lending module end to end: multi-step form with section autosave, PDF draft, email history, and S3 upload retries.',
        'Extracted a generic signing pattern so later modules could implement it instead of duplicating the flow.',
      ],
      'scoring': [
        'Took a risk model living in a data analyst notebook to production: a containerised monthly cron job that reads from PostgreSQL, runs the model and persists results. Scoring was not automated before this.',
        'Processes around 300,000 records per run, loading in batches of five thousand, with on-disk state tracking to avoid reprocessing the same artifact and invalid-row handling that does not abort the load.',
        'Added a live API lookup so a customer score can be shown on the underwriting screen.',
      ],
      'access-control': [
        'Consolidated access control on Spatie (guards, middleware and policies) with a migration that moved existing users and roles to the new schema without interrupting operations.',
        'Worked on authentication hardening and on traceability of business-critical events ahead of a security audit.',
      ],
      'layered-migration': [
        'Led and verified the migration of a six-year-old platform to a layered architecture, with over two hundred Eloquent models mixed with controllers, queues and providers.',
        'With no test suite to rely on, the migration went module by module with verification at each step. Three months, reviewed by the tech lead.',
      ],
      'ai-automation': [
        'Automation pipelines built with n8n and the OpenAI API for content generation.',
        'Conversational Telegram bot integrated with n8n and PostgreSQL handling requests end to end.',
      ],
      'video-cli': [
        'TypeScript command-line tool that splits long video into vertical clips: Whisper transcription, script generation by a model whose output is schema-validated, speech synthesis, and subtitle rendering with Remotion.',
        'Every step persists its result to disk and the process is resumable, so already-paid model calls are never repeated.',
      ],
    },
  },
};

/**
 * Empleador real de cada marca. En un CV la experiencia se agrupa por CONTRATO: CK es
 * filial de GAF, así que sus proyectos van bajo GAF y no como un empleo paralelo —dos
 * entradas con el mismo periodo se leen como dos trabajos a la vez.
 * `note` acompaña al proyecto para no perder de vista para qué marca se hizo.
 */
export const EMPLOYERS: Record<string, { name: { es: string; en: string } }> = {
  gaf: { name: { es: 'GAF Technology Solutions', en: 'GAF Technology Solutions' } },
  self: { name: { es: 'Autónomo', en: 'Self-employed' } },
};

/** Una línea que sitúa al empleador: quien lea el CV puede no conocerlo. */
export const EMPLOYER_TAGLINE: Record<string, { es: string; en: string }> = {
  gaf: {
    es: 'Fintech de crédito por libranza, respaldada por un fondo de inversión.',
    en: 'Payroll-deduction lending fintech, backed by an investment fund.',
  },
};

/** Modalidad de trabajo, junto a las fechas, como en un CV convencional. */
export const WORK_MODE: Record<string, { es: string; en: string }> = {
  gaf: { es: 'Jornada completa · Remoto, Colombia', en: 'Full-time · Remote, Colombia' },
  self: { es: 'Media jornada', en: 'Part-time' },
};
