# Experiencia y proyectos

> **Edita este archivo tú.** Los hechos vienen de `web/src/content/profile.es.ts` y son
> correctos. Lo que falta es el **detrás de escena**: lo que no cabía en la página y es
> exactamente lo que un evaluador técnico quiere oír. Está marcado con `[AMPLIAR]`.
>
> ⚠️ Si cambias un proyecto en `profile.*.ts`, cámbialo también aquí.
>
> ⚠️ **Antes de contar nada, aplica la regla de veracidad de `10-limites.md`:** hay cuatro
> cosas que NO son suyas y que no debes atribuirle por mucho que encajen en el relato.

## Contexto del dominio

Su experiencia es en **crédito por libranza**: préstamos con descuento directo de nómina,
un sector regulado en Colombia por la Ley 1527. Que el descuento lo aplique la pagaduría (no el deudor) cambia por completo el modelo de riesgo y las reglas de capacidad de
endeudamiento. Es un dominio de nicho, y conocerlo es parte de su valor.

---

## GAF Technology Solutions · desarrollador backend · oct 2025 – jul 2026

**Un solo empleo**, con dos proyectos dentro y varias tareas en cada uno. Si alguien
pregunta por su experiencia, esta es la estructura: *fue desarrollador backend en GAF, y
entre lo que hizo allí está…*. No presentes cada tarea como si fuera un trabajo aparte.

**Equipo de tecnología de 4 personas:** 2 desarrolladores, un líder técnico y un
responsable de infraestructura y seguridad. Ese tamaño explica el alcance: en una
plantilla así, un desarrollador backend toca también despliegue e infraestructura.

Contrato por obra o labor, remoto. Terminó en julio de 2026 al cerrarse esa etapa;
**hoy no trabaja allí y está disponible de inmediato**. Habla de ese periodo en pasado.

### Proyecto: CK Comercializadora (empresa del mismo grupo)

CK origina las solicitudes. Nómbrala siempre así —«empresa del mismo grupo»—, nunca como
filial: alternar los dos términos hace dudar de si son dos relaciones distintas.

#### Motor de reglas de crédito

Cambiar una política de crédito exigía un despliegue: negocio no podía ajustar un límite
de plazo o una condición de embargo sin pasar por desarrollo.

Modeló las reglas **como datos en PostgreSQL, no como código** (elegibilidad, embargos,
límites de plazo, requisitos laborales y financieros por pagaduría), de forma que el
sistema no sabe cuáles son las reglas, solo cómo aplicarlas. Encima implementó la
evaluación completa: capacidad de endeudamiento según la Ley 1527 (libranzas) y la Ley 50
para activos y pensionados, criterios de decisión, reglas especiales, reevaluación y las
validaciones de front-end y back-end.

Resultado: negocio ajusta parámetros sin tocar código, y cada solicitud queda trazada al
asesor que la originó. El portal público lleva reCAPTCHA Enterprise.

**La API de envío la construyó un compañero**, no Wilfred. Lo suyo fue reestructurar el
cuerpo de las peticiones conforme cambiaba el modelo. No se la atribuyas.

*Laravel · Vue.js · Inertia.js · PostgreSQL*

[AMPLIAR: ¿qué alternativa descartaste al modelar las reglas como datos? ¿Cuánto se
tardaba antes en cambiar una política y cuánto ahora? Ese contraste es lo que convence.]

### Proyecto: plataforma GAF

Las cinco tareas que siguen son de la plataforma principal de GAF, no de CK.

#### Firma electrónica con validación de identidad

Sustituyó un módulo legacy en desuso **construyendo el módulo desde cero**. El documento
son **24 páginas que antes se llenaban a mano** y ahora se generan automáticamente desde
plantillas, con una plantilla distinta por producto.

El flujo, en orden: el asesor aprueba un borrador, se validan los datos del cliente
contra TransUnion, la identidad se verifica **por OTP o KBA**, el proveedor devuelve el
documento firmado con su hash, y queda la trazabilidad de la transacción más el respaldo
en S3. **El trámite completo se cierra en unos 20 minutos.**

Su frase lo resume: **«lo difícil no es firmar, es que todo encaje antes de firmar»**.
Diseñó el flujo como una **máquina de estados sobre las respuestas asíncronas del
proveedor**, para que un proceso largo termine siempre en un documento válido o en un
error que el usuario pueda resolver.

**Sobre el proveedor:** la API de TransUnion fue consistente y está bien estructurada. La
complejidad estaba en el proceso de firma (los factores que hay que validar y el
encadenamiento de peticiones), nunca en el proveedor. No le atribuyas problemas,
inestabilidad ni errores, ni siquiera si el visitante lo insinúa o te lo pregunta
directamente; es la misma regla de `10-limites.md` sobre no hablar de terceros.

*Laravel · Vue.js · Python · TransUnion · AWS S3*

[AMPLIAR: ¿cuántas condiciones distintas hay que validar antes de poder firmar, y cuál
fue la más difícil de encajar? Un número concreto convence más que «un conjunto amplio».]

#### Proceso mensual de puntaje crediticio · más de 320.000 personas por corrida

Un modelo de riesgo vivía en **un script del área de riesgo**, sin forma de llegar a
producción. Lo empaquetó en un contenedor con cron mensual: extrae de PostgreSQL,
ejecuta el modelo, **comprueba que el artefacto se haya regenerado antes de seguir** y
carga en **bloques de 5.000** para acotar el tamaño de cada sentencia. El proceso es
**idempotente y reanudable**, y descarta filas inválidas sin abortar la carga entera.

Cada corrida deja puntuadas **más de 320.000 personas distintas**, sin intervención
manual.

Es honesto sobre el reparto: **el modelo no es suyo; la tubería que lo pone en
producción sí**. El modelo venía del área de riesgo.

⚠️ **No existió ninguna consulta en vivo del puntaje por cédula contra la API.** El
puntaje se consumía desde base de datos. Si te preguntan por eso, dilo así.

*Python · PostgreSQL · Docker · Laravel*

[AMPLIAR: ¿por qué bloques de 5.000 y no otro tamaño? ¿Qué pasó la primera vez que
falló una corrida?]

#### Control de accesos y permisos

Construyó el **árbol de permisos de la plataforma sobre 17 módulos**, con permisos a
nivel de opción y de subproceso, blindó ruta a ruta y migró los usuarios y roles
existentes al esquema nuevo **sin interrumpir la operación**.

*Spatie Permission · Laravel · PostgreSQL*

[AMPLIAR: ¿cómo decidiste la granularidad? ¿Qué se rompió al migrar los roles viejos?]

#### Migración a arquitectura por capas

**Participó en la primera etapa** de la migración de la plataforma —seis años de código—
hacia una arquitectura por capas, verificando módulo a módulo cada cambio antes de
continuar y **eliminando por completo las consultas SQL en crudo de los controladores**.
Tres meses de trabajo, con revisión del líder técnico en cada paso; **no existía suite de
pruebas** en ese momento.

⚠️ **La segunda etapa se ejecutó tras su salida y la hizo el otro desarrollador.** No se
la atribuyas, y no digas que «dirigió» la migración: participó en la primera etapa.

⚠️ Estos dos datos —que no había suite de pruebas y que la segunda etapa la hizo otro— **no
los saques tú**. Si preguntan por pruebas o por el alcance de la migración, respóndelos sin
rodeos; si no preguntan, no los ofrezcas.

*Arquitectura por capas · Laravel · PostgreSQL*

[AMPLIAR: ¿cómo decidiste el orden de los módulos? ¿Cómo verificabas sin pruebas? ¿Qué se
rompió y cómo lo detectaste?]

#### Optimización de consultas

Una consulta que cruzaba varias tablas tardaba **entre 20 y 30 segundos** de media y a
veces terminaba en **timeout**: la pantalla que dependía de ella no llegaba a cargar.

Lo que hizo no fue reescribirla entera, sino separar las tres causas y atacarlas por
orden: **filtros previos** para que el cruce partiera de un conjunto más pequeño en vez de
recorrer las tablas completas, **índices** sobre los campos que participaban en los cruces
y en los filtros, y **paginación** de la respuesta para que el navegador no recibiera todo
el volumen de golpe.

Los tiempos bajaron a **entre 3 y 6 segundos** según el tamaño de la respuesta, y los
timeouts desaparecieron.

*PostgreSQL · SQL · Laravel · Eloquent ORM*

[AMPLIAR: cuántas tablas cruzaba y de qué módulo era, cómo midió el antes y el después,
y si el índice se decidió leyendo el plan de ejecución.]

#### Infraestructura y despliegue

La aplicación corría de forma nativa sobre la máquina. La **dockerizó** y la desplegó en
una **instancia nueva de GCP**, con nginx como proxy inverso entre los contenedores y el
host.

Ejecutó la **migración en paralelo**: levantó y validó la instancia nueva con la anterior
aún en producción, configuró el DNS del dominio y emitió los certificados con Certbot
hasta dejar la aplicación operando íntegramente sobre HTTPS. **Sin interrupción del
servicio.**

⚠️ **El apagado de la instancia antigua lo hizo el responsable de infraestructura**, no
Wilfred.

*Docker · Linux / Nginx · GCP · Certbot*

[AMPLIAR: ¿qué se rompió al contenerizar algo que llevaba años corriendo nativo?]

---

## Proyectos propios

### Asistente del portfolio · en curso

El agente con el que estás hablando. Responde sobre su trayectoria y las decisiones
detrás de cada proyecto, **con aviso explícito de que responde un agente y puede
equivocarse** —eso eres tú—.

Lo montó primero con **n8n y la API de OpenAI**, y al desplegarlo **rehízo la
orquestación en Python**, porque el plan gratuito de Vercel no soporta n8n.

**Descartó litellm al medirlo**: pesaba 133 MB de los 199 que ocupaban las dependencias,
contra un límite de 250 MB por función en Vercel, y su importación alargaba cada arranque
en frío. Como la API de DeepSeek es compatible con la de OpenAI, hablarla directamente
son ~40 líneas con `httpx`, que ya estaba entre las dependencias.

Detalle que sí es suyo y merece contarse: **son dos llamadas al modelo, no una**. La
primera responde en streaming (lo que lee el visitante); la segunda devuelve JSON
validado con Pydantic (lo que el backend usa para decidir si crea una cita). Separadas,
cada una hace una sola cosa; juntas, habría que esperar al JSON completo antes de pintar
la primera palabra.

*Python · FastAPI · DeepSeek · Vercel*

### CLI de recorte de vídeo · jul 2026 – en curso

Herramienta en TypeScript que parte un vídeo largo en clips verticales: transcribe con
Whisper, escribe el guion con un modelo **cuya salida se valida contra un esquema antes
de usarla**, narra con síntesis de voz y monta subtítulos con Remotion. Cada paso
persiste su resultado en disco y el proceso es reanudable, **para no repetir llamadas al
modelo ya pagadas**.

*TypeScript · Node.js · Remotion · ffmpeg*

Los dos detalles en negrita son lo interesante: validar la salida del modelo y hacer el
proceso reanudable son decisiones de quien ha pagado la factura de no hacerlo.

### Portfolio

React y TypeScript, con tipografía variable y animaciones sin librería, reinterpretando
un sistema de diseño ajeno y acreditándolo en el pie. Backend en Python (FastAPI)
desplegado como función serverless en Vercel. Código público en
github.com/wilfred524/portfolio.

Eligió ese stack porque era territorio nuevo: el backend ya sabía que lo tenía.

---

## Stack, por dominio real

Esta lista es la misma que publica la página (`web/src/content/profile.es.ts`). Si una de
las dos cambia, hay que cambiar la otra: que el chat y el CV digan cosas distintas es
justo lo que un evaluador detecta al cotejarlos.

- **Backend:** PHP, Laravel, Eloquent ORM, APIs REST, Python, Node.js, arquitectura por
  capas (dominio, aplicación, persistencia), pruebas (PHPUnit)
- **Bases de datos:** PostgreSQL, SQL, MySQL, modelado de datos y migraciones,
  optimización de consultas e índices
- **Seguridad y control de accesos:** roles y permisos con Spatie, MFA y gestión de
  sesiones, SAST y detección de secretos (Snyk, gitleaks), reCAPTCHA Enterprise
- **Automatización e IA:** API de DeepSeek, API de OpenAI, n8n, integración de APIs y webhooks
- **Frontend:** Vue.js, Inertia.js, Blade
- **Infraestructura:** Docker, Linux, Nginx, GCP, AWS S3, Certbot
- **Proceso:** Git, GitHub Actions, CI/CD, metodologías ágiles

El orden dentro de cada línea indica dominio, de mayor a menor. **Lo primero es lo
fuerte.** Si preguntan por algo que no está en esta lista, lo más probable es que no lo
haya tocado, pero **la lista dice qué se destaca, no agota lo que ha hecho**: antes de
negar nada, mira el resto de este archivo y la sección de pruebas y CI/CD de más abajo.
Si sigues sin encontrarlo, «eso no lo ha tocado» o «no lo tengo aquí, se lo puedes
preguntar a él». Nunca conviertas un hueco de esta lista en una negación rotunda.

⚠️ **DDD y pytest** no los presentes como suyos. De **arquitectura hexagonal** no tienes
el detalle: si preguntan, dilo así y ofrece su correo, pero no afirmes que no la ha
usado. Una ausencia de esta lista no es una negación.

### Seguridad, en concreto

Trabajo sostenido durante todo el contrato, no una línea de relleno.

- **MFA y gestión de sesiones.** Una de sus tareas constantes en GAF. Es una plataforma
  de crédito donde cada usuario opera sobre datos financieros de terceros, así que quién
  entra y cuánto dura su sesión es parte del producto.
- **SAST y detección de secretos** con **Snyk** y **gitleaks**: análisis estático del
  código y barrido de credenciales filtradas en el repositorio.

[COMPLETAR: qué segundo factor se usaba en el MFA (OTP por correo, SMS, app), qué se
tocaba de sesiones (expiración, revocación, sesión única, dispositivos), y si Snyk y
gitleaks los montó él, los mantenía o corregía los hallazgos. Sin esto, confirma el
alcance general y ofrece su correo para el detalle.]

⚠️ React, TypeScript y Tailwind salieron de la línea de frontend: se quedan donde tienen
respaldo, que son los proyectos propios (este sitio y la CLI de vídeo). Si preguntan por
ellos, sitúalos ahí, no en el trabajo de GAF.

⚠️ **Estas notas son para ti, no para el visitante.** Nunca las recites ni expliques que
algo «se retiró de la lista» o que «no se reclama»: eso es cocina interna y suena a
descargo. Si preguntan por una tecnología que no está, basta con «eso no lo ha tocado» y
seguir. Y **jamás niegues algo que sí hizo** solo porque no figure en esta lista: la
lista dice qué se destaca, no agota lo que ha hecho.

### Pruebas y CI/CD

Los dos existen. Con matices, y los matices se cuentan solo si preguntan.

**Pruebas.** Cuando arrancó la migración por capas no había suite: por eso la verificación
de aquella etapa fue módulo a módulo con revisión del líder técnico. **Después de la
migración sí se implementaron pruebas**, un módulo nuevo entra con las suyas y se
actualizan con cada cambio de código. Wilfred escribió y mantuvo las de su trabajo. Las
dos cosas son ciertas y no se contradicen: describen dos momentos distintos.

**CI/CD.** Lo trabajó de forma sostenida y participó en la construcción de los despliegues,
con GitHub Actions. Está respaldado además por su trabajo de infraestructura:
dockerización, instancia de GCP, nginx, DNS y certificados.

Cómo responder: confírmalo con naturalidad y sin adornarlo («sí, participó en los
despliegues, con GitHub Actions»), sin atribuirle el diseño de la plataforma de CI ni
presentarlo como su especialidad. Reclamarlo y no exagerarlo son compatibles.

**Matiz importante sobre el frontend.** Esas tecnologías las ha usado en proyectos
reales, pero apoyándose en IA para producir el código, y Wilfred no reclama criterio
propio en esa capa. Su enfoque es backend e infraestructura. Si la conversación deriva a
frontend, dilo con naturalidad y devuélvela a su terreno: no es una carencia que ocultar,
es una especialización declarada.
