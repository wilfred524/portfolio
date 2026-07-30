# Despliegue (Vercel)

El sitio se despliega en **Vercel** desde `main` (cada push redespliega).
Config en `vercel.json` (raíz).

## Configuración correcta

`vercel.json`:
```json
{
  "installCommand": "npm install --include=dev",
  "buildCommand": "npm run build -w @portfolio/web",
  "outputDirectory": "web/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
El `rewrites` es el **fallback SPA**: sin él, recargar en `/disenos` daría 404
(usamos `BrowserRouter`).

**Ajustes del panel de Vercel (críticos):**
- **Root Directory** = raíz del repo (vacío / `./`). **NO** `web` ni `api`.
- **Framework Preset** = **Other** (no "Vite").
- Install/Build/Output = sin override (los define `vercel.json`).

## Errores ya resueltos (no repetir)

1. **Root Directory = `api`** → Vercel construía el backend y no encontraba `vercel.json`.
   Fix: Root Directory en la raíz + Preset "Other". *(Esta fue la causa real de los fallos;
   revisar SIEMPRE los ajustes del panel del servicio ante fallos que dependen del entorno.)*
2. **`vite`/`typescript` en `devDependencies`** → Vercel instala con `NODE_ENV=production`
   y omite devDependencies (`vite: command not found`, "91 packages" en vez de ~154).
   Fix: **`vite` y `@vitejs/plugin-react` viven en `dependencies`** (regla general: todo
   lo que el build de producción ejecuta va en `dependencies`).
3. **`tsc -b` en el build** fallaba resolviendo el tipo `vite/client` en el entorno de
   Vercel. Fix: el build de `web` es **solo `vite build`**; el chequeo de tipos es un
   script aparte (`npm run typecheck`). `tsc` con `noEmit` solo verifica, no construye.

## Backend (a futuro)

Cuando la UI llame a `/api` (demos IA), desplegar `api/` en un host Node (Render/Railway/
Fly) con sus claves en variables de entorno del servidor, y conectar por *rewrite* del
host estático (mismo origen) o `VITE_API_URL` + CORS (orígenes distintos).

## Git / flujo

- Remoto SSH (`git@github.com:wilfred524/portfolio.git`); `git push` funciona desde
  cualquier terminal del usuario. `gh` autenticado (keyring) para PRs/merges.
- Micro-arreglos de deploy: commit directo a `main` (mantener historial limpio).
- Cambios de diseño/código: rama + PR, merge bajo confirmación del usuario.
