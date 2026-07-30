/**
 * TODO el contenido de la página vive aquí.
 * Para poner tus datos reales solo hay que editar este archivo:
 * ningún componente tiene textos hardcodeados.
 */

export interface ProjectItem {
  title: string;
  /** Cliente o contexto del proyecto (GAF Solutions, n8n + Telegram API…). */
  context: string;
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
          title: 'Bot Conversacional para Telegram',
          context: 'n8n + Telegram API',
          description:
            'Respuestas automatizadas en tiempo real: procesa comandos, consulta datos y devuelve información mediante nodos en n8n.',
          tags: ['n8n', 'Telegram API', 'Webhooks'],
        },
        {
          title: 'Generador Automático de Contenido',
          context: 'AI Pipeline',
          description:
            'Flujo que ingesta prompts, genera copys estructurados con LLMs (OpenAI / LangChain) y prepara publicaciones sin intervención manual.',
          tags: ['OpenAI API', 'LangChain', 'LLMs'],
        },
        {
          title: 'Motor de Cálculo e Ingesta de Score Crediticio',
          context: 'GAF Solutions',
          description:
            'Automatización del backend para evaluar información financiera, calcular el riesgo crediticio e ingestar los datos validados en PostgreSQL.',
          tags: ['PostgreSQL', 'Backend', 'Scoring'],
        },
      ],
    },
    {
      category: 'Desarrollo Backend & Arquitectura de Software',
      items: [
        {
          title: 'Refactorización a Arquitectura Hexagonal',
          context: 'GAF Solutions',
          description:
            'Migración de código legacy hacia una arquitectura desacoplada que independiza la lógica de negocio del framework y escala el sistema.',
          tags: ['Arquitectura Hexagonal', 'Laravel', 'Refactor'],
        },
        {
          title: 'Auditoría y Trazabilidad de Eventos',
          context: 'GAF Solutions',
          description:
            'Implementación de Spatie Activitylog en Laravel para el registro detallado y el rastreo de acciones críticas.',
          tags: ['Laravel', 'Spatie Activitylog', 'Auditoría'],
        },
        {
          title: 'Seguridad y Anti-Bot',
          context: 'CK Comercializadora',
          description:
            'Integración de Cloudflare Turnstile en frontend (Vue.js) y validación en backend, resolviendo problemas de contenido mixto en producción.',
          tags: ['Vue.js', 'Cloudflare Turnstile', 'Seguridad'],
        },
        {
          title: 'Este portafolio',
          context: 'Proyecto propio',
          description:
            'Monorepo TypeScript con frontend y backend desacoplados (React + Vite / Express), tipos compartidos y una placa halftone generada por código (dithering Bayer en canvas).',
          tags: ['React', 'Vite', 'Express', 'TypeScript', 'Canvas'],
        },
      ],
    },
    {
      category: 'Despliegue & Administración de Infraestructura',
      items: [
        {
          title: 'Servidores en Google Cloud Platform',
          context: 'Infraestructura',
          description:
            'Configuración, despliegue y mantenimiento de infraestructura con servidores Linux, contenedores Docker y proxies inversos en Nginx.',
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
