/**
 * Lanza el backend Python en desarrollo.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO:
 * `npm run dev:api` llamaba a `python -m uvicorn` a secas, y eso resuelve al Python del
 * PATH — en Windows, el de la Microsoft Store, que no tiene instaladas las dependencias
 * del proyecto. Resultado: `concurrently` levantaba solo el frontend y la API moría con
 * "No module named uvicorn" en una línea que se perdía entre los logs de Vite. El sitio
 * cargaba y solo fallaba el chat, que es la forma más incómoda de romperse.
 *
 * Aquí se busca el intérprete del entorno virtual del propio proyecto, que es donde están
 * las dependencias, y solo se cae al `python` del sistema si no hay `.venv`.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const candidatos = [
  join(raiz, '.venv', 'Scripts', 'python.exe'), // Windows
  join(raiz, '.venv', 'bin', 'python'), // macOS y Linux
];

const interprete = candidatos.find(existsSync);

if (!interprete) {
  console.error(
    '\nNo encuentro el entorno virtual del backend.\n' +
      '  python -m venv .venv\n' +
      '  .venv/Scripts/pip install -r requirements.txt   (Windows)\n' +
      '  .venv/bin/pip install -r requirements.txt       (macOS/Linux)\n',
  );
  process.exit(1);
}

const proceso = spawn(
  interprete,
  ['-m', 'uvicorn', 'index:app', '--app-dir', 'api', '--reload', '--port', '3001'],
  { cwd: raiz, stdio: 'inherit' },
);

proceso.on('exit', (codigo) => process.exit(codigo ?? 0));
