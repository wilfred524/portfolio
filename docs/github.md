# Perfil de GitHub

`github.com/wilfred524` va impreso en el PDF del CV y en el extracto de LinkedIn. Es el
único sitio donde un evaluador puede **verificar código**, y es justamente el argumento con
el que se compensan diez meses de experiencia. Hoy, tal como está, resta.

## Qué ve hoy quien llega desde el CV

- Sin biografía, sin ubicación y **sin enlace al portfolio**.
- Sin README de perfil.
- Cinco repositorios, de los cuales **tres son forks de proyectos ajenos**:
  `OpenMontage` («World's first open-source, agentic video production system…»),
  `career-ops` y `it-cert-automation-practice`.
- `servicios_generales`, descrito como «proyecto datamark servicios generales».
- `portfolio`, en TypeScript, sin descripción.

El problema no es que haya forks: es que **ocupan la mayor parte de la página y llevan las
descripciones grandilocuentes de sus autores originales**. Alguien que escanea en quince
segundos se lleva una de dos impresiones, las dos malas: o que el perfil es de alguien que
colecciona proyectos de IA ajenos, o que se está atribuyendo trabajo de otros. Ninguna de
las dos es cierta y las dos se producen sin leer una línea de código.

Y el perfil que se enlaza como prueba de un backend **no enseña backend por ningún lado**:
lo único propio y visible es un frontend en TypeScript.

## Qué hacer, por orden de impacto

1. **Ocultar los tres forks del perfil.** No hay que borrarlos: en cada repo,
   Settings → abajo del todo, o directamente desde el pin de la portada, se elige qué se
   muestra. Alternativa más rápida: fijar (pin) seis repos propios, porque los repos
   fijados sustituyen al listado por defecto en la portada.
2. **Fijar `portfolio` el primero**, con descripción y con el enlace al sitio en el campo
   «Website» del repo. Es el único que hoy demuestra algo entero: frontend, backend Python
   y despliegue.
3. **Rellenar la cabecera del perfil**: nombre, `Desarrollador backend · PHP/Laravel ·
   PostgreSQL · Python` como bio, ubicación (Colombia) y el enlace al portfolio. Son cuatro
   campos y es lo primero que se lee.
4. **Poner descripción a `servicios_generales`** o hacerlo privado. «proyecto datamark
   servicios generales» no dice qué es, qué resuelve ni con qué está hecho. Un repo sin
   descripción se lee como abandonado.
5. **README de perfil** (repo `wilfred524/wilfred524`, archivo `README.md`). Cinco líneas,
   la misma voz del portfolio, sin insignias ni GIFs: qué hace, con qué stack, dónde está
   el trabajo de producción (privado, de GAF) y el enlace al sitio. Nada de contadores de
   estrellas ni de rachas.

## El hueco de fondo

El trabajo de GAF es propietario y no se puede publicar: eso es normal y se explica en una
frase. Pero significa que **todo lo que un evaluador puede verificar por su cuenta son los
proyectos propios**, y hoy solo hay uno visible.

La CLI de recorte de vídeo se cita como proyecto propio en el contexto del agente y no
tiene repositorio público. Publicarla (aunque esté a medias, con un README honesto que diga
en qué punto está) convierte una afirmación del CV en algo comprobable. Es probablemente el
trabajo de una tarde con el mayor retorno de toda esta lista.

## Lo que no hay que hacer

- **No inflar el historial de contribuciones.** Los commits vacíos para pintar el
  calendario se detectan abriendo un commit, y quien los detecta deja de leer.
- **No publicar nada de GAF**, ni fragmentos «anonimizados». Es código propietario de un
  sector regulado.
- **No archivar los forks con una descripción propia encima.** Cambiar la descripción de un
  fork para que parezca trabajo propio es exactamente la lectura que queremos evitar.
