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
      label: 'Formación',
      value:
        'Ingeniería Informática, Universidad Nacional Experimental del Táchira (UNET). Cursando 7.º semestre.',
    },
    {
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
      label: 'Modalidad',
      /* Sin mención a documentos, visado ni patrocinio: son datos que no se piden y que
         invitan a filtrar por nacionalidad antes de leer nada técnico. Lo que importa es
         cómo se contrata y en qué franja horaria se trabaja. */
      value:
        'Remoto · GMT-5 · Contratación local en Colombia o internacional vía Deel.',
    },
    {
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
   * Se retiraron Arquitectura Hexagonal, DDD, MFA y gestión de sesiones, SAST y
   * detección de secretos, pytest y CI/CD con GitHub Actions, y por el mismo criterio
   * «Pruebas (PHPUnit)»: se declaraba arriba mientras la entrada de migración dice que
   * no existía suite de pruebas, que es la contradicción que un lead ve en diez
   * segundos. Vuelve cuando haya pruebas escritas que la sostengan. Nada de eso está
   * sostenido por trabajo entregado, y una habilidad que no se puede defender en una
   * entrevista cuesta más de lo que suma. La categoría «Seguridad» desaparece por lo
   * mismo; lo que sí hubo (roles y permisos, reCAPTCHA) vive en «Control de accesos».
   */
  skillGroups: [
    {
      area: 'Backend',
      items: [
        'PHP / Laravel',
        'PostgreSQL / SQL',
        'MySQL',
        'Python',
        'Node.js',
      ],
    },
    {
      area: 'Arquitectura',
      items: ['Arquitectura por capas (dominio, aplicación, persistencia)'],
    },
    {
      area: 'Control de accesos',
      items: ['Roles y permisos (Spatie)', 'reCAPTCHA Enterprise'],
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
      items: ['Docker', 'Linux / Nginx', 'GCP', 'AWS S3', 'Certbot'],
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
      category: 'CK Comercializadora',
      employmentId: 'gaf',
      /* Una sola forma de nombrar la relación con CK, aquí y en el tagline del empleo:
         alternar «filial» y «empresa del grupo» hacía dudar de si eran dos cosas. */
      note: 'Empresa del grupo',
      items: [
        {
          id: 'rules-engine',
          title: 'Motor de reglas de crédito',
          body: {
            problem:
              'Cambiar una política de crédito exigía un despliegue: el área de negocio no podía ajustar un límite de plazo o una condición de embargo sin pasar por desarrollo.',
            hard:
              'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL (elegibilidad, embargos, límites de plazo, requisitos laborales y financieros por pagaduría), de modo que el código no sabe cuáles son las reglas, solo cómo aplicarlas. Sobre esa base implementé la evaluación completa: cálculo de capacidad de endeudamiento según la Ley 1527 (libranzas) y la Ley 50 para activos y pensionados, criterios de decisión, reglas especiales, reevaluación de solicitudes y las validaciones de front-end y back-end.',
            result:
              'El área de negocio ajusta parámetros sin tocar código ni esperar despliegue, y cada solicitud queda trazada al asesor que la originó. La API de envío la construyó un compañero; reestructuré el cuerpo de sus peticiones varias veces conforme cambiaba el modelo.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
      ],
    },
    {
      category: 'Plataforma GAF',
      employmentId: 'gaf',
      items: [
        {
          id: 'esignature',
          title: 'Firma electrónica con validación de identidad',
          body: {
            problem:
              'El módulo anterior estaba en desuso y el documento —24 páginas— se llenaba a mano. Construí el módulo desde cero: ahora se genera automáticamente desde plantillas, con una plantilla distinta por producto.',
            hard:
              'Lo difícil no es firmar: es que todo encaje antes de firmar. El asesor aprueba un borrador, se validan los datos del cliente contra TransUnion y la identidad se verifica por OTP o KBA. Diseñé el flujo como una máquina de estados sobre las respuestas asíncronas del proveedor, para que un proceso largo termine siempre en un documento válido o en un error que el usuario pueda resolver.',
            result:
              'El proveedor devuelve el documento firmado con su hash, queda la trazabilidad de la transacción y el respaldo en S3. El trámite completo se cierra en unos 20 minutos, frente a un llenado manual de 24 páginas.',
          },
          tags: ['Laravel', 'Vue.js', 'Python', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'scoring',
          title: 'Proceso mensual de puntaje crediticio',
          metric: 'Más de 320.000 personas distintas por corrida, una vez al mes',
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
          id: 'access-control',
          title: 'Control de accesos y permisos',
          brief:
            'Construí el árbol de permisos de la plataforma sobre 17 módulos, con permisos a nivel de opción y de subproceso, blindé ruta a ruta y migré los usuarios y roles existentes al esquema nuevo sin interrumpir la operación.',
          tags: ['Spatie Permission', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'layered-migration',
          title: 'Migración a arquitectura por capas',
          brief:
            'Participé en la primera etapa de la migración de la plataforma —seis años de código— hacia una arquitectura por capas, verificando módulo a módulo cada cambio antes de continuar y eliminando por completo las consultas SQL en crudo de los controladores. Tres meses de trabajo, con revisión del líder técnico en cada paso.',
          tags: ['Arquitectura por capas', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'infrastructure',
          title: 'Infraestructura y despliegue',
          body: {
            problem:
              'La aplicación corría de forma nativa sobre la máquina, sin aislamiento entre el entorno y el código.',
            hard:
              'Dockericé la aplicación y la desplegué en una instancia nueva de GCP, con nginx como proxy inverso entre los contenedores y el host.',
            result:
              'Ejecuté la migración en paralelo: levanté y validé la instancia nueva con la anterior aún en producción, configuré el DNS del dominio y emití los certificados con Certbot hasta dejar la aplicación operando íntegramente sobre HTTPS. Sin interrupción del servicio.',
          },
          tags: ['Docker', 'Linux / Nginx', 'GCP', 'Certbot'],
        },
      ],
    },
    {
      category: 'Proyectos',
      items: [
        {
          id: 'portfolio-agent',
          title: 'Asistente del portfolio',
          role: 'Proyecto propio',
          period: 'En curso',
          brief:
            'Construí un asistente conversacional que responde sobre mi trayectoria y las decisiones detrás de cada proyecto, con aviso explícito de que responde un agente y puede equivocarse. Lo monté primero con n8n y la API de OpenAI, y al desplegarlo rehíce la orquestación en Python porque el plan gratuito de Vercel no soporta n8n. Descarté litellm al medirlo —pesaba 133 MB de los 199 que ocupaban las dependencias, contra un límite de 250 MB por función— y hablo con el modelo por REST directo con httpx.',
          /* Sin `url`: el asistente ES esta página, así que enlazarla desde dentro no
             lleva a ninguna parte. En el CV sí aparece, en la línea de contacto. */
          tags: ['Python', 'FastAPI', 'DeepSeek', 'Vercel'],
        },
        {
          id: 'video-cli',
          title: 'CLI de recorte de vídeo',
          role: 'Proyecto propio',
          period: 'Jul 2026 – en curso',
          brief:
            'Construí una herramienta de línea de comandos en TypeScript que parte un vídeo largo en clips verticales: transcribe con Whisper, escribe el guion con un modelo cuya salida se valida contra un esquema antes de usarla, narra con síntesis de voz y monta los subtítulos con Remotion. Cada paso persiste su resultado en disco y el proceso es reanudable, para no repetir llamadas al modelo ya pagadas.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
        },
        {
          id: 'portfolio-site',
          title: 'Portfolio',
          role: 'Proyecto propio',
          period: '2026',
          brief:
            'Construí este sitio con React y TypeScript, con tipografía variable y animaciones sin librería, reinterpretando un sistema de diseño ajeno y acreditándolo en el pie.',
          tags: ['React', 'TypeScript', 'Vite'],
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
    },
    blocks: { problem: 'Problema', hard: 'Lo difícil', result: 'Resultado' },
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
