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
    headline: 'Desarrollador backend | PHP · Laravel · PostgreSQL · Python | Automatización y DevOps',
    /* Línea de palabras clave bajo el perfil: el reclutador que escanea salta del
       titular a buscar tecnologías, y la sección Habilidades cae en la página 2. Seis,
       no doce: es un ancla de escaneo, no un inventario. */
    /* GCP sale y «APIs REST» entra: un filtro de palabras clave busca REST en casi toda
       vacante backend, y GCP en muy pocas. Siguen siendo seis. */
    stackLine: 'Laravel · PHP · PostgreSQL · APIs REST · Python · Docker',
    /* Encabezados canónicos, no editoriales. Un extractor de CV reconoce las secciones
       por su literal contra una lista de sinónimos; lo que no reconoce lo tira a «otros»
       y deja de contarlo como experiencia o como formación. «Perfil» y «Formación» son
       correctos en español pero están más abajo en esas listas que «Resumen profesional»
       y «Educación», y no ganamos nada eligiendo el sinónimo minoritario. */
    sections: {
      summary: 'Resumen profesional',
      experience: 'Experiencia profesional',
      projects: 'Proyectos',
      skills: 'Habilidades técnicas',
      education: 'Educación',
      languages: 'Idiomas y certificaciones',
    },
    present: 'actualidad',
    /** Modalidad buscada, en la línea de contacto. */
    remote: 'Remoto o presencial',
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
      'Desarrollador backend en PHP, Laravel y Python, sobre PostgreSQL, con práctica en automatización y DevOps. Trabajo en lógica de negocio configurable, APIs REST, integraciones con servicios externos, procesos por lotes, optimización de consultas y control de accesos, y en su despliegue con Docker, Google Cloud y GitHub Actions. Tengo experiencia de producción en una fintech de crédito y como freelance.',
    ],
    bullets: {
      'rules-engine': [
        'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL: elegibilidad, embargos, límites de plazo y requisitos laborales y financieros por pagaduría. El área de negocio ajusta parámetros sin desplegar código.',
        'Implementé la evaluación completa: cálculo de capacidad de endeudamiento según la Ley 1527 (libranzas) y la Ley 50 para activos y pensionados, criterios de decisión, reglas especiales y reevaluación de solicitudes.',
        'Construí el portal público de solicitudes con validación en front-end y back-end, trazabilidad por asesor y reCAPTCHA Enterprise. Adapté sus peticiones a la API REST de envío, que construyó un compañero.',
      ],
      esignature: [
        'Construí desde cero el módulo de firma electrónica que sustituyó a uno legacy en desuso: un documento de 24 páginas que se llenaba a mano ahora se genera desde plantillas, una por producto.',
        'Diseñé el flujo como una máquina de estados sobre las respuestas asíncronas del proveedor: el asesor aprueba un borrador, se validan los datos del cliente contra TransUnion y la identidad se verifica por OTP o KBA.',
        'Integré la API REST del proveedor y el envío por correo del borrador y del firmado con Jobs de Laravel. Trámite de unos 20 minutos, con hash y respaldo en AWS S3.',
      ],
      scoring: [
        'Llevé a producción como proceso ETL en Python un modelo de riesgo que vivía en un script del área de riesgo: contenedor Docker con cron mensual que extrae de PostgreSQL, puntúa y guarda los resultados.',
        'Procesé más de 320.000 personas distintas por corrida, con carga en bloques de 5.000, proceso idempotente y reanudable, y descarte de filas inválidas sin abortar la carga.',
      ],
      'query-optimization': [
        'Reduje de 20-30 a 3-6 segundos una consulta que cruzaba varias tablas y eliminé los timeouts que dejaban inservible su pantalla con volúmenes altos.',
        'Apliqué filtros previos para que el cruce no partiera del conjunto completo, creé índices sobre los campos usados en cruces y filtros, y paginé la respuesta para que la carga dejara de traerlo todo de golpe.',
      ],
      'access-control': [
        'Construí el árbol de permisos de la plataforma sobre 17 módulos, con permisos a nivel de opción y de subproceso, blindé ruta a ruta y migré los usuarios y roles existentes al esquema nuevo sin interrumpir la operación.',
        'Implementé el MFA: código de un solo uso por correo ante un equipo nuevo, con confianza por usuario y equipo.',
      ],
      /* Antes era un solo bullet de 62 palabras con tres atenuaciones encadenadas: en la
         web eran bloques respirados, comprimidos aquí la densidad de disculpas se
         disparaba. Se conserva la que delimita autoría —la revisión del líder técnico,
         que es la única evidencia de que el código pasó por code review— y se retiran
         las que justifican el contexto. */
      'layered-migration': [
        'Participé en la primera etapa de la migración de una plataforma con seis años de código a una arquitectura por capas, y saqué por completo el SQL en crudo de los controladores.',
        'Validé cada módulo antes del siguiente, con code review del líder técnico en cada entrega, durante tres meses.',
      ],
      infrastructure: [
        'Dockericé la aplicación, que corría de forma nativa sobre la máquina, y la desplegué en una instancia nueva de GCP con nginx como proxy inverso entre los contenedores y el host.',
        'Migré en paralelo: validé la instancia nueva con la anterior aún en producción, configuré el DNS y emití los certificados con Certbot hasta operar solo sobre HTTPS, sin cortar el servicio.',
        'Trabajé en los workflows de GitHub Actions: despliegue por SSH y análisis de seguridad con Snyk y Gitleaks.',
      ],
      gestienda: [
        'Desarrollo Gestienda, una PWA en React y Supabase para pequeños comercios: ventas a crédito, cobros e inventario, en producción con un cliente real.',
        'Llevé las reglas de saldo, límite de crédito y stock a PostgreSQL: el saldo lo calcula un trigger, el libro de movimientos es de solo inserción y cada comercio accede solo a sus datos (RLS).',
        'Diseñé el modo sin conexión: las operaciones se guardan en una cola local y se envían en orden al volver la red, sin duplicarse.',
        'Aplico las migraciones de esquema en producción con respaldo previo y verificación de cada saldo antes y después, sin alterar ninguno.',
      ],
      'cristal-lumired': [
        'Convertí la planilla de Excel con que el cliente calculaba sus precios en un cotizador web. Extraje cada fórmula a datos, y el motor en Python reproduce las 898 celdas del original, contrastadas una a una con pruebas automáticas.',
        'Diseñé la API en FastAPI, serverless en Vercel, para que devuelva solo el precio pedido sin exponer la lista. Desarrollo también el sitio de la empresa en Vue y Tailwind CSS, prerenderizado para los buscadores.',
      ],
    },
  },

  en: {
    lang: 'en',
    docTitle: 'Wilfred Morales · Backend Developer',
    headline: 'Backend Developer | PHP · Laravel · PostgreSQL · Python | Automation & DevOps',
    stackLine: 'Laravel · PHP · PostgreSQL · REST APIs · Python · Docker',
    sections: {
      summary: 'Professional summary',
      experience: 'Professional experience',
      projects: 'Projects',
      skills: 'Technical skills',
      education: 'Education',
      languages: 'Languages and certifications',
    },
    present: 'Present',
    remote: 'Remote or on-site',
    fileName: 'Wilfred-Morales-Backend-Developer',
    summary: [
      'Backend developer working with PHP, Laravel and Python on PostgreSQL, with hands-on automation and DevOps. I work on configurable business logic, REST APIs, integrations with external services, batch processing, query optimisation and access control, and on deploying it with Docker, Google Cloud and GitHub Actions. My production experience comes from a credit fintech and from freelance work.',
    ],
    bullets: {
      'rules-engine': [
        'Modelled the data and translated business policy into a rules schema in PostgreSQL: eligibility, garnishments, term limits, and employment and financial requirements per payer. The business team now adjusts parameters without a deployment.',
        'Implemented the full evaluation logic: borrowing-capacity calculation under Law 1527 (payroll-deduction lending) and Law 50 for active employees and pensioners, decision criteria, special rules, and application re-evaluation.',
        'Built the public application portal with front-end and back-end validation, per-advisor traceability and reCAPTCHA Enterprise. Adapted its requests to the submission REST API, which a colleague built.',
      ],
      esignature: [
        'Built the electronic signature module from scratch, replacing a disused legacy one: a 24-page document once filled in by hand is now generated from templates, one per product.',
        'Designed the flow as a state machine over the asynchronous responses from the provider: an advisor approves a draft, customer data is validated against TransUnion, and identity is verified by OTP or KBA.',
        'Integrated the provider REST API and email delivery of the draft and signed document with Laravel Jobs. About 20 minutes end to end, with hash and a copy in AWS S3.',
      ],
      scoring: [
        'Took a risk model living in a script owned by the risk team to production as a Python ETL job: a Docker container on a monthly cron that extracts from PostgreSQL, scores and stores the results.',
        'Processed over 320,000 distinct people per run, loading in batches of 5,000, with an idempotent and resumable process and invalid-row handling that does not abort the load.',
      ],
      'query-optimization': [
        'Cut a multi-table query from 20-30 seconds down to 3-6, removing the timeouts that made the screen depending on it unusable under high volume.',
        'Applied filters upfront so the join would not start from the full set, added indexes on the fields used in joins and filters, and paginated the response so the page stopped loading everything at once.',
      ],
      'access-control': [
        'Built the platform permission tree across 17 modules, with permissions down to the option and sub-process level, locked down every route, and migrated existing users and roles to the new schema without interrupting operations.',
        'Implemented MFA: a one-time code by email on a new device, with trust per user and device.',
      ],
      'layered-migration': [
        'Took part in the first stage of migrating a platform with six years of code to a layered architecture, and removed raw SQL from controllers entirely.',
        'Validated each module before the next, with code review by the tech lead on every delivery, over three months.',
      ],
      infrastructure: [
        'Containerised the application with Docker, which had been running natively on the machine, and deployed it on a new GCP instance with nginx as a reverse proxy between the containers and the host.',
        'Migrated in parallel: validated the new instance while the old one was still in production, configured DNS and issued certificates with Certbot until it ran fully over HTTPS, with no downtime.',
        'Worked on the GitHub Actions workflows: deployment over SSH and security scanning with Snyk and Gitleaks.',
      ],
      gestienda: [
        'I build Gestienda, a React and Supabase PWA for small businesses: credit sales, payments and inventory, in production with a real client.',
        'Moved the balance, credit limit and stock rules into PostgreSQL: a trigger computes the balance, the ledger is insert only and each business can only reach its own data (RLS).',
        'Designed the offline mode: operations are saved in a local queue and sent in order when the network returns, without duplicates.',
        'I apply schema migrations in production with a prior backup and every balance checked before and after, with none altered.',
      ],
      'cristal-lumired': [
        'Turned the Excel workbook the client used to price their work into a web quoter. Extracted every formula into data, and the Python engine reproduces the 898 cells of the original, each one checked by automated tests.',
        'Designed the FastAPI API, serverless on Vercel, to return only the requested price without exposing the list. I am also building the company website in Vue and Tailwind CSS, prerendered for search engines.',
      ],
    },
  },
};

/**
 * VARIANTES DEL CV, para enviar por los portales. NO se publican.
 *
 * Un CV que dice «backend PHP/Laravel y Python» puntúa peor en las dos búsquedas que uno
 * enfocado en cada una: el filtro de la vacante de Laravel ve la mitad del documento
 * hablando de otra cosa, y el de Python lo mismo al revés. Estas variantes cambian solo
 * el titular, la línea de palabras clave, el resumen y el ORDEN de las habilidades. La
 * experiencia no se toca: es la misma en todas, porque es la que es.
 *
 * Se generan a `tools/cv/out/<variante>/` y no a `web/public/`, así que no llegan al
 * despliegue ni son alcanzables por URL directa: la página pública sigue ofreciendo un
 * solo CV por idioma. El NOMBRE del archivo es idéntico en las tres, a propósito — lo
 * que cambia es la carpeta, para que el PDF adjunto nunca delate al reclutador que
 * existe una versión distinta para otra vacante.
 *
 *   npm run build:cv                      → la general, a web/public/
 *   npm run build:cv -- --variante=laravel
 *   npm run build:cv -- --variante=datos
 *
 * `skillOrder` reordena `profile.skillGroups` por el nombre del área; los grupos que no
 * se nombren van al final en su orden original, así que añadir un grupo nuevo a
 * `profile.*.ts` no rompe nada ni obliga a tocar este archivo.
 */
export const VARIANTS = {
  laravel: {
    es: {
      headline: 'Desarrollador backend | PHP · Laravel · PostgreSQL · APIs REST',
      stackLine: 'PHP · Laravel · PostgreSQL · APIs REST · Eloquent ORM · Docker',
      summary: [
        'Desarrollador backend en PHP y Laravel, sobre PostgreSQL y MySQL. Trabajo en lógica de negocio configurable, APIs REST, integraciones con servicios externos, colas, optimización de consultas, control de accesos con Spatie y despliegue con Docker y GitHub Actions sobre Linux. Tengo experiencia de producción en una fintech de crédito y en proyectos freelance para pequeños comercios.',
      ],
      skillOrder: ['Backend', 'Bases de datos', 'Seguridad y control de accesos', 'Proceso'],
    },
    en: {
      headline: 'Backend Developer | PHP · Laravel · PostgreSQL · REST APIs',
      stackLine: 'PHP · Laravel · PostgreSQL · REST APIs · Eloquent ORM · Docker',
      summary: [
        'Backend developer working with PHP and Laravel on PostgreSQL and MySQL. I work on configurable business logic, REST APIs, integrations with external services, queues, query optimisation, access control with Spatie, and deployment with Docker and GitHub Actions on Linux. My production experience comes from a credit fintech and from freelance projects for small businesses.',
      ],
      skillOrder: ['Backend', 'Databases', 'Security and access control', 'Process'],
    },
  },
  datos: {
    es: {
      headline: 'Desarrollador backend | Automatización de procesos y datos',
      stackLine: 'Python · PostgreSQL · SQL · Docker · APIs REST · Linux',
      summary: [
        'Desarrollador backend centrado en procesos por lotes, integraciones y automatización, sobre PostgreSQL. Llevé a producción una tubería mensual en Python que ejecuta un modelo de riesgo sin intervención manual, y trabajo en APIs REST, optimización de consultas y despliegue con Docker y GitHub Actions sobre Linux. Tengo experiencia de producción en una fintech de crédito y en proyectos freelance para pequeños comercios.',
      ],
      skillOrder: ['Bases de datos', 'Backend', 'Infraestructura y nube', 'Automatización e IA', 'Proceso'],
    },
    en: {
      headline: 'Backend Developer | Process automation and data',
      stackLine: 'Python · PostgreSQL · SQL · Docker · REST APIs · Linux',
      summary: [
        'Backend developer focused on batch processing, integrations and automation, on PostgreSQL. I took a monthly Python pipeline to production that runs a risk model with no manual step, and I work on REST APIs, query optimisation and deployment with Docker and GitHub Actions on Linux. My production experience comes from a credit fintech and from freelance projects for small businesses.',
      ],
      skillOrder: ['Databases', 'Backend', 'Infrastructure and cloud', 'Automation & AI', 'Process'],
    },
  },
};

export type VariantName = keyof typeof VARIANTS;
