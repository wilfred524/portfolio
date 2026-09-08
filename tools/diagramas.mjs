/**
 * Genera los diagramas de arquitectura de web/public/diagramas a partir de diagramas/*.json.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO:
 * archify entrega un HTML autocontenido con su propia paleta y con JetBrains Mono pedida a
 * Google Fonts. Embebido en el sitio se veía como una pieza de otra web: otra tipografía,
 * otros grises, otro azul. Aquí se hacen dos cosas después de entregar cada diagrama:
 *
 *   1. Se reescriben sus 37 variables de color con los valores de web/src/styles/tokens.css,
 *      leídos de ese archivo y no copiados aquí, para que un cambio de token se propague
 *      con un `npm run build:diagramas` y no haya dos fuentes de verdad.
 *   2. Se quitan los <link> a Google Fonts y se incrusta Inter como data URI. El iframe es
 *      un documento aparte y no hereda las fuentes de la página; servirla desde /fonts la
 *      convertiría en una petición entre orígenes por el sandbox del iframe.
 *
 * El HTML retocado sigue pasando `archify check`: sus verificaciones son geométricas y no
 * dependen del contenido de <style>.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fuentes = join(raiz, 'diagramas');
const destino = join(raiz, 'web', 'public', 'diagramas');

const archify = process.env.ARCHIFY_HOME ?? join(homedir(), '.claude', 'skills', 'archify');
const cli = join(archify, 'bin', 'archify.mjs');

if (!existsSync(cli)) {
  console.error(
    `\nNo encuentro archify en ${archify}.\n` +
      '  Instálalo copiando la carpeta archify/ del fork a ~/.claude/skills/archify\n' +
      '  o define ARCHIFY_HOME apuntando a donde esté.\n',
  );
  process.exit(1);
}

function leerTokens() {
  const css = readFileSync(join(raiz, 'web', 'src', 'styles', 'tokens.css'), 'utf8');
  const tokens = new Map();
  for (const [, nombre, valor] of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    tokens.set(nombre, valor.trim());
  }
  return tokens;
}

const tokens = leerTokens();

function token(nombre) {
  const valor = tokens.get(nombre);
  if (!valor) throw new Error(`tokens.css no define --${nombre}`);
  return valor;
}

const PALETA = {
  bg: 'bg',
  grid: 'surface',
  panel: 'surface-low',
  'panel-border': 'line',
  mask: 'velo',
  text: 'text',
  'text-muted': 'text-mute',
  'text-dim': 'text-dim',
  'text-faint': 'text-faint',
  arrow: 'text-dim',
  'arrow-emphasis': 'accent',
  'guide-accent': 'accent-act',
  'lens-color': 'accent-act',
  'reach-color': 'accent',
  'reach-fill': 'accent-act-soft',
  'lane-fill': 'surface-lowest',
  'lane-stroke': 'line',
  'frontend-fill': 'surface-high',
  'frontend-stroke': 'line-strong',
  'backend-fill': 'surface',
  'backend-stroke': 'line-soft',
  'database-fill': 'surface-low',
  'database-stroke': 'line-soft',
  'cloud-fill': 'surface',
  'cloud-stroke': 'line',
  'messagebus-fill': 'surface',
  'messagebus-stroke': 'line-strong',
  'security-fill': 'surface-high',
  'security-stroke': 'accent',
  'external-fill': 'surface-lowest',
  'external-stroke': 'line',
  'toolbar-bg': 'surface-low',
  'toolbar-border': 'line',
  'toolbar-text': 'text-mute',
  'toolbar-hover': 'line',
  'toolbar-menu-bg': 'surface',
};

function fuenteIncrustada() {
  const require = createRequire(import.meta.url);
  const paquete = dirname(require.resolve('@fontsource-variable/inter/package.json'));
  const woff2 = join(paquete, 'files', 'inter-latin-wght-normal.woff2');
  return readFileSync(woff2).toString('base64');
}

const base64 = fuenteIncrustada();

const estilo = `
<style id="portafolio">
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(data:font/woff2;base64,${base64}) format('woff2-variations');
}
html[data-preset][data-theme="dark"] {
${Object.entries(PALETA)
  .map(([variable, nombre]) => `  --${variable}: ${token(nombre)};`)
  .join('\n')}
}
html[data-theme] body,
html[data-theme] svg text,
html[data-theme] .panel,
html[data-theme] .toolbar {
  font-family: 'Inter Variable', ${token('font').replace(/^'[^']+',\s*/, '')};
}
</style>
`;

function retenir(html) {
  const limpio = html
    .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>/g, '')
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '')
    .replace(/\s*<noscript>\s*<link href="https:\/\/fonts\.googleapis\.com[\s\S]*?<\/noscript>/g, '');

  if (!limpio.includes('</head>')) throw new Error('el HTML entregado no tiene </head>');
  if (limpio.includes('fonts.googleapis.com')) throw new Error('quedan peticiones a Google Fonts');

  return limpio.replace('</head>', `${estilo}</head>`);
}

mkdirSync(destino, { recursive: true });

const archivos = readdirSync(fuentes).filter((archivo) => archivo.endsWith('.json'));
let fallos = 0;

for (const archivo of archivos) {
  const [id, tipo] = archivo.replace(/\.json$/, '').split('.');
  const salida = join(destino, `${id}.html`);

  const { status } = spawnSync(
    process.execPath,
    [cli, 'deliver', tipo, join(fuentes, archivo), salida, '--quality', 'showcase'],
    {
      stdio: 'inherit',
      cwd: archify,
      env: { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: '1' },
    },
  );

  if (status !== 0) {
    fallos++;
    continue;
  }

  writeFileSync(salida, retenir(readFileSync(salida, 'utf8')));
  console.log(`  reteñido ${id}.html`);
}

if (fallos > 0) {
  console.error(`
${fallos} diagrama(s) sin entregar.`);
  process.exit(1);
}

console.log(`
${archivos.length} diagrama(s) en web/public/diagramas.`);
