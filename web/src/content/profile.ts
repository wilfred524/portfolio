/**
 * TODO el contenido de la página vive aquí.
 * Para poner tus datos reales solo hay que editar este archivo:
 * ningún componente tiene textos hardcodeados.
 */

export interface Project {
  index: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  url?: string;
}

export const profile = {
  name: 'Wilfred Morales',
  role: 'Desarrollador Full-Stack',
  tagline: 'Diseño y construyo interfaces que se sienten inevitables.',
  availability: 'Disponible para nuevos proyectos — 2026',
  location: 'República Dominicana',
  email: 'hola@ejemplo.com',
  bio: [
    'Trabajo en la intersección entre diseño y código: interfaces con intención tipográfica, sistemas de diseño rigurosos y el detalle técnico para que todo se mueva a 60fps.',
    'Mi stack de cabecera es TypeScript de punta a punta — React en el navegador, Node en el servidor — con una obsesión particular por la automatización y el video programático.',
  ],
  skills: [
    { name: 'TypeScript / Node.js', level: 'Avanzado' },
    { name: 'React / Vite', level: 'Avanzado' },
    { name: 'CSS / Sistemas de diseño', level: 'Avanzado' },
    { name: 'Remotion / Video programático', level: 'Intermedio' },
    { name: 'Automatización (n8n, bots)', level: 'Intermedio' },
    { name: 'SQL / Postgres / SQLite', level: 'Intermedio' },
  ],
  projects: [
    {
      index: '01',
      title: 'ViralFarm',
      description:
        'Pipeline automatizado de edición y publicación de video para redes sociales: transcripción, guion con LLM, TTS y montaje programático con Remotion y ffmpeg.',
      tags: ['Node.js', 'TypeScript', 'Remotion', 'ffmpeg', 'n8n'],
      year: '2026',
    },
    {
      index: '02',
      title: 'Motor de video programático',
      description:
        'Sistema de composición de video vertical 1080×1920 con análisis de escenas por visión LLM, transiciones sincronizadas a audio y render local optimizado.',
      tags: ['Remotion', 'React', 'Visión LLM'],
      year: '2025',
    },
    {
      index: '03',
      title: 'Colección de diseños',
      description:
        'Este mismo sitio: una colección creciente de sistemas de diseño implementados con fidelidad — cada uno con su spec, sus tokens y sus interacciones propias.',
      tags: ['React', 'Vite', 'Express', 'CSS puro'],
      year: '2026',
    },
  ] satisfies Project[],
  social: [
    { label: 'GitHub', url: 'https://github.com/usuario' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/usuario' },
    { label: 'X / Twitter', url: 'https://x.com/usuario' },
  ],
};
