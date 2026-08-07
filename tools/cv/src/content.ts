/**
 * Prosa del CV, en los dos idiomas.
 *
 * Los DATOS DUROS —nombre, contacto, empresas, periodos, habilidades, formación,
 * idiomas— NO viven aquí: los lee `build.ts` desde `web/src/content/profile.{es,en}.ts`,
 * que es la misma fuente que alimenta la web. Así el CV no puede volver a contradecirla,
 * que es justo lo que pasaba con la versión anterior (fechas y alcance distintos).
 *
 * Aquí va solo lo que el CV necesita y la web no: titular, perfil y viñetas de logros
 * —el formato de CV pide frases cortas, no los bloques Problema/Lo difícil/Resultado—.
 *
 * Las viñetas se emparejan con los proyectos de profile.ts por su `id`.
 *
 * REGLAS DE REDACCIÓN (aplican a todas las viñetas, en los dos idiomas):
 * - Primera persona y pasado, con un verbo de acción al principio. Nada de estilo
 *   nominal («Implementación de…»): un CV lo lee una persona buscando qué hiciste tú.
 * - Cifras en dígitos.
 *
 * REGLA DE VERACIDAD, por encima de cualquier otra. No se le atribuyen a Wilfred:
 * la API de envío (la construyó un compañero), el modelo de scoring (venía del área de
 * riesgo), la segunda etapa de la migración por capas (la hizo el otro desarrollador)
 * ni el apagado de la instancia antigua (lo hizo el responsable de infraestructura).
 */

export const TEXT = {
  es: {
    lang: 'es',
    docTitle: 'Wilfred Morales · Desarrollador backend',
    /* Sin el dominio en el titular: el nicho es la prueba, no la identidad. Aparece una
       vez en el perfil y con todo su detalle en la experiencia, que es donde un
       reclutador de fintech lo busca; en el titular solo cierra puertas fuera del
       sector. */
    headline: 'Desarrollador backend — PHP/Laravel · PostgreSQL · Python',
    /* Línea de palabras clave bajo el perfil: el reclutador que escanea salta del
       titular a buscar tecnologías, y la sección Habilidades cae en la página 2. Seis,
       no doce: es un ancla de escaneo, no un inventario. */
    stackLine: 'Laravel · PHP · PostgreSQL · Python · Docker · GCP',
    sections: {
      summary: 'Perfil',
      experience: 'Experiencia',
      projects: 'Proyectos',
      skills: 'Habilidades',
      education: 'Formación',
      languages: 'Idiomas y certificaciones',
    },
    present: 'actualidad',
    /** Modalidad buscada, en la línea de contacto. */
    remote: 'Remoto',
    /* Nombre del archivo descargado. «cv-es.pdf» no dice nada en la carpeta de un
       reclutador que guarda doscientos; con el nombre delante, el archivo se identifica
       y se encuentra al buscar. */
    fileName: 'Wilfred-Morales-Desarrollador-Backend',
    /* Un solo párrafo: sin fechas (ya están en la experiencia), sin repetir el cargo
       (está en el titular) y sin logística (está en el encabezado).
       Tampoco resume los logros: están en los bullets, cuatro líneas más abajo, y
       repetirlos aquí gasta la única frase que enmarca la lectura. Lo que hace este
       párrafo es abrir: categorías de problema —configurable, integraciones, lotes,
       accesos, contenedores— que existen en cualquier sector y que el lector va a
       reconocer una por una al llegar a la experiencia.
       Sin duración («en diez meses»): caduca y hay que mantenerla en dos idiomas, y las
       fechas ya están en la entrada de empleo. Sin adjetivos de valor. */
    summary: [
      'Desarrollador backend en PHP/Laravel y Python, sobre PostgreSQL. Trabajo en lógica de negocio configurable, integraciones con servicios externos, procesos por lotes, control de accesos y despliegue en Docker sobre Linux. Toda mi experiencia de producción viene de una fintech de crédito.',
    ],
    bullets: {
      'rules-engine': [
        'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL: elegibilidad, embargos, límites de plazo y requisitos laborales y financieros por pagaduría. El área de negocio ajusta parámetros sin desplegar código.',
        'Implementé la evaluación completa: cálculo de capacidad de endeudamiento según la Ley 1527 (libranzas) y la Ley 50 para activos y pensionados, criterios de decisión, reglas especiales y reevaluación de solicitudes.',
        'Construí el portal público de solicitudes y sus validaciones de front-end y back-end, con trazabilidad por asesor y reCAPTCHA Enterprise. La API de envío la construyó un compañero; reestructuré el cuerpo de sus peticiones conforme cambiaba el modelo.',
      ],
      esignature: [
        'Construí desde cero el módulo de firma electrónica que sustituyó a uno legacy en desuso: el documento son 24 páginas que antes se llenaban a mano y ahora se generan automáticamente desde plantillas, con una plantilla distinta por producto.',
        'Diseñé el flujo como una máquina de estados sobre las respuestas asíncronas del proveedor: el asesor aprueba un borrador, se validan los datos del cliente contra TransUnion y la identidad se verifica por OTP o KBA.',
        'Cerré el trámite completo en unos 20 minutos, con el documento firmado devuelto con hash, trazabilidad de la transacción y respaldo en S3.',
      ],
      scoring: [
        'Llevé a producción un modelo de riesgo que vivía en un script del área de riesgo: contenedor con cron mensual que extrae de PostgreSQL, ejecuta el modelo y persiste los resultados. Antes no se calculaba de forma automática.',
        'Procesé más de 320.000 personas distintas por corrida, con carga en bloques de 5.000, proceso idempotente y reanudable, y descarte de filas inválidas sin abortar la carga.',
      ],
      'access-control': [
        'Construí el árbol de permisos de la plataforma sobre 17 módulos, con permisos a nivel de opción y de subproceso, blindé ruta a ruta y migré los usuarios y roles existentes al esquema nuevo sin interrumpir la operación.',
      ],
      /* Antes era un solo bullet de 62 palabras con tres atenuaciones encadenadas: en la
         web eran bloques respirados, comprimidos aquí la densidad de disculpas se
         disparaba. Se conserva la que delimita autoría —la revisión del líder técnico,
         que es la única evidencia de que el código pasó por code review— y se retiran
         las que justifican el contexto. */
      'layered-migration': [
        'Participé en la primera etapa de la migración de la plataforma —seis años de código— hacia una arquitectura por capas, eliminando por completo las consultas SQL en crudo de los controladores.',
        'Verifiqué módulo a módulo cada cambio antes de continuar, con revisión del líder técnico en cada paso. Tres meses de trabajo.',
      ],
      infrastructure: [
        'Dockericé la aplicación, que corría de forma nativa sobre la máquina, y la desplegué en una instancia nueva de GCP con nginx como proxy inverso entre los contenedores y el host.',
        'Ejecuté la migración en paralelo: levanté y validé la instancia nueva con la anterior aún en producción, configuré el DNS del dominio y emití los certificados con Certbot hasta dejar la aplicación operando íntegramente sobre HTTPS. Sin interrupción del servicio.',
      ],
      'portfolio-agent': [
        'Construí un asistente conversacional que responde sobre mi trayectoria y las decisiones detrás de cada proyecto, con aviso explícito de que responde un agente y puede equivocarse.',
        'Rehíce la orquestación en Python al desplegarlo, porque el plan gratuito de Vercel no soporta n8n; descarté litellm al medirlo (133 MB de 199, contra un techo de 250 MB por función) y hablo con el modelo por REST directo con httpx.',
      ],
      'video-cli': [
        'Construí una herramienta de línea de comandos en TypeScript que parte un vídeo largo en clips verticales: transcripción con Whisper, guion generado por un modelo cuya salida se valida contra un esquema, síntesis de voz y montaje de subtítulos con Remotion.',
        'Persistí el resultado de cada paso en disco y dejé el proceso reanudable, para no repetir llamadas al modelo ya pagadas.',
      ],
      'portfolio-site': [
        'Construí este sitio con React y TypeScript, con tipografía variable y animaciones sin librería, reinterpretando un sistema de diseño ajeno y acreditándolo en el pie.',
      ],
    },
  },

  en: {
    lang: 'en',
    docTitle: 'Wilfred Morales · Backend Developer',
    headline: 'Backend Developer — PHP/Laravel · PostgreSQL · Python',
    stackLine: 'Laravel · PHP · PostgreSQL · Python · Docker · GCP',
    sections: {
      summary: 'Profile',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      languages: 'Languages and certifications',
    },
    present: 'Present',
    remote: 'Remote',
    fileName: 'Wilfred-Morales-Backend-Developer',
    summary: [
      'Backend developer working with PHP/Laravel and Python on PostgreSQL. I work on configurable business logic, integrations with external services, batch processing, access control, and deployment with Docker on Linux. All my production experience comes from a credit fintech.',
    ],
    bullets: {
      'rules-engine': [
        'Modelled the data and translated business policy into a rules schema in PostgreSQL: eligibility, garnishments, term limits, and employment and financial requirements per payer. The business team now adjusts parameters without a deployment.',
        'Implemented the full evaluation logic: borrowing-capacity calculation under Law 1527 (payroll-deduction lending) and Law 50 for active employees and pensioners, decision criteria, special rules, and application re-evaluation.',
        'Built the public application portal and its front-end and back-end validation, with per-advisor traceability and reCAPTCHA Enterprise. A colleague built the submission API; I restructured its request body as the model changed.',
      ],
      esignature: [
        'Built the electronic signature module from scratch, replacing a disused legacy one: the document is 24 pages that used to be filled in by hand and are now generated automatically from templates, with a different template per product.',
        'Designed the flow as a state machine over the asynchronous responses from the provider: an advisor approves a draft, customer data is validated against TransUnion, and identity is verified by OTP or KBA.',
        'Closed the whole procedure in about 20 minutes, with the signed document returned with its hash, full transaction traceability and a copy kept in S3.',
      ],
      scoring: [
        'Took a risk model living in a script owned by the risk team to production: a containerised monthly cron job that reads from PostgreSQL, runs the model and persists results. Scoring was not automated before this.',
        'Processed over 320,000 distinct people per run, loading in batches of 5,000, with an idempotent and resumable process and invalid-row handling that does not abort the load.',
      ],
      'access-control': [
        'Built the platform permission tree across 17 modules, with permissions down to the option and sub-process level, locked down every route, and migrated existing users and roles to the new schema without interrupting operations.',
      ],
      'layered-migration': [
        'Took part in the first stage of migrating the platform — six years of code — to a layered architecture, removing raw SQL queries from controllers entirely.',
        'Verified every change module by module before moving on, reviewed by the tech lead at each step. Three months of work.',
      ],
      infrastructure: [
        'Containerised the application with Docker, which had been running natively on the machine, and deployed it on a new GCP instance with nginx as a reverse proxy between the containers and the host.',
        'Ran the migration in parallel: brought up and validated the new instance while the old one was still in production, configured the domain DNS and issued the certificates with Certbot until the application ran entirely over HTTPS. No service interruption.',
      ],
      'portfolio-agent': [
        'Built a conversational assistant that answers questions about my background and the decisions behind each project, with an explicit notice that an agent is answering and can be wrong.',
        'Rebuilt the orchestration in Python on deployment, because the Vercel free plan does not support n8n; dropped litellm after measuring it (133 MB of 199, against a 250 MB per-function ceiling) and talk to the model over plain REST with httpx.',
      ],
      'video-cli': [
        'Built a TypeScript command-line tool that splits long video into vertical clips: Whisper transcription, script generation by a model whose output is schema-validated, speech synthesis, and subtitle rendering with Remotion.',
        'Persisted every step to disk and made the process resumable, so already-paid model calls are never repeated.',
      ],
      'portfolio-site': [
        'Built this site with React and TypeScript, with variable type and animations written by hand, reinterpreting an existing design system and crediting it in the footer.',
      ],
    },
  },
};

/**
 * Empleador real de cada marca. En un CV la experiencia se agrupa por CONTRATO: CK es
 * del mismo grupo que GAF, así que sus proyectos van bajo GAF y no como un empleo
 * paralelo —dos entradas con el mismo periodo se leen como dos trabajos a la vez.
 */
export const EMPLOYERS: Record<string, { name: { es: string; en: string } }> = {
  gaf: { name: { es: 'GAF Technology Solutions', en: 'GAF Technology Solutions' } },
  self: { name: { es: 'Autónomo', en: 'Self-employed' } },
};

/**
 * La línea que sitúa al empleador se lee del propio profile (`employments[].tagline`),
 * que es la misma que muestra la web. Mantenerla aquí duplicada fue lo que permitió que
 * el CV y el sitio dijeran cosas distintas sobre la empresa.
 */
