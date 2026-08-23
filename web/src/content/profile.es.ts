/**
 * Contenido en español. La estructura la fija `types.ts`; el `satisfies Profile` del
 * final garantiza que este archivo y `profile.en.ts` no se desincronicen.
 */
import type { Profile } from './types';

export const es = {

  name: 'Wilfred Morales',
  role: 'Desarrollador backend',
  /**
   * Stack de cabecera: lo que un reclutador técnico busca en los primeros dos segundos.
   * Sin el dominio. El nicho es la prueba, no la identidad: en el titular solo cierra
   * puertas fuera del sector, y dentro del sector lo van a encontrar igual porque está
   * en la entrada de empleo, en los proyectos y en la ficha Dominio de Contacto.
   */
  stack: 'PHP/Laravel · PostgreSQL · Python',
  /**
   * La credencial: qué clase de problemas resuelve, no cuáles. Nombrar aquí el motor de
   * reglas, la firma y el scoring era repetir media pantalla antes lo que la sección de
   * experiencia cuenta entero, con su nombre y su contexto; y una lista de tres sistemas
   * de crédito encasilla en el sector donde se hicieron.
   * Categorías, no logros: son las mismas en cualquier sector, y hacen que el lector
   * llegue a la experiencia sabiendo qué va a encontrar.
   */
  credential:
    'Lógica de negocio configurable, integraciones con servicios externos y procesos por lotes, en producción.',
  /* "Disponible para nuevos proyectos" leía freelance; la búsqueda es de empleo. */
  availability: 'Disponible de inmediato · Buscando mi próximo rol como desarrollador backend',
  /**
   * Logística, bajo el hero. Ya no lleva el marco temporal: las fechas están en la
   * entrada de empleo, que es donde se buscan, y adelantarlas al primer viewport solo
   * pone un número en la cabeza del lector antes de que haya leído qué hay dentro de
   * esos meses. No es ocultarlo —está en el documento— es no subrayarlo.
   * En su lugar, la modalidad: remoto, que es el dato que sí filtra.
   */
  trajectory: 'Remoto · Colombia (GMT-5)',
  /** Slogan editorial: vive en la banda Ink (Masthead), no en el hero. */
  heroSlogan: { start: 'Ideas', link: 'hechas', end: 'Producto' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  /** Repositorio de este sitio: evidencia inspeccionable sin firmar nada. */
  repoUrl: 'https://github.com/wilfred524/portfolio',
  /** Dominio de producción en Vercel; sin dominio propio todavía. */
  siteUrl: 'https://portfolio-wilfred524.vercel.app',
  /**
   * CV en dos idiomas. Los genera `npm run build:cv` (workspace @portfolio/cv) desde este mismo
   * archivo, así que no pueden contradecir a la web. El script exporta también el PDF
   * con Chrome headless; si no hay Chrome, quedan solo los .html y hay que imprimirlos.
   */
  cv: { label: 'Descargar CV', url: '/Wilfred-Morales-Desarrollador-Backend.pdf' },
  /**
   * «Cómo está hecho»: a nivel JR/intermedio, la prueba de que se aprende solo pesa
   * tanto como el stack. Incluye el uso de IA como herramienta, que es cómo se
   * trabaja hoy y es una competencia declarable, no una carencia.
   */
  colophon:
    'Este sitio es React y TypeScript, con tipografía variable y animaciones sin librería. El asistente corre sobre Python en funciones serverless, con su base de conocimiento en archivos de texto versionados. Escribo apoyándome en IA: defino la arquitectura, doy las instrucciones y verifico cada paso. El código está público.',
  /* Aquí había un `closing`, el cierre de la página. Se retira, no se reescribe: esa
     frase la generó una IA y Wilfred no la reconocía como suya. Si algún día hay una
     escrita por él, vuelve; una frase de relleno en el cierre resta más de lo que aporta
     una sección que termine directamente en los datos de contacto. */
  /**
   * Sección Perfil: responde de una vez lo que un evaluador se pregunta en los primeros
   * segundos y hoy no tenía respuesta en ninguna parte de la página.
   * Las líneas con `value` vacío no se renderizan.
   *
   * El enlace del certificado apunta a web/public/ef-set-certificate.pdf. Si el archivo
   * no está, la fila sigue mostrándose pero el enlace da 404: comprobarlo antes de
   * desplegar.
   */
  facts: [
    {
      id: 'education',
      label: 'Formación',
      /* Sin el estado de la carrera, por decisión suya. Antes decía «Cursando 7.º
         semestre», que no cuadra con el expediente real y quedaba expuesto si alguien
         pedía el certificado. La contrapartida de quitarlo es que sin estado se lee como
         título obtenido: eso lo aclara él en la primera conversación, no la página. */
      value:
        'Ingeniería Informática, Universidad Nacional Experimental del Táchira (UNET).',
    },
    {
      id: 'languages',
      label: 'Idiomas y certificaciones',
      /* Idiomas y certificaciones fusionados: dos líneas para tres datos cortos partían
         el bloque sin ganar nada. Sin enlace al certificado y sin desglose por destreza:
         el resultado real es B2 global con lectura C2 pero B1 en comprensión oral, habla
         y escritura, así que publicar el desglose invita a una auditoría que no
         acompaña, y citar solo el C2 sería escoger el dato favorable. El nivel global es
         el que se declara en un CV. El examen se va a repetir; revisar entonces. */
      value:
        'Español nativo · Inglés B2 (EF SET) · Google IT Automation with Python — Coursera (en curso)',
    },
    {
      id: 'mode',
      label: 'Modalidad',
      /* Sin mención a documentos, visado ni patrocinio: son datos que no se piden y que
         invitan a filtrar por nacionalidad antes de leer nada técnico. Lo que importa es
         cómo se contrata y en qué franja horaria se trabaja. */
      value:
        'Remoto · GMT-5 · Contratación local en Colombia o internacional vía Deel.',
    },
    {
      id: 'domain',
      label: 'Dominio',
      value:
        'Crédito por libranza: préstamos con descuento directo de nómina, un sector regulado en Colombia (Ley 1527).',
    },
    /* `as` y no `satisfies`: sin ninguna entrada con `href`, satisfies estrecha el tipo
       y los consumidores dejan de ver los campos opcionales. */
  ],
  /** Sin niveles: el ORDEN comunica el dominio (spec Henry: énfasis por escala, no por etiqueta). */
  /*
   * Solo lo que tiene respaldo demostrable en la experiencia o en un proyecto público.
   * Una habilidad que no se puede defender en una entrevista cuesta más de lo que suma.
   *
   * Lo que se retira, se retira preguntándole a él. Deducirlo del resto del contenido no
   * funciona: que la plataforma no tuviera suite de pruebas al empezar la migración no
   * dice nada sobre si escribió pruebas después, y no dijo.
   *
   * Fuera, por no tener respaldo: DDD, pytest, colas y trabajos en segundo plano,
   * JWT/OAuth2/SSO, cifrado, pandas, NumPy y SQLAlchemy. Una ausencia de esta lista nunca
   * autoriza a negar que lo haya hecho.
   *
   * CI/CD volvió: se había retirado por decisión suya y el efecto fue perder uno de los
   * literales más buscados sin ganar nada a cambio.
   */
  /*
   * Cada elemento es UN literal buscable. Antes había ítems compuestos —«PHP / Laravel»,
   * «PostgreSQL / SQL», «Linux / Nginx»— que se leían bien pero no se tokenizaban: un
   * filtro que parte la lista por su separador produce el token «PHP / Laravel» y nunca
   * «PHP» ni «Laravel» sueltos, así que la coincidencia con la vacante no ocurre. Se
   * parten. El coste es una lista más larga; la ganancia es que puntúa.
   *
   * Las incorporaciones (APIs REST, Eloquent ORM, Git, CI/CD, ágiles, optimización de
   * consultas) son cosas que ya hacía y que simplemente no estaban escritas. No reclamar
   * algo cierto no es prudencia: es puntuación regalada.
   */
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
      /* Grupo propio: era la única familia con proyectos que la respaldaban —el motor de
         reglas, el scoring, la optimización de consultas— y aparecía diluida dentro de
         Backend. MySQL, además, seguía en la lista sin ningún proyecto detrás. */
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
      /* Seguridad y control de accesos van juntos: cuatro elementos en un grupo se leen
         mejor que dos grupos de dos, y en una plataforma de crédito son el mismo
         trabajo. MFA y gestión de sesiones fue una tarea sostenida durante el contrato,
         no puntual. */
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
      /* Solo lo tocado en producción. Seis tecnologías de frontend en un perfil que se
         titula backend diluyen el foco; React y TypeScript siguen visibles donde tienen
         respaldo, en los proyectos propios. */
      area: 'Frontend',
      items: ['Vue.js', 'Inertia.js', 'Blade'],
    },
    {
      area: 'Infraestructura',
      items: ['Docker', 'Linux', 'Nginx', 'GCP', 'AWS S3', 'Certbot'],
    },
    {
      /* CI/CD vuelve. Se había retirado por decisión suya —lo trabajó de forma sostenida
         pero no quería venderlo como especialidad—, y el efecto real fue perder uno de
         los literales más buscados sin ganar nada: nadie lee una ausencia como modestia.
         Va aquí, junto a Git y al método de trabajo, y no en Infraestructura, que es
         donde se leería como especialidad. */
      area: 'Proceso',
      items: ['Git', 'GitHub Actions', 'CI/CD', 'Metodologías ágiles'],
    },
  ],
  employments: [
    {
      id: 'gaf',
      employer: 'GAF Technology Solutions',
      /* Sitúa la empresa y el tamaño del equipo: en una plantilla de 4, «desarrollador
         backend» significa tocar infraestructura y despliegue, no solo endpoints. */
      tagline:
        'Fintech de crédito por libranza. Equipo de tecnología de 4 personas: 2 desarrolladores, líder técnico y responsable de infraestructura y seguridad. Las solicitudes las origina CK Comercializadora, empresa del mismo grupo.',
      role: 'Desarrollador backend',
      period: 'Oct 2025 – Jul 2026',
      mode: 'Contrato por obra o labor · Remoto, Colombia',
    },
  ],
  projectGroups: [
    {
      /* Un solo grupo para todo el contrato. El motor de reglas estaba aparte porque lo
         originaba CK, y esa separación lo sacaba de la plataforma en la que trabajó:
         era el mismo empleo y el mismo equipo. Quién origina las solicitudes ya lo dice
         el tagline del empleo, que es donde se sitúa una vez y no se repite. */
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
          /* Entrada nueva. El trabajo existía desde el principio y no estaba escrito en
             ninguna parte, pese a ser la segunda cifra más fuerte del perfil después del
             scoring: un antes y un después medidos, que es exactamente lo que un
             evaluador técnico busca y casi nadie aporta. */
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
          /* El asistente era hasta ahora una entrada aparte. No lo es: es el backend de
             este mismo sitio, y presentarlo suelto contaba dos proyectos donde hay uno,
             que es justo el inflado que este perfil evita en la experiencia laboral. */
          summary:
            'Este sitio y su backend: React y TypeScript delante, Python detrás para el agente que responde sobre mi trayectoria.',
          metrics: [{ value: '133 MB', label: 'de dependencia descartada' }],
          brief:
            'Construí este sitio con React y TypeScript, con el contenido bilingüe saliendo de un único archivo de perfil que alimenta también el CV, y las animaciones escritas sin librería. Detrás corre un agente conversacional en Python sobre funciones serverless, que responde sobre mi trayectoria y las decisiones de cada proyecto: solo sabe lo que hay en su base de conocimiento, archivos de texto versionados, y avisa de que responde un agente y puede equivocarse. Lo monté primero con n8n y la API de OpenAI, y al desplegarlo rehíce la orquestación en Python porque el plan gratuito de Vercel no soporta n8n. Descarté litellm al medirlo (pesaba 133 MB de los 199 que ocupaban las dependencias, contra un límite de 250 MB por función) y hablo con el modelo por REST directo con httpx.',
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
    nav: {
      experience: 'Experiencia',
      skills: 'Habilidades',
      contact: 'Contacto',
      ariaLabel: 'Principal',
    },
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
      goTo: 'Ir a',
      threshold: 'Inicio',
      context: 'Contexto',
      /* Los tres planos de trabajo no se llaman «Trabajo I, II y III»: un número romano no
         dice qué hay dentro. Se nombran por lo que agrupan. */
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
    credit: {
      intro: 'Interpretación del sistema de diseño',
      author: '«Henry» de Henry Desroches',
      catalogued: 'catalogado en',
      outro: 'Reconstruido en React; contenido y código propios.',
    },
  },
} satisfies Profile;
