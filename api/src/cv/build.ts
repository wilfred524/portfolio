/**
 * Generador del CV en PDF-listo (HTML imprimible), en español e inglés.
 *
 *   npm run build:cv -w @portfolio/api
 *
 * Escribe `web/public/cv-es.html` y `web/public/cv-en.html`. Se abren en el navegador
 * y se exportan con Imprimir → Guardar como PDF.
 *
 * POR QUÉ ASÍ:
 * - Los datos duros (empresas, periodos, habilidades, formación, contacto) se leen de
 *   `web/src/content/profile.ts`, la misma fuente que alimenta la web. El CV anterior,
 *   mantenido aparte, acabó contradiciéndola en fechas, alcance y nivel de inglés.
 * - La salida es estática y va a `web/public/` porque Vercel despliega solo el
 *   workspace `web` (ver docs/deployment.md); un endpoint no estaría disponible en
 *   producción. Cuando el backend se despliegue, `renderCv()` puede exponerse tal cual.
 * - `profile.ts` se lee transpilándolo con esbuild, no con un import directo: el
 *   backend no debe acoplarse al frontend, y aquí solo consume un archivo de datos.
 */

import { build } from 'esbuild';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CERTIFICATIONS, EMPLOYERS, TEXT, TRANSLATIONS } from './content.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const PROFILE = join(ROOT, 'web/src/content/profile.ts');
const OUT_DIR = join(ROOT, 'web/public');

type Lang = 'es' | 'en';

/** Transpila profile.ts a un módulo temporal y lo importa. */
async function loadProfile(): Promise<any> {
  const dir = await mkdtemp(join(tmpdir(), 'cv-'));
  const outfile = join(dir, 'profile.mjs');
  try {
    await build({
      entryPoints: [PROFILE],
      outfile,
      format: 'esm',
      platform: 'node',
      bundle: false,
      logLevel: 'silent',
    });
    const mod = await import(pathToFileURL(outfile).href);
    return mod.profile;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Traduce si hay entrada; si no, devuelve el original (el español es la base). */
const tr = (dict: Record<string, string>, value: string) => dict[value] ?? value;

function renderCv(profile: any, lang: Lang): string {
  const t = TEXT[lang];
  const en = lang === 'en';

  // Un CV se organiza por EMPLEO, no por proyecto: cinco entradas con el mismo periodo
  // se leen como cinco trabajos simultáneos. Se agrupan por empresa conservando el orden.
  const items = profile.projectGroups.flatMap((group: any) => group.items);
  const jobs = new Map<string, { company: string; role: string; period: string; items: any[] }>();

  for (const item of items) {
    const fallback = en ? 'Personal projects' : 'Proyectos propios';
    const company = item.company
      ? EMPLOYERS[item.company]?.employer ?? item.company
      : fallback;
    // Agrupa por empleador, no por marca ni periodo: dentro de un mismo contrato puede
    // haber proyectos para varias marcas del grupo.
    if (!jobs.has(company)) {
      jobs.set(company, { company, role: item.role, period: item.period, items: [] });
    }
    jobs.get(company)!.items.push(item);
  }

  const experience = [...jobs.values()]
    .map((job) => {
      const company = escape(tr(TRANSLATIONS.companies, job.company));
      const role = escape(tr(TRANSLATIONS.roles, job.role));
      const period = escape(job.period.replace('actualidad', t.present));

      const entries = job.items
        .map((item: any) => {
          const note = item.company ? EMPLOYERS[item.company]?.note : undefined;
          const title =
            escape(tr(TRANSLATIONS.titles, item.title)) +
            (note ? ` <span class="note">${escape(note[lang])}</span>` : '');
          const bullets = (t.bullets as Record<string, string[]>)[item.title] ?? [];
          const list = bullets.map((b) => `<li>${escape(b)}</li>`).join('\n            ');
          const stack = item.tags.map(escape).join(' · ');
          return `
        <div class="entry">
          <h3>${title}</h3>
          <ul>
            ${list}
          </ul>
          <p class="stack">${stack}</p>
        </div>`;
        })
        .join('\n');

      return `
      <div class="job">
        <div class="job-head">
          <h3 class="job-title">${role} — ${company}</h3>
          <span class="period">${period}</span>
        </div>
        ${entries}
      </div>`;
    })
    .join('\n');

  const skills = profile.skillGroups
    .map(
      (group: any) =>
        `<li><strong>${escape(tr(TRANSLATIONS.skillAreas, group.area))}:</strong> ${escape(
          group.items.join(' · '),
        )}</li>`,
    )
    .join('\n        ');

  const education = en
    ? TRANSLATIONS.education
    : profile.facts.find((f: any) => f.label === 'Formación')?.value ?? '';
  const languages = en
    ? TRANSLATIONS.languages
    : profile.facts.find((f: any) => f.label === 'Idiomas')?.value ?? '';
  const location = en ? TRANSLATIONS.location : `${profile.location} (GMT-5)`;

  const certs = CERTIFICATIONS.map((c) => `<li>${escape(c[lang])}</li>`).join('\n        ');
  const summary = t.summary.map((p) => `<p>${escape(p)}</p>`).join('\n        ');
  const contact = [
    profile.email,
    profile.phone,
    location,
    ...profile.social.map((s: any) => s.url.replace(/^https?:\/\/(www\.)?/, '')),
    profile.repoUrl.replace(/^https?:\/\/(www\.)?/, ''),
  ]
    .map(escape)
    .join(' · ');

  return `<!doctype html>
<html lang="${t.lang}">
  <head>
    <meta charset="utf-8" />
    <title>${escape(t.docTitle)}</title>
    <style>
      /* Una columna, sin gráficos ni tablas: el CV pasa por lectores ATS antes que
         por ojos humanos, y cualquier maquetación en columnas los confunde. */
      @page { size: A4; margin: 14mm 15mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0 auto;
        max-width: 190mm;
        padding: 12mm 10mm;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 10.5pt;
        line-height: 1.45;
        color: #1a1a1a;
        background: #fff;
      }
      h1 { margin: 0; font-size: 19pt; letter-spacing: -0.01em; }
      .headline { margin: 2pt 0 0; font-size: 11pt; font-weight: bold; }
      .contact { margin: 5pt 0 0; font-size: 9pt; color: #333; }
      h2 {
        margin: 15pt 0 5pt;
        padding-bottom: 2pt;
        border-bottom: 1px solid #999;
        font-size: 11pt;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      h3 { margin: 0; font-size: 10.5pt; }
      .job { margin-bottom: 10pt; }
      .job-head {
        display: flex;
        justify-content: space-between;
        gap: 8pt;
        margin-bottom: 4pt;
      }
      .job-title { font-size: 11pt; }
      .period { font-size: 9pt; color: #333; white-space: nowrap; }
      .entry { margin: 0 0 7pt; page-break-inside: avoid; }
      ul { margin: 3pt 0 0; padding-left: 15pt; }
      li { margin-bottom: 2pt; }
      p { margin: 0 0 4pt; }
      .stack { margin-top: 2pt; font-size: 9pt; color: #444; }
      .note { font-weight: normal; font-size: 9pt; color: #444; }
      @media print { body { padding: 0; } }
    </style>
  </head>
  <body>
    <header>
      <h1>${escape(profile.name)}</h1>
      <p class="headline">${escape(t.headline)}</p>
      <p class="contact">${contact}</p>
    </header>

    <section>
      <h2>${escape(t.sections.summary)}</h2>
      ${summary}
    </section>

    <section>
      <h2>${escape(t.sections.experience)}</h2>
      ${experience}
    </section>

    <section>
      <h2>${escape(t.sections.education)}</h2>
      <p>${escape(education)}</p>
    </section>

    <section>
      <h2>${escape(t.sections.skills)}</h2>
      <ul>
        ${skills}
      </ul>
    </section>

    <section>
      <h2>${escape(t.sections.languages)}</h2>
      <p>${escape(languages)}</p>
    </section>

    <section>
      <h2>${escape(t.sections.certifications)}</h2>
      <ul>
        ${certs}
      </ul>
    </section>
  </body>
</html>
`;
}

async function main() {
  const profile = await loadProfile();

  for (const lang of ['es', 'en'] as Lang[]) {
    const file = join(OUT_DIR, `cv-${lang}.html`);
    await writeFile(file, renderCv(profile, lang), 'utf8');
    const size = (await readFile(file)).length;
    console.log(`✓ web/public/cv-${lang}.html (${(size / 1024).toFixed(1)} kB)`);
  }

  console.log('\nAbrir en el navegador e Imprimir → Guardar como PDF.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
