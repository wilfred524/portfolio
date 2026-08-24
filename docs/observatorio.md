# El observatorio

Cómo funciona la superficie del sitio. Aquí vive el **porqué** de las decisiones: el
código no lleva comentarios salvo los que evitan una regresión concreta.

## La forma

Una sola pantalla, sin scroll, recorrida por **siete planos**. El contenido no se
descubre bajando: se sustituye. La regla que gobierna todo lo demás:

> La coreografía nunca es una puerta. Ningún contenido queda detrás de una animación que
> haya que esperar. Cualquier clic o tecla durante una transición la salta al fotograma
> final.

Los siete planos **están siempre en el DOM**, ocultos con `visibility` e `inert`, nunca
desmontados: el HTML servido contiene las 34 tecnologías, los nueve proyectos y todas las
facts, y `Ctrl+F` encuentra lo que está en un plano inactivo.

**Modo documento** apila los planos con scroll y apaga el campo. Es la salida para
imprimir, buscar y `prefers-reduced-motion`. No es una segunda implementación: son los
mismos componentes con otra clase raíz.

## El campo: dos poblaciones

`visuals/ParticleEngine.ts`. Canvas 2D, sin librería, sin React dentro.

**El cielo** son 1.100 estrellas (520 en móvil) con posición polar respecto a un núcleo
descentrado, repartidas en dos brazos de espiral con densidad que cae hacia fuera. Solo
giran, con rotación diferencial. **Nunca se les quita ni se les añade nada.**

**Las chispas** son la materia que forma los rótulos. Nacen **encima de una estrella sin
apagarla**, viajan por una Bézier cúbica hasta su punto del texto, y al disolverse vuelven
a su estrella de origen para apagarse allí.

Que sean dos poblaciones y no una es lo que resuelve tres cosas a la vez:

- **El fondo no se vacía.** Antes el rótulo reclutaba 1.050 de 1.600 estrellas y el cielo
  perdía dos tercios de su materia justo cuando se formaba el titular.
- **El presupuesto deja de competir.** Con una sola población, el rótulo y las cifras
  salían del mismo bolsillo y darle densidad a uno se la quitaba al otro.
- **El reposo se abarata.** Ver abajo.

## Dos lienzos y dos cadencias

El cielo tiene **lienzo propio** (`.campo--cielo`) y se repinta cada 90 ms
(`MS_CIELO`); la materia va en otro (`.campo--materia`) a 60 fps. Componerlos es trabajo
del navegador, no del bucle.

La razón es aritmética: el cielo gira **0,2 px por fotograma**. Pagar 60 fps por un
desplazamiento subpíxel era trabajo invisible, y la constelación —lo más caro que se
pinta— solo aparece en reposo, que es el 95% del tiempo.

**Durante una transición el cielo se congela.** La atención está en el viaje, y el bitmap
no se toca en ningún fotograma. El cielo no recupera después el tiempo que estuvo parado:
pausa y sigue, sin dar un salto.

En reposo, si no hay chispas vivas, el fotograma sale sin tocar un píxel.

## Una transición

| Fase | Qué pasa |
|---|---|
| Disolución | Las piezas del plano saliente se rompen en orden inverso al de lectura, 70 ms entre una y otra |
| Cambio de plano | A los 240 ms (`DISOLUCION`). Antes de esto, mover el DOM descuadraría las partículas |
| Cascada | Cada figura se forma en orden de lectura: primero el rótulo, luego las cifras |
| Cesión | La nube se apaga en 420 ms mientras el trazo del DOM sube |

El plano **no se desliza**, solo aparece (`opacity`). El deslizamiento costaba 700 ms en
los que las cajas aún no eran medibles, y en ese hueco la materia disuelta ya viajaba de
vuelta y se reclutaba en pleno vuelo.

Nada del movimiento sale de `Math.random()`. El retardo de cada partícula sale de su
puesto en el contorno, así que el rótulo **se traza** en vez de aparecer. La forma de la
curva (`ese`, `remolino`, `estallido`) va por índice de plano: cada vista se rompe
siempre igual, pero dos seguidas no se rompen del mismo modo.

## El muestreo tipográfico

`visuals/muestreo.ts`. Las partículas no forman una silueta aproximada: forman **las
letras de verdad**, muestreadas del elemento del DOM que va a quedar debajo.

Tres cosas hay que hacer bien o sale una mancha:

- **Rasterizar en grande** (~160 px de altura de fuente, no el tamaño en pantalla).
- **Renglón a renglón**, midiendo con un `Range` carácter a carácter para recuperar dónde
  ha partido el navegador. Depende del ancho, del idioma y de la fuente ya cargada, y
  ninguna de las tres se puede predecir. Dibujarlo de una tirada formaba en móvil una
  línea que el texto de debajo no tenía.
- **Aplicar `letterSpacing`** al rasterizado: los titulares van expandidos.
- **Contorno antes que relleno** (75/25): lo que hace legible un glifo es su perfil.

Se espera a `document.fonts.ready` antes de muestrear, o las estrellas dibujan la forma de
la fuente de reserva.

## Legibilidad: el velo

El campo pasa por detrás del texto, y una estrella encima de una línea de 14 px se la
come. Cuatro capas, y el orden importa:

```
.campo--cielo    z-index 0
velo             ::before de cada bloque de texto
.campo--materia  z-index 2
.planos          z-index 3
```

El velo **no es una capa de pantalla completa**: lo pone cada bloque de texto en su propia
caja, como un rectángulo desenfocado. Solo lo llevan los textos de 16 px para abajo; un
titular de 3 rem se defiende solo y velarlo sería apagar cielo a cambio de nada.

Va **por debajo de la materia** a propósito: si tapara también las chispas, las apagaría
justo donde tienen que llegar encendidas. Y se controla con `--velo-alfa`, que es 0
mientras el plano no está formado: durante el viaje no hay ningún velo activo, así que las
partículas cruzan la pantalla a plena luz aunque pasen sobre un párrafo.

## Contraste

Mínimo **4,5:1** para todo texto por debajo de 24 px. Medido sobre `--bg`, y comprobado
también en el peor caso —una estrella brillante detrás del velo—, donde el texto más
tenue queda en 4,6:1.

`--text-faint` estuvo en 3,7:1 y no llegaba: se usa en tecnologías y pies de pieza, a
12 px.

## Navegación

Flechas y teclado (`←`/`→`, `PageUp`/`PageDown`) en escritorio. En táctil, **deslizar de
lado**: horizontal y no vertical porque cada plano tiene su propio scroll interno y en
390 px desborda, así que un gesto vertical sería el mismo para leer y para navegar. Las
flechas desaparecen bajo 48rem; el rail del HUD sirve en los dos tamaños.

El plano activo vive en el hash (`#/stack`) con `replaceState`: con `location.hash`, salir
de la página costaría siete pulsaciones de «atrás».

## El chat

Burbuja flotante abajo a la derecha, **fuera del plano**: vive en `SitePage` y no dentro de
una sección, así que está desde el primer fotograma, sobrevive a las transiciones y no se
disuelve con la vista. Es parte de la capa persistente, igual que el HUD.

El panel es un diálogo **no modal**: no atrapa el foco ni bloquea la página. `Escape` lo
cierra y devuelve el foco al lanzador. La navegación por teclado y el gesto táctil ya lo
ignoran, porque ambos descartan los eventos que nacen dentro de `[role="dialog"]`.

`Chat.tsx` es deliberadamente delgado: pinta mensajes y consume el flujo SSE. Toda la
lógica —qué sabe el agente, cuándo ofrece una llamada, qué se registra— vive en Python. Si
ese componente crece, es que algo se ha colado en el lado equivocado.

Los huecos de agenda que envía el backend se guardan y se devuelven en la siguiente
petición: el servidor no tiene memoria entre invocaciones y necesita saber a qué instante
se refería «h2» cuando el visitante lo confirma.

### La llamada de atención

Solo en la primera visita, anotada en `localStorage` bajo `wm.chat-llamada`.

Tres pulsos que salen **del hueco del propio lanzador**, más una etiqueta que dice para qué
sirve — sin ella el pulso llama la atención pero no la justifica. Se retira sola a los siete
segundos, o antes si el visitante abre el chat o la descarta.

Espera a que el plano en pantalla **termine de formarse** (la prop `listo`, que es
`reveladas`) y no a un temporizador: mientras las estrellas están dibujando el rótulo, un
pulso en la esquina competiría con la única coreografía que el visitante ha venido a ver.

La regla que la gobierna es la del resto del sitio: la coreografía nunca es una puerta. No
tapa contenido, no mueve el foco del teclado y no hay nada que haya que cerrar para seguir
leyendo. Con `prefers-reduced-motion` no llega a dispararse.

## Rendimiento: lo que está medido

- `shadowBlur` cuesta **8-14 ms por fotograma** con esta densidad. El brillo es un sprite
  de 32×32 pre-renderizado, uno por temperatura de estrella.
- Las líneas son **O(n²)**: rejilla espacial, distancia al cuadrado, tope de dos enlaces
  por estrella, y apagadas en móvil.
- **Cero asignaciones por fotograma.** Los `rgb(...)` van pre-montados, la rejilla y los
  buffers de segmentos se reservan una vez, y proyectar una estrella escribe en ella en
  vez de devolver un objeto. Antes eran ~600.000 objetos por segundo, y cada recolección
  se veía como un tirón.
- **DPR limitado a 2** y el delta acotado a 32 ms: sin tope, volver a la pestaña entrega
  un delta de minutos y las partículas se teletransportan.
- El puntero, si algún día se usa, escribe en un ref y lo consume el bucle. Nunca dispara
  trabajo.
- El canvas no captura el puntero (`pointer-events: none`): lo pulsable son las piezas del
  DOM que hay encima.

## Trampas conocidas

- `#root` tiene `isolation: isolate`: nada de `z-index` negativos para el canvas.
- `theme-color` en `index.html` debe seguir a `--bg`, o queda una franja de otro color en
  la barra del navegador móvil.
- `profile.*.ts` guarda `facts` que `tools/cv/src/build.ts` lee **por posición**.
  Reordenar ese array cambia lo que sale impreso en el CV.
- La caché del muestreo tiene tope de 48 entradas: su clave incluye la cuota de puntos,
  que cambia con cada reparto y cada redimensionado, así que sin tope crece sola.
