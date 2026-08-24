import type { Profile } from './types';

/* `facts` se lee por POSICIÓN desde tools/cv/src/build.ts, no por etiqueta: reordenar
   este array cambia lo que sale impreso en el CV. */
export const es = {

  name: 'Wilfred Morales',
  role: 'Desarrollador backend',
  stack: 'PHP/Laravel · PostgreSQL · Python',
  credential:
    'Lógica de negocio configurable, integraciones con servicios externos y procesos por lotes, en producción.',
  availability: 'Disponible de inmediato · Buscando mi próximo rol como desarrollador backend',
  trajectory: 'Remoto · Colombia (GMT-5)',
  heroSlogan: { start: 'Ideas', link: 'hechas', end: 'Producto' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
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
        'Ingeniería Informática, Universidad Nacional Experimental del Táchira (UNET).',
    },
    {
      id: 'languages',
      label: 'Idiomas y certificaciones',
      value:
        'Español nativo · Inglés B2 (EF SET) · Google IT Automation with Python — Coursera (en curso)',
    },
    {
      id: 'mode',
      label: 'Modalidad',
      value:
        'Remoto · GMT-5 · Contratación local en Colombia o internacional vía Deel.',
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
        'APIs REST',
        'Python',
        'Node.js',
        'Arquitectura por capas (dominio, aplicación, persistencia)',
        'Pruebas (PHPUnit)',
      ],
    },
    {
      area: 'Bases de datos',
      items: [
        'PostgreSQL',
        'SQL',
        'MySQL',
        'Modelado de datos y migraciones',
        'Optimización de consultas e índices',
      ],
    },
    {
      area: 'Seguridad y control de accesos',
      items: [
        'Roles y permisos (Spatie)',
        'MFA y gestión de sesiones',
        'SAST y detección de secretos (Snyk, gitleaks)',
        'reCAPTCHA Enterprise',
      ],
    },
    {
      area: 'Automatización e IA',
      items: ['API de DeepSeek', 'OpenAI API', 'n8n', 'Integración de APIs y webhooks'],
    },
    {
      area: 'Frontend',
      items: ['Vue.js', 'Inertia.js', 'Blade'],
    },
    {
      area: 'Infraestructura',
      items: ['Docker', 'Linux', 'Nginx', 'GCP', 'AWS S3', 'Certbot'],
    },
    {
      area: 'Proceso',
      items: ['Git', 'GitHub Actions', 'CI/CD', 'Metodologías ágiles'],
    },
  ],
  employments: [
    {
      id: 'gaf',
      employer: 'GAF Technology Solutions',
      tagline:
        'Fintech de crédito por libranza. Equipo de tecnología de 4 personas: 2 desarrolladores, líder técnico y responsable de infraestructura y seguridad. Las solicitudes las origina CK Comercializadora, empresa del mismo grupo.',
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
          id: 'esignature',
          title: 'Firma electrónica con validación de identidad',
          summary:
            'Un documento de 24 páginas que se llenaba a mano, ahora generado desde plantillas y firmado tras verificar la identidad del cliente.',
          metrics: [
            { value: '24', label: 'páginas antes a mano' },
            { value: '20 min', label: 'trámite completo' },
          ],
          body: {
            problem:
              'El módulo anterior estaba en desuso y el documento —24 páginas— se llenaba a mano. Construí el módulo desde cero: ahora se genera automáticamente desde plantillas, con una plantilla distinta por producto.',
            hard:
              'Lo difícil no es firmar: es que todo encaje antes de firmar. El asesor aprueba un borrador, se validan los datos del cliente contra TransUnion y la identidad se verifica por OTP o KBA. Diseñé el flujo como una máquina de estados sobre las respuestas asíncronas de la API REST del proveedor, para que un proceso largo termine siempre en un documento válido o en un error que el usuario pueda resolver.',
            result:
              'El proveedor devuelve el documento firmado con su hash, queda la trazabilidad de la transacción y el respaldo en S3. El trámite completo se cierra en unos 20 minutos, frente a un llenado manual de 24 páginas.',
          },
          tags: ['Laravel', 'Vue.js', 'Python', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'scoring',
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
          id: 'access-control',
          title: 'Control de accesos y permisos',
          summary:
            'Árbol de permisos sobre 17 módulos, hasta el nivel de opción y subproceso, con los usuarios y roles existentes migrados sin parar la operación.',
          metrics: [{ value: '17', label: 'módulos cubiertos' }],
          brief:
            'Construí el árbol de permisos de la plataforma sobre 17 módulos, con permisos a nivel de opción y de subproceso, blindé ruta a ruta y migré los usuarios y roles existentes al esquema nuevo sin interrumpir la operación.',
          tags: ['Spatie Permission', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'layered-migration',
          title: 'Migración a arquitectura por capas',
          summary:
            'Primera etapa de la migración de seis años de código, módulo a módulo, hasta dejar los controladores sin una sola consulta SQL en crudo.',
          metrics: [
            { value: '6 años', label: 'de código heredado' },
            { value: '3 meses', label: 'de trabajo' },
          ],
          brief:
            'Participé en la primera etapa de la migración de la plataforma —seis años de código— hacia una arquitectura por capas, verificando módulo a módulo cada cambio antes de continuar y eliminando por completo las consultas SQL en crudo de los controladores. Tres meses de trabajo, con revisión del líder técnico en cada paso.',
          tags: ['Arquitectura por capas', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'infrastructure',
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
      category: 'Proyectos',
      items: [
        {
          id: 'video-cli',
          title: 'CLI de recorte de vídeo',
          role: 'Proyecto propio',
          period: 'Jul 2026 – en curso',
          summary:
            'Parte un vídeo largo en clips verticales: transcribe, escribe el guion, narra y monta los subtítulos, paso a paso y reanudable.',
          brief:
            'Construí una herramienta de línea de comandos en TypeScript que parte un vídeo largo en clips verticales: transcribe con Whisper, escribe el guion con un modelo cuya salida se valida contra un esquema antes de usarla, narra con síntesis de voz y monta los subtítulos con Remotion. Cada paso persiste su resultado en disco y el proceso es reanudable, para no repetir llamadas al modelo ya pagadas.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
        },
        {
          id: 'portfolio-site',
          title: 'Portfolio',
          role: 'Proyecto propio',
          period: '2026',
          summary:
            'Este sitio y su backend: una pantalla sin scroll con los titulares formados por partículas, y un agente en Python que responde sobre mi trayectoria.',
          metrics: [{ value: '133 MB', label: 'de dependencia descartada' }],
          brief:
            'Construí este sitio con React y TypeScript: una sola pantalla sin scroll que se recorre por planos, con un campo de partículas en canvas 2D que muestrea la tipografía del propio documento y forma con ella los titulares, sin librería de animación. El contenido bilingüe sale de un único archivo de perfil que alimenta también el CV en PDF. Detrás corre un agente conversacional en Python sobre funciones serverless, que responde sobre mi trayectoria y las decisiones de cada proyecto: solo sabe lo que hay en su base de conocimiento, archivos de texto versionados, y avisa de que responde un agente y puede equivocarse. Lo monté primero con n8n y la API de OpenAI, y al desplegarlo rehíce la orquestación en Python porque el plan gratuito de Vercel no soporta n8n. Descarté litellm al medirlo (pesaba 133 MB de los 199 que ocupaban las dependencias, contra un límite de 250 MB por función) y hablo con el modelo por REST directo con httpx.',
          tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'Vercel'],
          url: 'https://github.com/wilfred524/portfolio',
        },
      ],
    },
  ],
  social: [
    { label: 'GitHub', url: 'https://github.com/wilfred524' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wilfred-morales-3220b2126' },
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
      own: 'Proyectos propios',
      stack: 'Stack',
      contact: 'Contacto',
      enter: 'Empezar',
      skipToWork: 'Ir al trabajo',
      documentMode: 'Modo documento',
      observatoryMode: 'Modo observatorio',
    },
    blocks: { problem: 'Problema', hard: 'Lo difícil', result: 'Resultado' },
    project: {
      open: 'Ver detalle',
      close: 'Cerrar',
      metrics: 'Cifras',
      stack: 'Tecnologías',
      visit: 'Ver el repositorio',
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
