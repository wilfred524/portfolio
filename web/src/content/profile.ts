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

export const profile = {
  name: 'Wilfred Morales',
  role: 'Desarrollador Full-Stack',
  tagline: 'Diseño y construyo interfaces que se sienten inevitables.',
  availability: 'Disponible para nuevos proyectos — 2026',
  ticker: 'Diseño y desarrollo full-stack · Disponible para proyectos 2026 · Hablemos',
  /** Slogan del hero: línea condensada + conector (itálica serif anidada) + línea serif. */
  heroSlogan: { start: 'Ideas', link: 'hechas', end: 'Producto' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  bio: [
    'Trabajo en la intersección entre diseño y código: interfaces con intención tipográfica, sistemas de diseño rigurosos y el detalle técnico para que todo se mueva a 60fps.',
    'Mi stack de cabecera es TypeScript de punta a punta — React en el navegador, Node en el servidor — con una obsesión particular por la automatización y el video programático.',
  ],
  skills: [
    { name: 'Laravel / PHP', level: 'Avanzado' },
    { name: 'Vue.js / Frontend', level: 'Avanzado' },
    { name: 'Node.js / TypeScript', level: 'Avanzado' },
    { name: 'n8n / Automatización', level: 'Avanzado' },
    { name: 'LLMs — OpenAI / LangChain', level: 'Intermedio' },
    { name: 'PostgreSQL / SQL', level: 'Avanzado' },
    { name: 'Arquitectura Hexagonal / DDD', level: 'Intermedio' },
    { name: 'Docker / GCP / Nginx', level: 'Intermedio' },
  ],
  projectGroups: [
    {
      category: 'Automatización de Procesos & Flujos con IA',
      items: [
        {
          title: 'Chatbot',
          ghost: 'mensajería en tiempo real',
          context: 'n8n + Telegram API',
          description:
            'Atiende en Telegram sin intervención humana: interpreta comandos, consulta datos en vivo y responde al instante. Flujos de n8n sobre la API de Telegram que convierten una conversación en una acción — de la pregunta a la respuesta útil en segundos.',
          tags: ['n8n', 'Telegram API', 'Webhooks'],
        },
        {
          title: 'Generador de contenido',
          ghost: 'de un prompt a una publicación',
          context: 'AI Pipeline',
          description:
            'Convierte una idea en publicaciones listas para redes. Ingesta prompts, genera copys estructurados con LLMs (OpenAI / LangChain) y prepara el contenido sin intervención manual — creatividad a escala, con consistencia de marca.',
          tags: ['OpenAI API', 'LangChain', 'LLMs'],
        },
        {
          title: 'Score crediticio',
          ghost: 'riesgo vuelto decisión',
          context: 'GAF Solutions',
          description:
            'El motor que evalúa el riesgo crediticio de forma automática: procesa información financiera, calcula el score e ingesta los datos validados en PostgreSQL. Datos crudos convertidos en decisiones confiables, con trazabilidad de punta a punta.',
          tags: ['PostgreSQL', 'Backend', 'Scoring'],
        },
      ],
    },
    {
      category: 'Desarrollo Backend & Arquitectura de Software',
      items: [
        {
          title: 'Hexagonal',
          ghost: 'la lógica, libre del framework',
          context: 'GAF Solutions',
          description:
            'Migración de código legacy a arquitectura hexagonal: la lógica de negocio deja de depender del framework y pasa al centro, testeable y portable. El sistema gana libertad para escalar y cambiar piezas sin reescribirse.',
          tags: ['Arquitectura Hexagonal', 'Laravel', 'Refactor'],
        },
        {
          title: 'Auditoría',
          ghost: 'cada acción, registrada',
          context: 'GAF Solutions',
          description:
            'Trazabilidad total de las acciones críticas. Con Spatie Activitylog sobre Laravel, cada evento queda registrado con su autor y su contexto — un historial confiable para auditar, depurar y rendir cuentas.',
          tags: ['Laravel', 'Spatie Activitylog', 'Auditoría'],
        },
        {
          title: 'Anti-bot',
          ghost: 'humanos sí, bots no',
          context: 'CK Comercializadora',
          description:
            'Defensa contra bots sin fricción para el usuario: Cloudflare Turnstile en el frontend (Vue.js) con validación en backend, y resolución de los problemas de contenido mixto en producción. Seguridad real que no estorba la experiencia.',
          tags: ['Vue.js', 'Cloudflare Turnstile', 'Seguridad'],
        },
        {
          title: 'Este sitio',
          ghost: 'diseño y código, una pieza',
          context: 'Proyecto propio',
          description:
            'El sitio que estás viendo: monorepo TypeScript con frontend y backend desacoplados (React + Vite / Express) y una placa halftone generada por código (dithering Bayer en canvas). Donde el diseño y la ingeniería se sostienen mutuamente.',
          tags: ['React', 'Vite', 'Express', 'Canvas'],
        },
      ],
    },
    {
      category: 'Despliegue & Administración de Infraestructura',
      items: [
        {
          title: 'Infra GCP',
          ghost: 'el suelo donde corre todo',
          context: 'Infraestructura',
          description:
            'La infraestructura que sostiene los productos en producción: servidores Linux en Google Cloud, contenedores Docker y proxys inversos con Nginx. Configuración, despliegue y mantenimiento pensados para que el sistema siga en pie.',
          tags: ['GCP', 'Docker', 'Nginx', 'Linux'],
        },
      ],
    },
  ] satisfies ProjectGroup[],
  social: [
    { label: 'GitHub', url: 'https://github.com/wilfred524' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wilfred-morales-3220b2126' },
  ],
};
