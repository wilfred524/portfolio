/**
 * Contenido en español. La estructura la fija `types.ts`; el `satisfies Profile` del
 * final garantiza que este archivo y `profile.en.ts` no se desincronicen.
 */
import type { Profile } from './types';

export const es = {

  name: 'Wilfred Morales',
  role: 'Desarrollador backend',
  /** Stack de cabecera: lo que un reclutador técnico busca en los primeros dos segundos. */
  stack: 'PHP/Laravel · PostgreSQL · seguridad de plataforma',
  /** La credencial: sistemas en producción y en qué dominio. Es la frase que convierte. */
  credential:
    'Firma electrónica, motor de reglas y puntaje crediticio en producción para crédito por libranza.',
  /* "Disponible para nuevos proyectos" leía freelance; la búsqueda es de empleo. */
  availability: 'Buscando mi próximo rol como desarrollador backend',
  /** Marco temporal, bajo el hero. Es lo que evita que el contenido se lea como 4 años. */
  trajectory: 'Desarrollo backend desde octubre de 2025 · Colombia (GMT-5)',
  /** Slogan editorial: vive en la banda Ink (Masthead), no en el hero. */
  heroSlogan: { start: 'Ideas', link: 'hechas', end: 'Producto' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  /** Repositorio de este sitio: evidencia inspeccionable sin firmar nada. */
  repoUrl: 'https://github.com/wilfred524/portfolio',
  /**
   * CV en dos idiomas. Los genera `npm run build:cv -w @portfolio/api` desde este mismo
   * archivo, así que no pueden contradecir a la web. El script exporta también el PDF
   * con Chrome headless; si no hay Chrome, quedan solo los .html y hay que imprimirlos.
   */
  cv: { label: 'Descargar CV', url: '/cv-es.pdf' },
  /**
   * «Cómo está hecho»: a nivel JR/intermedio, la prueba de que se aprende solo pesa
   * tanto como el stack. Incluye el uso de IA como herramienta, que es cómo se
   * trabaja hoy y es una competencia declarable, no una carencia.
   */
  colophon:
    'Este sitio es React y TypeScript, con tipografía variable y animaciones sin librería. Elegí ese stack precisamente porque era territorio nuevo: el backend ya sé que lo tengo. Lo construí apoyándome en IA para codificar — yo defino la arquitectura, doy las instrucciones y verifico cada paso—, que es el mismo método con el que dirigí la migración a arquitectura por capas. El código está público.',
  /** Cierre de la página: lo único de la antigua sección «Sobre mí» que se conserva. */
  closing:
    'Lo que me engancha es siempre lo mismo: un proceso que alguien hace a mano y no debería, o un sistema desordenado que se puede dejar mejor de como lo encontré.',
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
      label: 'Idiomas',
      /* Sin enlace al certificado: el examen se va a repetir. Cuando haya nota nueva,
         volver a publicar el PDF en web/public/ y restaurar href + hrefLabel. */
      value: 'Español nativo · Inglés B2, con lectura C2',
    },
    {
      label: 'Modalidad',
      /* El orden importa: mencionar Deel sin declarar el estatus hacía leer lo contrario
         de lo que es —que se recurre a contractor por no poder ser contratado en
         planta—. Con los documentos por delante, Deel pasa a ser una opción extra para
         clientes de fuera. */
      value:
        'Documentos colombianos, sin requisitos de visado ni patrocinio. Empleo de planta, remoto o híbrido en Colombia; también contratación internacional vía Deel (GMT-5).',
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
  skillGroups: [
    {
      area: 'Backend',
      items: [
        'PHP / Laravel',
        'PostgreSQL / SQL',
        'MySQL',
        'Arquitectura Hexagonal / DDD',
        'Pruebas (PHPUnit / pytest)',
        'Python',
        'Node.js',
      ],
    },
    {
      area: 'Seguridad',
      items: [
        'Roles y permisos (Spatie)',
        'MFA / gestión de sesiones',
        'SAST y detección de secretos',
        'reCAPTCHA Enterprise',
      ],
    },
    {
      area: 'Automatización e IA',
      items: ['n8n', 'OpenAI API', 'Integración de APIs / Webhooks'],
    },
    {
      area: 'Frontend',
      items: ['Vue.js', 'Inertia.js', 'Blade', 'Tailwind CSS', 'React', 'TypeScript'],
    },
    {
      area: 'Infraestructura',
      items: [
        'Docker',
        'Linux / Nginx',
        'CI/CD (GitHub Actions)',
        'Google Cloud Platform',
        'AWS S3',
      ],
    },
    /*
     * PENDIENTE: qué estás aprendiendo AHORA.
     * TypeScript, React y Node salieron de aquí: ya hay evidencia enviada con los tres
     * —este sitio y el CLI de vídeo—, así que listarlos como «aprendiendo» contradecía
     * la propia página. La línea vuelve cuando haya algo real que poner.
     */
  ],
  projectGroups: [
    {
      category: 'En producción',
      items: [
        {
          id: 'rules-engine',
          employer: 'gaf',
          title: 'Motor de reglas de crédito',
          company: 'CK Comercializadora, filial de GAF',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          body: {
            problem:
              'Cambiar una política de crédito exigía un despliegue: el área de negocio no podía ajustar un límite de plazo o una condición de embargo sin pasar por desarrollo.',
            hard:
              'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL —elegibilidad, embargos, límites de plazo, requisitos laborales y financieros por pagaduría—, de modo que el código no sabe cuáles son las reglas, solo cómo aplicarlas. Sobre esa base implementé la evaluación completa: cálculo de capacidad de endeudamiento según Ley 1527 y Ley 50 para activos y pensionados, criterios de decisión, reglas especiales, reevaluación de solicitudes y las validaciones de front y backend.',
            result:
              'El área de negocio ajusta parámetros sin tocar código ni esperar despliegue, y cada solicitud queda trazada al asesor que la originó. La API de envío la construyó un compañero; reestructuré el cuerpo de sus peticiones varias veces conforme cambiaba el modelo.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
        {
          id: 'esignature',
          employer: 'gaf',
          title: 'Firma electrónica con validación de identidad',
          company: 'GAF Technology Solutions',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          body: {
            problem:
              'Firmar documentos validando la identidad de quien firma contra un buró de crédito: un formulario llena una plantilla, la plantilla viaja a TransUnion, y vuelve un documento con un hash verificable contra el propio proveedor.',
            hard:
              'Lo difícil no es firmar: es que todo encaje antes de firmar. La validación de identidad depende de un conjunto amplio de condiciones que deben cumplirse en orden, y el documento viaja entre varias peticiones encadenadas. Implementé la máquina de estados que sigue la cola del proveedor y preserva la integridad del XML de punta a punta, para que un proceso largo termine siempre en un documento válido o en un error que el usuario pueda resolver.',
            result:
              'Entregué primero el módulo de libranzas —formulario multipaso con autoguardado por sección, borrador en PDF, historial de correos y reintentos de subida a S3— y después extraje el patrón de firma genérica, de modo que el siguiente módulo lo implementara en vez de repetir el flujo. Equipo pequeño, con revisión del líder técnico.',
          },
          tags: ['Laravel', 'Vue.js', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'scoring',
          employer: 'gaf',
          title: 'Proceso mensual de puntaje crediticio',
          company: 'GAF Technology Solutions',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          metric: '~300.000 registros por corrida, una vez al mes',
          body: {
            problem:
              'Un modelo de riesgo vivía en el cuaderno de un analista de datos, sin forma de llegar a producción.',
            hard:
              'Lo empaqueté en un contenedor con cron mensual: extrae de PostgreSQL, ejecuta el modelo, comprueba que el artefacto se haya regenerado antes de seguir adelante y carga en bloques de cinco mil para acotar el tamaño de cada sentencia. Guarda el estado en disco para no reprocesar dos veces el mismo artefacto y descarta las filas inválidas sin abortar la carga entera.',
            result:
              'El modelo no es mío; la tubería que lo pone en producción sí. Añadí además la consulta en vivo: un servicio que pide el puntaje de una cédula a la API y lo muestra en la pantalla de visado.',
          },
          tags: ['Python', 'PostgreSQL', 'Docker', 'Laravel'],
        },
        {
          id: 'access-control',
          employer: 'gaf',
          title: 'Control de accesos y auditoría',
          company: 'GAF Technology Solutions',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          brief:
            'Consolidé el control de accesos sobre Spatie —guards, middleware y policies—, con una migración que llevó los usuarios y roles existentes al esquema nuevo sin interrumpir a quien estaba trabajando dentro. Trabajé además en el endurecimiento de la autenticación y en la trazabilidad de eventos críticos, de cara a una auditoría de seguridad.',
          tags: ['Spatie Permission', 'Autenticación', 'Auditoría', 'Laravel'],
        },
        {
          id: 'layered-migration',
          employer: 'gaf',
          title: 'Migración a arquitectura por capas',
          company: 'GAF Technology Solutions',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          brief:
            'Dirigí y verifiqué la migración de una plataforma de seis años —más de doscientos modelos Eloquent revueltos con controladores, colas y providers— a una arquitectura por capas. Sin suite de pruebas de la que fiarse, fue módulo a módulo en lugar de todo de golpe. Tres meses, con revisión del líder técnico.',
          tags: ['Arquitectura Hexagonal', 'DDD', 'Laravel'],
        },
      ],
    },
    {
      category: 'Fuera del trabajo',
      items: [
        {
          id: 'ai-automation',
          employer: 'self',
          title: 'Automatización de procesos con IA',
          company: 'Autónomo',
          role: 'Freelance, media jornada',
          period: 'Ene 2026 – actualidad',
          brief:
            'Procesos automatizados con n8n y la API de OpenAI para generación de contenido, y un bot conversacional de Telegram integrado con n8n y PostgreSQL que atiende solicitudes de punta a punta.',
          tags: ['n8n', 'OpenAI API', 'PostgreSQL'],
        },
        {
          id: 'video-cli',
          title: 'CLI de recorte de vídeo',
          role: 'Proyecto propio',
          period: 'Jul 2026 – en curso',
          brief:
            'Herramienta de línea de comandos en TypeScript que parte un vídeo largo en clips verticales: transcribe con Whisper, escribe el guion con un modelo cuya salida se valida contra un esquema antes de usarla, narra con síntesis de voz y monta los subtítulos con Remotion. Cada paso deja su resultado en disco y el proceso es reanudable, para no repetir llamadas al modelo ya pagadas.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
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
