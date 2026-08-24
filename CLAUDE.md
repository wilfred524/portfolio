# CLAUDE.md — Portfolio (Wilfred Morales)

Índice de contexto para agentes de IA. Este archivo se carga en cada sesión: mantenlo
**corto**. El detalle vive en `docs/` (microsegmentado); lee solo el que necesites.

## Qué es

Sitio personal de presentación: **una sola pantalla sin scroll**, recorrida por siete
planos sobre un campo de partículas en canvas. Monorepo: frontend TypeScript, **backend
Python** (FastAPI en Vercel) con un agente de IA que conversa con el visitante y le
agenda llamadas. **Idioma de trabajo: español.**

El objetivo es que un evaluador técnico entienda en tres o cuatro planos qué se ha
construido, en qué dominio y desde cuándo. La reconstrucción del sistema Henry que había
antes se retiró entera.

## Reglas invariantes (no romper)

- **Los valores de diseño salen de `web/src/styles/tokens.css`**, siempre. Un color o un
  tamaño escrito a mano en otro archivo es un error, no una excepción. La jerarquía va en
  la luminosidad, no en el color: hay dos acentos y cada uno significa una cosa.
- **El código no lleva comentarios.** El porqué va a `docs/` o al mensaje del commit;
  el código dice qué hace. Única excepción: el aviso que evita una regresión concreta
  (un acoplamiento que no se ve desde el archivo que se edita, un valor medido que
  alguien revertiría). Detalle en [`docs/conventions.md`](docs/conventions.md).
- **Contraste mínimo 4,5:1** para todo texto bajo 24 px, comprobado sobre el campo de
  partículas y no solo sobre el fondo liso. Legibilidad por encima de gracia.
- **Todo texto/contenido** vive en `web/src/content/profile.es.ts` y `profile.en.ts`
  —incluidos los textos de interfaz, en su bloque `ui`—. Ningún componente hardcodea
  copy. Ambos declaran `satisfies Profile` (`content/types.ts`): si a un idioma le falta
  una clave, `typecheck` falla. **El idioma por defecto es el inglés.**
- **Separación frontend/backend estricta**: el frontend solo llama al backend por
  `web/src/lib/api.ts` (tipado con `@portfolio/shared`). Secretos solo en `api/.env`.
  `shared/` es un contrato **acordado, no compartido**: el backend es Python y no importa
  esos tipos, así que al tocar `shared/src/index.ts` hay que tocar `api/_lib/modelos.py`.
- **El agente no inventa**: todo lo que sabe está en `api/_context/` (markdown, editable
  sin saber Python). Si un dato no está ahí, no lo sabe. Lo que cambie en la página hay
  que reflejarlo ahí a mano — ver `api/_context/README.md`.
- **Nada que el sistema no pueda cumplir**: el agente solo ofrece horarios que le da el
  backend tras consultar el calendario real, y solo anuncia una cita ya creada.
- **Toda integración se degrada sola**: si falta una credencial, esa pieza se apaga y el
  chat sigue. Un portafolio no se cae porque expiró una clave de correo.
- **Dependencias de build en `dependencies`, no `devDependencies`** (lección de deploy;
  ver [`docs/deployment.md`](docs/deployment.md)).
- **Accesibilidad**: elementos decorativos con `aria-hidden`; toda animación respeta
  `prefers-reduced-motion`.

## Mapa de documentos

| Necesitas… | Lee |
|---|---|
| Estructura del repo, workspaces, comandos | [`docs/architecture.md`](docs/architecture.md) |
| **Cómo funciona la superficie: planos, motor de partículas, capas, velo, rendimiento** | [`docs/observatorio.md`](docs/observatorio.md) |
| Config de Vercel y errores ya resueltos | [`docs/deployment.md`](docs/deployment.md) |
| **Obtener y conectar todas las credenciales, en orden** | [`docs/puesta-en-marcha.md`](docs/puesta-en-marcha.md) |
| Credenciales de Google (Calendar y Sheets), en detalle | [`docs/credenciales-google.md`](docs/credenciales-google.md) |
| Convenciones: contenido, añadir un diseño, git | [`docs/conventions.md`](docs/conventions.md) |
| Copys aprobados, datos verificados y qué no publicar | [`docs/perfil-publico.md`](docs/perfil-publico.md) |
| Texto del perfil de LinkedIn | [`docs/linkedin.md`](docs/linkedin.md) |
| Perfil de GitHub: qué corregir | [`docs/github.md`](docs/github.md) |
| Dónde postular y cómo responder los filtros | [`docs/postulaciones.md`](docs/postulaciones.md) |

**Las cuatro superficies se mueven juntas.** El CV (`profile.*.ts` + `tools/cv/`), la
página, LinkedIn y `api/_context/` cuentan lo mismo a la misma persona: un evaluador
coteja el PDF con el sitio y con el chat. Si cambias una habilidad, un proyecto o una
métrica en un sitio, cámbiala en los cuatro.

## Comandos rápidos

```bash
npm run dev                          # web (5173) + api (3001)
npm run build -w @portfolio/web      # bundle de producción (vite)
npm run typecheck -w @portfolio/web  # chequeo de tipos (tsc)
npm run build:cv -w @portfolio/cv    # regenera los PDF del CV (web/public, se publican)
npm run build:cv -w @portfolio/cv -- --variante=laravel   # versión para enviar, NO se publica
npm run build:cv -w @portfolio/cv -- --variante=datos     # ídem; salen a tools/cv/out/
pip install -r requirements.txt      # dependencias del backend Python
```

Para cambiar cuándo se atienden las llamadas (duración, franja, antelación):
`api/_lib/agenda.py`, y nada más — el prompt las lee de ahí.
