# Portfolio · Wilfred Morales

Sitio personal de presentación y, a la vez, una **colección de sistemas de diseño
reconstruidos con fidelidad**. La idea es doble: servir de carta de presentación
como desarrollador full-stack y demostrar criterio de diseño e implementación
reproduciendo estéticas de referencia con detalle, en código propio.

La primera pieza de la colección es **Henry**, un sistema editorial monocromático
inspirado en carteles tipográficos: papel y tinta, jerarquía por escala tipográfica
y cero color. La página principal usa ese sistema; la galería (`/disenos`) reúne los
diseños disponibles y permite saltar entre ellos.

## Destacados técnicos

- **Placa halftone generada por código** — un retrato se convierte en tiempo real a
  1-bit con *dithering* ordenado (matriz Bayer 8×8) sobre `<canvas>`, recoloreado a la
  paleta del sistema y con un *spotlight* que sigue el cursor. Sin imágenes pretratadas.
- **Sistema de diseño fiel a su especificación** — tokens (color, tipografía, espaciado)
  aislados por diseño, tipografía variable de alto contraste y composición editorial
  a sangre completa.
- **Accesible y responsive** — respeta `prefers-reduced-motion`, jerarquía semántica y
  se adapta de escritorio a móvil.
- **Arquitectura frontend/backend desacoplada** pensada para crecer con demos
  interactivas (IA/APIs) sin exponer secretos en el cliente.

## Stack

React 19 · TypeScript · Vite · React Router · Express · npm workspaces (monorepo).

## Arquitectura

Monorepo con tres paquetes y una separación estricta entre cliente y servidor:

| Paquete | Rol |
|---|---|
| `web/` | Frontend (React + Vite). Interfaz y diseños. |
| `api/` | Backend (Express). Endpoints para futuras demos con IA/APIs; las claves viven solo aquí. |
| `shared/` | Contratos de la API tipados, compartidos por ambos. |

El frontend solo se comunica con el backend a través de un cliente HTTP tipado
(`web/src/lib/api.ts`) usando los contratos de `@portfolio/shared`. Los secretos
residen exclusivamente en `api/.env`.

Cada diseño de la colección es autocontenido en `web/src/designs/<slug>/`
(especificación, tokens CSS aislados bajo su clase raíz y componentes), y se registra
en `web/src/designs/registry.ts` para aparecer en la galería.

## Puesta en marcha

```bash
npm install
npm run dev        # frontend (5173) + backend (3001) en paralelo
npm run build      # compila api y web
```

Scripts útiles del frontend: `npm run build -w @portfolio/web` (bundle de producción),
`npm run typecheck -w @portfolio/web` (chequeo de tipos).

## Despliegue

Preparado para **Vercel**: el `vercel.json` define la instalación, el build del
workspace `web` y el *fallback* SPA. Cada push a `main` genera un nuevo despliegue.

## Créditos

El sistema de diseño **Henry** es obra de [Henry Desroches](https://henry.codes),
catalogado en [refero.design](https://styles.refero.design). Este proyecto es una
reinterpretación en React con fines de aprendizaje y portafolio; el código y el
contenido son propios. El retrato usado en la placa halftone es un grabado de Leonardo
da Vinci en dominio público.

## Autor

**Wilfred Morales** — Desarrollador Full-Stack
[GitHub](https://github.com/wilfred524) · [LinkedIn](https://www.linkedin.com/in/wilfred-morales-3220b2126)
