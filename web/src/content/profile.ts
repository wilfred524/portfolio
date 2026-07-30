/**
 * TODO el contenido de la página vive aquí.
 * Para poner tus datos reales solo hay que editar este archivo:
 * ningún componente tiene textos hardcodeados.
 */

export interface ProjectItem {
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

export const profile = {
  name: 'Wilfred Morales',
  role: 'Desarrollador backend',
  /** Stack de cabecera: lo que un reclutador técnico busca en los primeros dos segundos. */
  stack: 'PHP/Laravel · PostgreSQL · seguridad de plataforma',
  /** La credencial: sistemas en producción y en qué dominio. Es la frase que convierte. */
  credential:
    'Firma electrónica, motor de reglas y scoring crediticio en producción para crédito por libranza.',
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
      value:
        'Español nativo · Inglés B2, con comprensión lectora y auditiva cercanas a C1',
      href: '/ef-set-certificate.pdf',
      hrefLabel: 'Ver certificado EF SET',
    },
    {
      label: 'Modalidad',
      value:
        'Empleo de planta —remoto, híbrido o presencial— o contractor vía Deel · Colombia (GMT-5)',
    },
    {
      label: 'Dominio',
      value:
        'Crédito por libranza: préstamos con descuento directo de nómina, un sector regulado en Colombia (Ley 1527).',
    },
  ] satisfies Fact[],
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
      area: 'Automatización',
      items: ['n8n', 'Integración de APIs / Webhooks', 'LLMs vía API'],
    },
    {
      area: 'Frontend',
      items: ['Vue.js', 'Inertia.js', 'Blade', 'Tailwind CSS', 'React', 'TypeScript'],
    },
    {
      area: 'Infraestructura',
      items: ['Docker', 'Linux / Nginx', 'GitHub Actions', 'AWS S3'],
    },
    /*
     * PENDIENTE: qué estás aprendiendo AHORA.
     * TypeScript, React y Node salieron de aquí: ya hay evidencia enviada con los tres
     * —este sitio y el CLI de vídeo—, así que listarlos como «aprendiendo» contradecía
     * la propia página. La línea vuelve cuando haya algo real que poner.
     */
  ] satisfies SkillGroup[],
  projectGroups: [
    {
      category: 'En producción',
      items: [
        {
          title: 'Motor de reglas de crédito',
          company: 'CK Comercializadora (cliente de GAF Solutions)',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          body: {
            problem:
              'Cambiar una política de crédito exigía un despliegue: el área de negocio no podía ajustar un límite de plazo o una condición de embargo sin pasar por desarrollo.',
            hard:
              'Modelé los datos y traduje las reglas de negocio a un esquema de políticas en PostgreSQL —elegibilidad, embargos, límites de plazo, requisitos laborales y financieros por pagaduría—, de modo que el código no sabe cuáles son las reglas, solo cómo aplicarlas. Sobre esa base implementé la evaluación completa: cálculo de capacidad de endeudamiento según Ley 1527 y Ley 50 para activos y pensionados, criterios de decisión, reglas especiales, reevaluación de solicitudes y las validaciones de front y backend.',
            result:
              'El área de negocio ajusta parámetros sin tocar código ni esperar despliegue, y cada solicitud queda trazada al asesor que la originó. La API de envío la construyó un compañero; reestructuré su payload varias veces conforme cambiaba el modelo.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
        {
          title: 'Firma electrónica con validación de identidad',
          company: 'GAF Solutions',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          body: {
            problem:
              'Firmar documentos validando la identidad de quien firma contra un buró de crédito: un formulario llena una plantilla, la plantilla viaja a TransUnion, y vuelve un documento con un hash verificable contra el propio proveedor.',
            hard:
              'Lo difícil no es firmar, es sobrevivir al tercero. Implementé la máquina de estados que sigue la cola del proveedor y se reinicia cuando devuelve un estado no contemplado, preservando la integridad del XML entre peticiones y traduciendo sus errores a algo que el usuario pueda resolver.',
            result:
              'Entregué primero el módulo de libranzas —formulario multipaso con autoguardado por sección, borrador en PDF, historial de correos y reintentos de subida a S3— y después extraje el patrón de firma genérica, de modo que el siguiente módulo lo implementara en vez de repetir el flujo. Equipo pequeño, con revisión del líder técnico.',
          },
          tags: ['Laravel', 'Vue.js', 'TransUnion', 'AWS S3'],
        },
        {
          title: 'Pipeline de scoring crediticio',
          company: 'GAF Solutions',
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
          title: 'Control de accesos y auditoría',
          company: 'GAF Solutions',
          role: 'Desarrollador backend',
          period: 'Oct 2025 – actualidad',
          brief:
            'Consolidé el control de accesos sobre Spatie —guards, middleware y policies—, con una migración que llevó los usuarios y roles existentes al esquema nuevo sin interrumpir a quien estaba trabajando dentro. Trabajé además en el endurecimiento de la autenticación y en la trazabilidad de eventos críticos, de cara a una auditoría de seguridad. El detalle lo cuento en conversación, no aquí.',
          tags: ['Spatie Permission', 'Autenticación', 'Auditoría', 'Laravel'],
        },
        {
          title: 'Migración a arquitectura por capas',
          company: 'GAF Solutions',
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
          title: 'CLI de clipping de vídeo',
          role: 'Proyecto propio',
          period: 'Jul 2026 – en curso',
          brief:
            'Herramienta de línea de comandos en TypeScript que parte un vídeo largo en clips verticales: transcribe con Whisper, escribe el guion con un modelo cuya salida se valida contra un esquema antes de usarla, narra con síntesis de voz y monta los subtítulos con Remotion. Cada paso deja su resultado en disco y el proceso es reanudable, para no repetir llamadas al modelo ya pagadas.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
        },
      ],
    },
  ] satisfies ProjectGroup[],
  social: [
    { label: 'GitHub', url: 'https://github.com/wilfred524' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wilfred-morales-3220b2126' },
  ],
};
