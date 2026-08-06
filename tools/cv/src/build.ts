/**
 * Generador del CV en PDF-listo (HTML imprimible), en español e inglés.
 *
 *   npm run build:cv            (o: npm run build:cv -w @portfolio/cv)
 *
 * Escribe cv-es y cv-en en web/public/, como HTML y como PDF. El PDF lo imprime Chrome
 * headless si está instalado; si no, quedan los HTML para imprimirlos a mano.
 *
 * POR QUÉ ASÍ:
 * - Los datos duros (empresas, periodos, habilidades, formación, contacto) se leen de
 *   `web/src/content/profile.{es,en}.ts`, la misma fuente que alimenta la web. El CV
 *   anterior, mantenido aparte, acabó contradiciéndola en fechas, alcance y nivel de inglés.
 * - Esto es *tooling*, no backend: se ejecuta a mano en local y su salida es estática.
 *   Vivía en `api/` cuando el backend era Express; al pasar `api/` a Python se mudó aquí,
 *   porque un script de build y un servidor no tienen por qué compartir carpeta.
 * - El profile se lee transpilándolo con esbuild, no con un import directo: aquí solo se
 *   consume un archivo de datos, sin acoplarse al resto del frontend.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { access } from 'node:fs/promises';
import { build } from 'esbuild';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CERTIFICATIONS, EMPLOYERS, EMPLOYER_TAGLINE, TEXT, WORK_MODE } from './content.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const PROFILES = {
  es: join(ROOT, 'web/src/content/profile.es.ts'),
  en: join(ROOT, 'web/src/content/profile.en.ts'),
};
const OUT_DIR = join(ROOT, 'web/public');

type Lang = 'es' | 'en';

/** Transpila un profile.<lang>.ts a un módulo temporal y lo importa. */
async function loadProfile(lang: Lang): Promise<any> {
  const dir = await mkdtemp(join(tmpdir(), 'cv-'));
  const outfile = join(dir, 'profile.mjs');
  try {
    await build({
      entryPoints: [PROFILES[lang]],
      outfile,
      format: 'esm',
      platform: 'node',
      bundle: false,
      logLevel: 'silent',
    });
    const mod = await import(pathToFileURL(outfile).href);
    return mod[lang];
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function renderCv(profile: any, lang: Lang): string {
  const t = TEXT[lang];
  const en = lang === 'en';

  // Un CV se organiza por EMPLEO, no por proyecto: cinco entradas con el mismo periodo
  // se leen como cinco trabajos simultáneos.
  //
  // El empleo ya viene declarado en el contenido (`employments`), así que aquí solo se
  // agrupa. Antes se deducía —el periodo del contrato era el del primer proyecto que
  // apareciera—, que funcionaba por casualidad mientras todos compartieran fechas.
  const jobs = profile.employments.map((empleo: any) => ({
    company: empleo.employer,
    role: empleo.role,
    period: empleo.period,
    mode: empleo.mode,
    tagline: empleo.tagline,
    hasCompany: true,
    groups: profile.projectGroups.filter((g: any) => g.employmentId === empleo.id),
  }));

  // Lo que no cuelga de ningún contrato va al final, bajo un único encabezado.
  const propios = profile.projectGroups.filter((g: any) => !g.employmentId);
  if (propios.length > 0) {
    jobs.push({
      company: en ? 'Personal projects' : 'Proyectos propios',
      role: '',
      period: '',
      mode: undefined,
      tagline: undefined,
      hasCompany: false,
      groups: propios,
    });
  }

  const experience = jobs
    .map((job: any) => {
      const company = escape(job.company);
      const role = escape(job.role);
      const period = escape(job.period);
      const mode = job.mode;
      const tagline = job.tagline;

      const entries = job.groups
        .flatMap((group: any) =>
          group.items.map((item: any) => ({ item, group })),
        )
        .map(({ item, group }: any) => {
          // Dentro de un contrato se anota el proyecto al que pertenece la tarea, para no
          // perder de vista para qué se hizo cada cosa. Fuera de un contrato no hay
          // cabecera con fechas, así que lo que se anota es el periodo de cada proyecto.
          const brand = job.hasCompany
            ? group.category
            : [item.role, item.period].filter(Boolean).join(' · ') || undefined;
          const title =
            escape(item.title) +
            (brand ? ` <span class="note">${escape(brand)}</span>` : '');
          const bullets = (t.bullets as Record<string, string[]>)[item.id] ?? [];
          const list = bullets.map((b) => `<li>${escape(b)}</li>`).join('\n            ');
          const stack = item.tags.map(escape).join(' · ');
          return `
        <div class="entry">
          <p class="entry-title">${title}</p>
          <ul>
            ${list}
          </ul>
          <p class="stack">${stack}</p>
        </div>`;
        })
        .join('\n');

      // Sin empresa real (proyectos propios) el rol ya lo dice todo: repetirlo como
      // "Proyecto propio · Proyectos propios" sobra.
      const head = job.hasCompany
        ? `<span class="role">${role}</span> <span class="company">${company}</span>`
        : `<span class="role">${company}</span>`;

      return `
      <div class="job">
        <p class="job-head">
          ${head}${mode ? ` · <span class="mode">${escape(mode)}</span>` : ''}
          ${period ? `<span class="period">${period}</span>` : ''}
        </p>
        ${tagline ? `<p class="tagline">${escape(tagline)}</p>` : ''}
        ${entries}
      </div>`;
    })
    .join('\n');

  const skills = profile.skillGroups
    .map(
      (group: any) =>
        `<p class="skill"><span class="skill-area">${escape(
          group.area,
        )}</span> ${escape(group.items.join(' · '))}</p>`,
    )
    .join('\n      ');

  // Las etiquetas de `facts` ya vienen en el idioma correcto; se localizan por
  // posición para no depender de su texto.
  const fact = (index: number) => profile.facts[index]?.value ?? '';
  const education = fact(0);
  const languages = fact(1);
  const location = `${profile.location} (GMT-5)`;

  const certs = CERTIFICATIONS.map((c) => `<li>${escape(c[lang])}</li>`).join('\n        ');
  const summary = t.summary.map((x) => `<p>${escape(x)}</p>`).join('\n      ');

  // El export de LinkedIn del que parte esta plantilla no incluía ni email ni teléfono:
  // un CV sin vía de contacto en la primera pantalla es un CV que no sirve.
  const join = (parts: string[]) => parts.map(escape).join('&nbsp;&nbsp;·&nbsp;&nbsp;');
  const contact = join([profile.email, profile.phone, location]);
  const links = join(
    profile.social.map((x: any) => x.url.replace(/^https?:\/\/(www\.)?/, '')),
  );

  const section = (title: string, body: string) => `
    <section>
      <h2>${escape(title)}</h2>
      ${body}
    </section>`;

  return `<!doctype html>
<html lang="${t.lang}">
  <head>
    <meta charset="utf-8" />
    <title>${escape(t.docTitle)}</title>
    <style>
      /* Una columna, sin tablas ni gráficos: el CV pasa por lectores ATS antes que por
         ojos humanos, y cualquier maquetación en columnas los confunde.
         Estructura heredada del export de LinkedIn —nombre centrado, secciones en
         versales con regla— porque es un formato que los reclutadores reconocen. */
      /* Misma tipografía que el sitio, para que CV y web se lean como una sola cosa:
         Fraunces (serif variable) en los titulares y Switzer (sans variable) en el
         cuerpo. Las rutas son relativas porque el CV se imprime desde file:// y también
         se sirve desde la raíz: fonts/… funciona en ambos casos.
         No afecta a los lectores ATS: extraen texto, no tipografía. */
      @font-face {
        font-family: 'Switzer';
        src: url('fonts/Switzer-Variable.woff2') format('woff2-variations');
        font-weight: 100 900;
        font-display: swap;
      }
      @font-face {
        font-family: 'Fraunces CV';
        src: url('fonts/fraunces-latin-wght-normal.woff2') format('woff2-variations');
        font-weight: 100 900;
        font-display: swap;
      }

      @page { size: A4; margin: 13mm 14mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0 auto;
        max-width: 200mm;
        padding: 10mm 12mm;
        font-family: 'Switzer', 'Inter', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.45;
        letter-spacing: -0.005em;
        color: #1c1c1c;
        background: #fff;
      }
      header { text-align: center; border-bottom: 2px solid #1c4a5a; padding-bottom: 6pt; }
      h1 {
        margin: 0;
        font-family: 'Fraunces CV', Georgia, serif;
        font-variation-settings: 'wght' 600, 'opsz' 144, 'SOFT' 0, 'WONK' 0;
        font-size: 23pt;
        line-height: 1.05;
        letter-spacing: -0.015em;
        color: #1c4a5a;
      }
      .headline { margin: 3pt 0 0; font-size: 9.5pt; color: #333; }
      .contact { margin: 4pt 0 0; font-size: 8.5pt; color: #444; }
      h2 {
        margin: 14pt 0 0;
        padding-bottom: 2pt;
        border-bottom: 1px solid #b8c4c9;
        font-size: 9.5pt;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #1c4a5a;
      }
      section > p:first-of-type, section > div:first-of-type { margin-top: 5pt; }
      p { margin: 0 0 4pt; }
      /* Sin page-break-inside aquí: un empleo con varios proyectos no cabe en lo que
         queda de página y saltaba entero, dejando media hoja en blanco. */
      .job { margin-top: 8pt; }
      .job-head { margin-bottom: 1pt; }
      .role { font-weight: 700; }
      .company { font-style: italic; }
      .mode, .period { color: #555; font-size: 9pt; }
      .period::before { content: ' · '; }
      .tagline { margin: 0 0 4pt; font-size: 9pt; font-style: italic; color: #555; }
      .entry { margin: 0 0 6pt; page-break-inside: avoid; }
      .entry-title { margin: 0 0 1pt; font-weight: 600; }
      .note { font-weight: 400; font-size: 9pt; color: #555; }
      ul { margin: 0; padding-left: 14pt; }
      li { margin-bottom: 1.5pt; }
      .stack { margin-top: 2pt; font-size: 8.5pt; color: #555; }
      .skill { margin-bottom: 2pt; }
      .skill-area { font-weight: 700; }
      @media print { body { padding: 0; max-width: none; } }
    </style>
  </head>
  <body>
    <header>
      <h1>${escape(profile.name)}</h1>
      <p class="headline">${escape(t.headline)}</p>
      <p class="contact">${contact}</p>
      <p class="contact">${links}</p>
    </header>
${section(t.sections.summary, summary)}
${section(t.sections.experience, experience)}
${section(t.sections.education, `<p>${escape(education)}</p>`)}
${section(t.sections.skills, skills)}
${section(t.sections.languages, `<p>${escape(languages)}</p>`)}
${section(t.sections.certifications, `<ul>\n        ${certs}\n      </ul>`)}
  </body>
</html>
`;
}

const run = promisify(execFile);

/** Chrome imprime a PDF sin abrir ventana; si no está, se deja solo el HTML. */
const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

async function findChrome(): Promise<string | null> {
  for (const candidate of CHROME_PATHS) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* siguiente */
    }
  }
  return null;
}

async function main() {
  const chrome = await findChrome();

  for (const lang of ['es', 'en'] as Lang[]) {
    const profile = await loadProfile(lang);
    const html = join(OUT_DIR, `cv-${lang}.html`);
    await writeFile(html, renderCv(profile, lang), 'utf8');
    console.log(`✓ web/public/cv-${lang}.html`);

    if (chrome) {
      const pdf = join(OUT_DIR, `cv-${lang}.pdf`);
      // Rutas absolutas en los dos lados: con la ruta relativa Chrome toma "web" como
      // dominio, y el destino relativo le da acceso denegado.
      await run(chrome, [
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdf}`,
        pathToFileURL(html).href,
      ]);
      const size = (await readFile(pdf)).length;
      console.log(`✓ web/public/cv-${lang}.pdf (${(size / 1024).toFixed(0)} kB)`);
    }
  }

  if (!chrome) {
    console.log('\nChrome no encontrado: abre los HTML e Imprime → Guardar como PDF.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
