import type { Profile } from './types';

/* `facts` se lee por POSICIÓN desde tools/cv/src/build.ts, no por etiqueta: reordenar
   este array cambia lo que sale impreso en el CV. */
export const es = {

  name: 'Wilfred Morales',
  role: 'Desarrollador backend',
  stack: 'PHP · Laravel · PostgreSQL · Python',
  credential:
    'Lógica de negocio configurable, integraciones con servicios externos y procesos por lotes, en producción.',
  availability: 'Desarrollador backend freelance · Abierto a empleo o contratos, en remoto o en Bogotá',
  trajectory: 'Bogotá, Colombia · Remoto, híbrido o presencial (GMT-5)',
  heroSlogan: { start: 'Ideas', link: 'hechas', end: 'Producto' },
  location: 'Bogotá, Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 322 310 3476',
  repoUrl: 'https://github.com/wilfred524/portfolio',
  siteUrl: 'https://portfolio-wilfred524.vercel.app',
  cv: { label: 'Descargar CV', url: '/Wilfred-Morales-Desarrollador-Backend.pdf' },
  colophon:
    'React y TypeScript, sin librería de animación: el campo de partículas es canvas 2D y muestrea la tipografía del propio documento para formar cada titular. Un único archivo de perfil surte la página, el CV en PDF y lo que el asistente sabe. El asistente corre en Python sobre funciones serverless. El código está público.',
  facts: [
    {
      id: 'education',
      label: 'Formación',
      value:
        'Ingeniería Informática, Universidad Nacional Experimental del Táchira (UNET), en curso.',
    },
    {
      id: 'languages',
      label: 'Idiomas y certificaciones',
      value:
        'Español nativo · Inglés B2 (EF SET) · Google Cloud Fundamentals y Claude Code · Preparando Google Cloud ACE',
    },
    {
      id: 'mode',
      label: 'Modalidad',
      value:
        'Remoto, híbrido o presencial en Bogotá · GMT-5 · Contratación local en Colombia o internacional.',
    },
    {
      id: 'domain',
      label: 'Dominio',
      value:
        'Crédito por libranza: préstamos con descuento directo de nómina, un sector regulado en Colombia (Ley 1527).',
    },
  ],
  skillGroups: [
    {
      area: 'Backend',
      items: [
        'PHP',
        'Laravel',
        'Eloquent ORM',
        'Laravel Queues',
        'Composer',
        'APIs REST',
        'Python',
        'FastAPI',
        'Node.js',
        'Arquitectura por capas',
      ],
    },
    {
      area: 'Bases de datos',
      items: [
        'PostgreSQL',
        'MySQL',
        'SQL',
        'Supabase',
        'Modelado de datos y migraciones',
        'Optimización de consultas e índices',
      ],
    },
    {
      area: 'Seguridad y control de accesos',
      items: [
        'Spatie Laravel Permission',
        'RBAC',
        'MFA',
        'Gestión de sesiones',
        'Row Level Security (RLS)',
        'Snyk',
        'Gitleaks',
        'reCAPTCHA Enterprise',
      ],
    },
    {
      area: 'Automatización e IA',
      items: ['Desarrollo asistido por IA', 'OpenAI API', 'API de DeepSeek', 'n8n', 'Webhooks'],
    },
    {
      area: 'Frontend',
      items: ['Vue.js 3', 'Inertia.js', 'Blade', 'Tailwind CSS', 'Vite'],
    },
    {
      area: 'Infraestructura y nube',
      items: [
        'Docker',
        'Docker Compose',
        'Linux',
        'Bash',
        'Nginx',
        'Google Cloud (GCP)',
        'AWS',
        'AWS S3',
        'Vercel',
        'Certbot',
      ],
    },
    {
      area: 'Proceso',
      items: ['Git', 'GitHub', 'Pull requests', 'GitHub Actions', 'CI/CD', 'PHPUnit', 'Scrum', 'Metodologías ágiles'],
    },
  ],
  employments: [
    {
      id: 'freelance',
      employer: 'Freelance',
      tagline:
        'Desarrollo por encargo, en remoto.',
      role: 'Desarrollador backend',
      period: 'Ago 2026 – actualidad',
      mode: 'Remoto',
    },
    {
      id: 'gaf',
      employer: 'GAF Technology Solutions',
      tagline:
        'Fintech de crédito por libranza. Equipo de tecnología de 4 personas. Flujo con Git por ramas y pull requests, en sprints (Scrum). Además del backend, construí el frontend de mis módulos en Vue.js e Inertia.js, y casi todo el de CK Comercializadora, empresa del mismo grupo.',
      role: 'Desarrollador backend',
      period: 'Oct 2025 – Jul 2026',
      mode: 'Contrato por obra o labor · Remoto, Colombia',
    },
  ],
  projectGroups: [
    {
      category: 'Plataforma GAF',
      employmentId: 'gaf',
      items: [
        {
          id: 'rules-engine',
          diagram: 'rules-engine.html',
          title: 'Motor de reglas de crédito',
          summary:
            'Las políticas de crédito viven como datos en PostgreSQL, no como código: negocio ajusta un límite de plazo sin esperar un despliegue.',
          body: {
            problem:
              'Cambiar una política de crédito exigía un despliegue: el área de negocio no podía ajustar un límite de plazo o una condición de embargo sin pasar por desarrollo.',
            hard:
              'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL (elegibilidad, embargos, límites de plazo, requisitos laborales y financieros por pagaduría), de modo que el código no sabe cuáles son las reglas, solo cómo aplicarlas. Sobre esa base implementé la evaluación completa: cálculo de capacidad de endeudamiento según la Ley 1527 (libranzas) y la Ley 50 para activos y pensionados, criterios de decisión, reglas especiales, reevaluación de solicitudes y las validaciones de front-end y back-end.',
            result:
              'El área de negocio ajusta parámetros sin tocar código ni esperar despliegue, y cada solicitud queda trazada al asesor que la originó. La API REST de envío la construyó un compañero; reestructuré el cuerpo de sus peticiones varias veces conforme cambiaba el modelo.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
        {
          id: 'scoring',
          diagram: 'scoring.html',
          title: 'Proceso mensual de puntaje crediticio',
          summary:
            'Un contenedor con cron mensual saca los datos de PostgreSQL, ejecuta el modelo de riesgo y carga los resultados sin intervención manual.',
          metrics: [
            { value: '320.000+', label: 'personas por corrida' },
            { value: '5.000', label: 'filas por bloque' },
          ],
          body: {
            problem:
              'Un modelo de riesgo vivía en un script del área de riesgo, sin forma de llegar a producción.',
            hard:
              'Lo empaqueté en un contenedor con cron mensual: extrae de PostgreSQL, ejecuta el modelo, comprueba que el artefacto se haya regenerado antes de seguir adelante y carga en bloques de 5.000 para acotar el tamaño de cada sentencia. El proceso es idempotente y reanudable, y descarta las filas inválidas sin abortar la carga entera.',
            result:
              'El modelo no es mío; la tubería que lo pone en producción sí. Más de 320.000 personas distintas quedan puntuadas en cada corrida, sin intervención manual.',
          },
          tags: ['Python', 'PostgreSQL', 'Docker', 'Laravel'],
        },
        {
          id: 'query-optimization',
          diagram: 'query-optimization.html',
          title: 'Optimización de consultas en producción',
          summary:
            'Una consulta que tardaba entre 20 y 30 segundos y acababa en timeout, resuelta con filtros previos, índices y paginación.',
          metrics: [
            { value: '3-6 s', label: 'antes 20-30 s' },
            { value: '0', label: 'timeouts' },
          ],
          body: {
            problem:
              'Una consulta que cruzaba varias tablas tardaba entre 20 y 30 segundos en devolver los datos, y con volúmenes altos terminaba en timeout: la pantalla que dependía de ella quedaba inservible justo cuando más registros había.',
            hard:
              'No reescribí la consulta entera: separé las tres causas y ataqué cada una. Apliqué filtros previos para que el cruce no partiera del conjunto completo, creé índices sobre los campos que participaban en los cruces y en los filtros, y paginé la respuesta para que la carga dejara de traerlo todo de golpe.',
            result:
              'Los tiempos bajaron a entre 3 y 6 segundos según el tamaño de la respuesta, y los timeouts desaparecieron.',
          },
          tags: ['PostgreSQL', 'SQL', 'Laravel', 'Eloquent ORM'],
        },
        {
          id: 'esignature',
          diagram: 'esignature.html',
          title: 'Firma electrónica con validación de identidad',
          summary:
            'Un documento de 24 páginas que se llenaba a mano, ahora generado desde plantillas y firmado tras verificar la identidad del cliente.',
          metrics: [
            { value: '24', label: 'páginas antes a mano' },
            { value: '20 min', label: 'trámite completo' },
          ],
          body: {
            problem:
              'El módulo anterior estaba en desuso y el documento, de 24 páginas, se llenaba a mano. Construí el módulo desde cero: ahora se genera automáticamente desde plantillas, con una plantilla distinta por producto.',
            hard:
              'Lo difícil no es firmar: es que todo encaje antes de firmar. El asesor aprueba un borrador, se validan los datos del cliente contra TransUnion y la identidad se verifica por OTP o KBA. Diseñé el flujo como una máquina de estados sobre las respuestas asíncronas de la API REST del proveedor, para que un proceso largo termine siempre en un documento válido o en un error que el usuario pueda resolver.',
            result:
              'El proveedor devuelve el documento firmado con su hash, queda la trazabilidad de la transacción y el respaldo en S3. El trámite completo se cierra en unos 20 minutos, frente a un llenado manual de 24 páginas.',
          },
          tags: ['Laravel', 'Vue.js', 'Python', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'access-control',
          diagram: 'access-control.html',
          title: 'Control de accesos y permisos',
          summary:
            'Árbol de permisos sobre 17 módulos, hasta el nivel de opción y subproceso, con los usuarios y roles existentes migrados sin parar la operación.',
          metrics: [{ value: '17', label: 'módulos cubiertos' }],
          brief:
            'Construí el árbol de permisos de la plataforma sobre 17 módulos, con permisos a nivel de opción y de subproceso, blindé ruta a ruta y migré los usuarios y roles existentes al esquema nuevo sin interrumpir la operación. También implementé el MFA: al entrar desde un equipo nuevo se pide un código de un solo uso por correo, que expira en 15 minutos, y la confianza queda recordada por usuario y equipo.',
          tags: ['Spatie Permission', 'MFA', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'layered-migration',
          diagram: 'layered-migration.html',
          title: 'Migración a arquitectura por capas',
          summary:
            'Primera etapa de la migración de seis años de código, módulo a módulo, hasta dejar los controladores sin una sola consulta SQL en crudo.',
          metrics: [
            { value: '6 años', label: 'de código heredado' },
            { value: '3 meses', label: 'de trabajo' },
          ],
          brief:
            'Participé en la primera etapa de la migración de la plataforma, con seis años de código, hacia una arquitectura por capas, verificando módulo a módulo cada cambio antes de continuar y eliminando por completo las consultas SQL en crudo de los controladores. Tres meses de trabajo, con revisión del líder técnico en cada paso.',
          tags: ['Arquitectura por capas', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'infrastructure',
          diagram: 'infrastructure.html',
          title: 'Infraestructura y despliegue',
          summary:
            'La aplicación pasó de correr nativa a un contenedor en una instancia nueva de GCP, con nginx delante y migración en paralelo, sin cortar el servicio.',
          body: {
            problem:
              'La aplicación corría de forma nativa sobre la máquina, sin aislamiento entre el entorno y el código.',
            hard:
              'Dockericé la aplicación y la desplegué en una instancia nueva de GCP, con nginx como proxy inverso entre los contenedores y el host.',
            result:
              'Ejecuté la migración en paralelo: levanté y validé la instancia nueva con la anterior aún en producción, configuré el DNS del dominio y emití los certificados con Certbot hasta dejar la aplicación operando íntegramente sobre HTTPS. Sin interrupción del servicio.',
          },
          tags: ['Docker', 'Linux', 'Nginx', 'GCP', 'Certbot'],
        },
      ],
    },
    {
      category: 'Proyectos freelance',
      employmentId: 'freelance',
      items: [
        {
          id: 'gestienda',
          diagram: 'gestienda.html',
          title: 'Gestienda',
          role: 'Proyecto freelance',
          period: 'Nov 2026 – actualidad',
          summary:
            'Plataforma para pequeños comercios: ventas a crédito, cobros e inventario, también sin conexión. En producción con un cliente real.',
          metrics: [{ value: 'Sin cuadernos', label: 'fiados, cobranzas y ventas en una pantalla' }],
          body: {
            problem:
              'El cliente llevaba todas sus cuentas en cuadernos: los fiados y las cobranzas eran lentos de seguir y propensos a errores, porque un abono o un límite pasado por alto no lo avisaba nadie.',
            hard:
              'Construí una PWA en React sobre Supabase con dos pilares: fiados (créditos con abonos y límites) y ventas con inventario de mostrador. Las reglas de saldo, límite y stock viven en PostgreSQL: un trigger calcula el saldo, el libro de movimientos es de solo inserción y se escribe únicamente por funciones con permisos por tienda. Sin conexión, cada operación se guarda en una cola local con un identificador único y se envía en orden al volver la red; reenviarla no la duplica.',
            result:
              'El cliente vende, cobra y revisa el estado diario de la tienda desde una sola pantalla, en una herramienta que lleva consigo: se instala en Android como app. Las migraciones de esquema se aplicaron en producción con respaldo previo y verificación de cada saldo antes y después.',
          },
          tags: ['React', 'JavaScript', 'PostgreSQL', 'Supabase', 'PWA'],
        },
        {
          id: 'cristal-lumired',
          diagram: 'cristal-lumired.html',
          title: 'Sitio web y cotizador para una vidriería (en desarrollo)',
          role: 'Proyecto freelance',
          period: 'Ago 2026 – actualidad',
          summary:
            'El cliente calculaba sus precios de ventanas, puertas y mamparas en un Excel. El cotizador reproduce esa planilla y da un precio sin dejar ver la lista.',
          metrics: [{ value: '898', label: 'celdas del Excel reproducidas' }],
          brief:
            'Construí el cotizador de una vidriería chilena a partir de la planilla de precios que el cliente mantenía. La extraje una sola vez a JSON, desplegando cada fórmula hasta dejarla escrita sobre medidas y costos fijos, y el motor, en Python y FastAPI, reproduce las 898 celdas que Excel había calculado. La landing y el cotizador, en Vue y Tailwind, están diseñados para ser públicos: salen prerenderizados y su API devuelve solo la combinación pedida, porque enviar la grilla habría entregado la lista de precios a cualquiera que abriera las herramientas del navegador.',
          tags: ['Python', 'FastAPI', 'Vue.js', 'Tailwind CSS', 'Vercel'],
        },
      ],
    },
  ],
  social: [
    { label: 'GitHub', url: 'https://github.com/wilfred524' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wilfred-morales' },
  ],
  ui: {
    sections: {
      experience: 'Experiencia',
      skills: 'Habilidades',
      contact: 'Contacto',
      colophon: 'Cómo está hecho este sitio',
      profile: 'Perfil',
    },
    planes: {
      ariaLabel: 'Planos',
      previous: 'Plano anterior',
      next: 'Plano siguiente',
      threshold: 'Inicio',
      context: 'Contexto',
      data: 'Datos y decisión',
      platform: 'Plataforma',
      own: 'Proyectos freelance',
      stack: 'Stack',
      contact: 'Contacto',
      enter: 'Empezar',
      skipToWork: 'Ir al trabajo',
      documentMode: 'Modo documento',
      observatoryMode: 'Modo observatorio',
      skipToContent: 'Saltar al contenido',
      position: 'Vista {n} de {total}',
    },
    blocks: { problem: 'Problema', hard: 'Lo difícil', result: 'Resultado' },
    project: {
      open: 'Ver detalle',
      close: 'Cerrar',
      metrics: 'Cifras',
      stack: 'Tecnologías',
      visit: 'Ver el repositorio',
      diagram: 'Arquitectura',
      diagramHint:
        'Dentro del diagrama las flechas mueven la vista y + y − acercan. Pulsa Tab para volver a la página.',
      diagramOpen: 'Abrir el diagrama',
    },
    viewCode: 'Ver el código',
    chat: {
      title: 'Pregunta lo que la página no cuenta',
      intro:
        'Por qué tomó cada decisión, cómo trabaja y qué hay detrás de cada proyecto.',
      placeholder: 'Escribe tu pregunta',
      send: 'Enviar',
      thinking: 'Pensando',
      error: 'No he podido responder. Escríbele directamente a wilfred3019@gmail.com.',
      logLabel: 'Conversación con el agente',
      disclaimer: 'Responde un agente, no Wilfred. Puede equivocarse.',
      launcher: 'Pregunta al agente',
      closeLabel: 'Cerrar el chat',
      invite: '¿Algo que la página no cuenta? Pregúntamelo.',
      inviteDismiss: 'Descartar',
    },
  },
} satisfies Profile;
