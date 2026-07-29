# Henry — Design System

> Spec del estilo "Henry" de refero.design
> (https://styles.refero.design/style/ff4b9eff-dc0b-4886-bd65-c2f5e9069318).
> Reconstruida a partir de los valores publicados en la página; puede
> reemplazarse por el `design.md` verbatim copiado con el botón "copy" del sitio.

## Filosofía

Sistema editorial 100% monocromático cálido, inspirado en carteles tipográficos
(broadsides) góticos. Toda la intensidad visual la lleva la tipografía display:
"un broadside editorial impreso en tinta cálida — titulares casi-negros tallados
en papel crema, alternando con secciones oscuras a sangre completa donde la
serif crema brilla". Sin acento cromático. La jerarquía se construye con escala,
peso e inversión papel↔tinta, nunca con color ni decoración.

## Colores (monocromo cálido — 7 valores)

| Token | Hex | Uso |
|---|---|---|
| Paper | `#fafafa` | Fondo crema, texto sobre Ink |
| Headline Ink | `#2a2722` | Texto principal, fondos invertidos |
| Sepia | `#3e3b36` | Neutro de apoyo |
| Ash | `#666666` | Texto secundario |
| Midstone | `#9f9f9f` | Texto terciario / metadatos |
| Pebble | `#b3b3b3` | Bordes suaves, detalles |
| Hairline | `#eeeeee` | Líneas divisorias sobre Paper |

## Tipografía (4 familias)

| Familia (original → sustituto libre) | Rol | Escala |
|---|---|---|
| Neue Montreal → **Switzer** | Grotesca UI/cuerpo | 12–32px, pesos 400/500/700, tracking −0.01em |
| Louize Display → **Instrument Serif** | Serif display alto contraste, titulares | 32–132px, peso 400, line-height 0.8–1.2 |
| Louize → **Lora** | Serif editorial para copy y links | 16–24px, peso 400 |
| Manuka → **Anton** | Ultra-condensada para mastheads | 226–371px, peso 400, SOLO mayúsculas |

Escala tipográfica: Minor Third (ratio 1.2) partiendo de 20px.

## Espaciado y forma

- Unidad base: **4px**.
- Gap entre secciones: **64–96px**.
- Padding de tarjeta: **16px**.
- Border-radius: **12px** — único valor permitido en todo el sistema.

## Reglas

**Hacer:**
- Serif display a 77px+ para titulares de sección.
- Alternar secciones Paper/Ink como bandas a sangre completa.
- Dejar que el 90% de cualquier página sea Paper o Ink vacío; las zonas densas
  se limitan al ticker de marca y al byline.

**Nunca:**
- Introducir colores cromáticos.
- Aplicar `box-shadow`, `drop-shadow` ni glow — el sistema no tiene sombras.
- Usar botones CTA rellenos; el énfasis viene de la escala y la inversión.
- Usar border-radius distinto de 12px.
