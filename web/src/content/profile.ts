/**
 * TODO el contenido de la página vive aquí.
 * Para poner tus datos reales solo hay que editar este archivo:
 * ningún componente tiene textos hardcodeados.
 */

export interface ProjectItem {
  /** Título corto (una palabra o dos). */
  title: string;
  /** Descriptor breve que se repite como texto fantasma de fondo. */
  ghost: string;
  /** Cliente o contexto del proyecto (GAF Solutions, n8n + Telegram API…). */
  context: string;
  /** Descripción completa (se revela al Expandir). */
  description: string;
  tags: string[];
  url?: string;
}

export interface ProjectGroup {
  category: string;
  items: ProjectItem[];
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
  availability: 'disponible para nuevos proyectos · 2026',
  /** Slogan editorial: vive en la banda Ink (Masthead), no en el hero. */
  heroSlogan: { start: 'Ideas', link: 'hechas', end: 'Producto' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  /** Cierre de la página: lo único de la antigua sección «Sobre mí» que se conserva. */
  closing:
    'Lo que me engancha es siempre lo mismo: un proceso que alguien hace a mano y no debería, o un sistema desordenado que se puede dejar mejor de como lo encontré.',
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
      items: ['Vue.js', 'Inertia.js', 'Blade', 'Tailwind CSS', 'HTML / CSS'],
    },
    {
      area: 'Infraestructura',
      items: ['Docker', 'Linux / Nginx', 'GitHub Actions', 'AWS S3'],
    },
    {
      area: 'Aprendiendo',
      items: ['TypeScript', 'Node.js', 'React'],
    },
  ] satisfies SkillGroup[],
  projectGroups: [
    {
      category: 'En producción',
      items: [
        {
          title: 'Firma digital TransUnion',
          ghost: 'el proveedor falla, el estado no',
          context: 'GAF Solutions',
          description:
            'Firma electrónica de documentos validada contra un buró de crédito. El mecanismo: un formulario largo llena una plantilla, la plantilla viaja a TransUnion para verificar la identidad de quien firma, y regresa un documento firmado con un hash verificable contra el propio proveedor. Lo difícil no es firmar, es sobrevivir al tercero: la validación va por preguntas de conocimiento o por código de un solo uso, sobre una máquina de estados que sigue la cola del proveedor y se reinicia cuando devuelve un estado que no contempla, preservando la integridad del XML entre peticiones y traduciendo sus errores a algo que el usuario pueda resolver. Lo construí primero para las libranzas — formulario multipaso con autoguardado por sección, borrador en PDF, historial de correos, reintentos de subida a S3 y pólizas de Sura — y después extraje el patrón de firma genérica para el expediente de conocimiento de contraparte, de modo que el siguiente módulo que necesitara firmarse lo implementara en vez de repetir el flujo. Trabajo de equipo pequeño, con revisión del líder técnico.',
          tags: ['Laravel', 'Vue.js', 'TransUnion', 'AWS S3'],
        },
        {
          title: 'Permisos, MFA, auditoría',
          ghost: 'quién puede qué, y quién hizo qué',
          context: 'GAF Solutions',
          description:
            'Preparación de la plataforma para una eventual auditoría ISO 27001. El control de accesos estaba a medio camino entre Spatie y una lógica propia acumulada en el modelo de usuario: lo consolidé sobre Spatie — guards, middleware y policies — con una migración y un seeder que llevaron los usuarios y roles existentes al esquema nuevo sin dejar a nadie fuera, que era la parte delicada porque había gente trabajando dentro. Encima, segundo factor con confianza por dispositivo y cierre de sesión por inactividad, y en el pipeline detección de secretos y análisis estático, más la actualización de dependencias con vulnerabilidades conocidas. Al margen de la norma, un registro de eventos críticos con limpieza automática: no solo errores, también aprobaciones y tareas completadas, con su autor y su detalle.',
          tags: ['Spatie Permission', 'MFA', 'ISO 27001', 'GitHub Actions'],
        },
        {
          title: 'Motor de reglas',
          ghost: 'la política, vuelta parámetro',
          context: 'CK Comercializadora',
          description:
            'Cambiar una política de crédito dejó de ser un despliegue y pasó a ser un parámetro. El motor lee las condiciones desde un esquema de políticas en PostgreSQL — elegibilidad, embargos, límites de plazo, requisitos laborales y financieros por pagaduría — que el área de negocio administra desde la otra plataforma, de modo que el código no sabe cuáles son las reglas, solo cómo aplicarlas. Incluye el cálculo de capacidad de endeudamiento según Ley 1527 y Ley 50, para empleados activos y pensionados. Es el portal público de solicitudes del mismo empleador, y la parte que llevé casi entera.',
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
        {
          title: 'Pipeline scoring Python',
          ghost: '300 mil registros, una vez al mes',
          context: 'GAF Solutions',
          description:
            'Un modelo de riesgo que vivía en un cuaderno de un analista de datos, convertido en un proceso que corre solo. Un contenedor con cron mensual extrae de PostgreSQL, ejecuta el modelo, comprueba que el artefacto se haya regenerado antes de seguir adelante y carga los resultados en bloques de cinco mil para acotar el tamaño de cada sentencia — del orden de 300.000 registros por corrida. Guarda el estado en disco para no reprocesar dos veces el mismo artefacto y descarta las filas inválidas sin abortar la carga entera. El modelo no es mío; la tubería que lo pone en producción sí. La otra mitad es la consulta en vivo: un servicio que pide el puntaje de una cédula a la API y lo muestra en la pantalla de visado.',
          tags: ['Python', 'PostgreSQL', 'Docker', 'Laravel'],
        },
        {
          title: 'Refactor Laravel hexagonal',
          ghost: 'seis años, sin apagar nada',
          context: 'GAF Solutions',
          description:
            'Reordenar una plataforma de seis años sin detenerla. Todo el dominio vivía plano dentro de app/: más de doscientos modelos Eloquent revueltos con controladores, colas y providers. La reorganicé en capas — casos de uso con el patrón entrada/manejador/resultado, entidades e interfaces de repositorio en el dominio, y Eloquent, HTTP y colas confinados a infraestructura — con un proveedor que enlaza cada contrato con su implementación PostgreSQL o MySQL. No había suite de pruebas de la que fiarse, así que migré por partes y verifiqué módulo a módulo conforme avanzaba, en lugar de mover todo de golpe; el trabajo se extendió tres meses y pasó por revisión del líder técnico. De ahí en adelante fui dejando pruebas donde tocaba.',
          tags: ['Arquitectura Hexagonal', 'DDD', 'Laravel', 'Refactor'],
        },
      ],
    },
    {
      category: 'Fuera del trabajo',
      items: [
        {
          title: 'CLI vídeo TypeScript',
          ghost: 'un video, muchos clips',
          context: 'Proyecto propio — en curso',
          description:
            'Una herramienta de línea de comandos que parte un video largo en clips verticales: transcribe con Whisper, elige los fragmentos y escribe el guion con un modelo cuya salida se valida contra un esquema antes de usarla, narra con síntesis de voz, mezcla el audio atenuando el ambiente y monta los subtítulos con Remotion. Cada paso deja su resultado en disco y el proceso es reanudable, para no repetir llamadas al modelo ya pagadas. Funciona de punta a punta; la publicación automática a redes todavía no.',
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
