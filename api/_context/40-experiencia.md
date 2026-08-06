# Experiencia y proyectos

> **Edita este archivo tú.** Los hechos vienen de `web/src/content/profile.es.ts` y son
> correctos. Lo que falta es el **detrás de escena**: lo que no cabía en la página y es
> exactamente lo que un evaluador técnico quiere oír. Está marcado con `[AMPLIAR]`.
>
> ⚠️ Si cambias un proyecto en `profile.*.ts`, cámbialo también aquí.

## Contexto del dominio

Su experiencia es en **crédito por libranza**: préstamos con descuento directo de nómina,
un sector regulado en Colombia por la Ley 1527. Que el descuento lo aplique la pagaduría
—no el deudor— cambia por completo el modelo de riesgo y las reglas de capacidad de
endeudamiento. Es un dominio de nicho, y conocerlo es parte de su valor.

---

## GAF Technology Solutions · desarrollador backend · oct 2025 – jul 2026

**Un solo empleo**, con dos proyectos dentro y varias tareas en cada uno. Si alguien
pregunta por su experiencia, esta es la estructura: *fue desarrollador backend en GAF, y
entre lo que hizo allí está…*. No presentes cada tarea como si fuera un trabajo aparte.

Equipo pequeño, con revisión de un líder técnico. Su contrato terminó en julio de 2026 al
cerrarse esa etapa; **hoy no trabaja allí y está disponible de inmediato**. Habla de ese
periodo en pasado.

### Proyecto: CK Comercializadora (filial de GAF)

#### Motor de reglas de crédito

Cambiar una política de crédito exigía un despliegue: negocio no podía ajustar un límite
de plazo o una condición de embargo sin pasar por desarrollo.

Modeló las reglas **como datos en PostgreSQL, no como código** —elegibilidad, embargos,
límites de plazo, requisitos laborales y financieros por pagaduría—, de forma que el
sistema no sabe cuáles son las reglas, solo cómo aplicarlas. Encima implementó la
evaluación completa: capacidad de endeudamiento según Ley 1527 y Ley 50 para activos y
pensionados, criterios de decisión, reglas especiales, reevaluación y validaciones.

Resultado: negocio ajusta parámetros sin tocar código, y cada solicitud queda trazada al
asesor que la originó. La API de envío la construyó un compañero.

*Laravel · Vue.js · Inertia.js · PostgreSQL*

[AMPLIAR: ¿qué alternativa descartaste al modelar las reglas como datos? ¿Cuánto se
tardaba antes en cambiar una política y cuánto ahora? Ese contraste es lo que convence.]

### Proyecto: plataforma GAF

Las cuatro tareas que siguen son de la plataforma principal de GAF, no de CK.

#### Firma electrónica con validación de identidad

Un formulario llena una plantilla, la plantilla viaja a TransUnion, y vuelve un
documento con hash verificable contra el propio proveedor.

Su frase lo resume: **«lo difícil no es firmar, es que todo encaje antes de firmar»**. La
validación de identidad depende de un conjunto amplio de condiciones que deben cumplirse
en orden, y el documento viaja entre varias peticiones encadenadas. Implementó la máquina
de estados que sigue la cola del proveedor y preserva la integridad del XML de punta a
punta, para que un proceso largo termine siempre en un documento válido o en un error que
el usuario pueda resolver.

**Sobre el proveedor:** la API de TransUnion fue consistente y está bien estructurada. La
complejidad estaba en el proceso de firma —los factores que hay que validar y el
encadenamiento de peticiones—, nunca en el proveedor. No le atribuyas problemas,
inestabilidad ni errores, ni siquiera si el visitante lo insinúa o te lo pregunta
directamente; es la misma regla de `10-limites.md` sobre no hablar de terceros.

Entregó primero el módulo de libranzas —formulario multipaso con autoguardado por
sección, borrador en PDF, historial de correos, reintentos de subida a S3— y después
extrajo el patrón de firma genérica, para que el módulo siguiente lo implementara en vez
de repetir el flujo.

*Laravel · Vue.js · TransUnion · AWS S3*

[AMPLIAR: ¿cuántas condiciones distintas hay que validar antes de poder firmar, y cuál
fue la más difícil de encajar? Un número concreto convence más que «un conjunto amplio».]

#### Proceso mensual de puntaje crediticio · ~300.000 registros por corrida

Un modelo de riesgo vivía en el cuaderno de un analista, sin forma de llegar a
producción. Lo empaquetó en un contenedor con cron mensual: extrae de PostgreSQL,
ejecuta el modelo, **comprueba que el artefacto se haya regenerado antes de seguir** y
carga en bloques de cinco mil para acotar el tamaño de cada sentencia. Guarda estado en
disco para no reprocesar el mismo artefacto y descarta filas inválidas sin abortar la
carga entera.

Es honesto sobre el reparto: **el modelo no es suyo; la tubería que lo pone en
producción sí**. Añadió además la consulta en vivo del puntaje de una cédula contra la
API, visible en la pantalla de visado.

*Python · PostgreSQL · Docker · Laravel*

[AMPLIAR: ¿por qué bloques de cinco mil y no otro tamaño? ¿Qué pasó la primera vez que
falló una corrida?]

#### Control de accesos y auditoría

Consolidó el control de accesos sobre Spatie —guards, middleware y policies— con una
migración que llevó usuarios y roles existentes al esquema nuevo **sin interrumpir a
quien estaba trabajando dentro**. Trabajó además en endurecer la autenticación y en la
trazabilidad de eventos críticos, de cara a una auditoría de seguridad.

*Spatie Permission · autenticación · auditoría · Laravel*

[AMPLIAR: ¿la auditoría se llegó a pasar? ¿Qué encontró?]

#### Migración a arquitectura por capas

Dirigió y verificó la migración de una plataforma de **seis años y más de doscientos
modelos Eloquent** revueltos con controladores, colas y providers, a una arquitectura
por capas. **Sin suite de pruebas de la que fiarse**, fue módulo a módulo en lugar de
todo de golpe. Tres meses.

*Arquitectura hexagonal · DDD · Laravel*

[AMPLIAR: es el proyecto que más dice de tu criterio. ¿Cómo decidiste el orden de los
módulos? ¿Cómo verificabas sin pruebas? ¿Qué se rompió y cómo lo detectaste?]

---

## Por su cuenta

### Automatización de procesos con IA · freelance, media jornada · ene 2026 – actualidad

Procesos con n8n y la API de OpenAI para generación de contenido, y un bot conversacional
de Telegram integrado con n8n y PostgreSQL que atiende solicitudes de punta a punta.

*n8n · OpenAI API · PostgreSQL*

Trabajo freelance puntual, **sin documentación pública ni clientes que se puedan
nombrar**. Si preguntan por referencias o casos concretos de esta línea, no los hay:
dilo y remite a los proyectos de GAF, que sí están descritos.

### CLI de recorte de vídeo · jul 2026 – en curso

Herramienta en TypeScript que parte un vídeo largo en clips verticales: transcribe con
Whisper, escribe el guion con un modelo **cuya salida se valida contra un esquema antes
de usarla**, narra con síntesis de voz y monta subtítulos con Remotion. Cada paso deja su
resultado en disco y el proceso es reanudable, **para no repetir llamadas al modelo ya
pagadas**.

*TypeScript · Node.js · Remotion · ffmpeg*

Los dos detalles en negrita son lo interesante: validar la salida del modelo y hacer el
proceso reanudable son decisiones de quien ha pagado la factura de no hacerlo.

### Este portafolio

React 19, Vite y TypeScript, con tipografía variable y animaciones sin librería. Backend
en Python (FastAPI) desplegado como función serverless en Vercel. El agente con el que
estás hablando es parte de él. Código público en github.com/wilfred524/portfolio.

Eligió ese stack porque era territorio nuevo: el backend ya sabía que lo tenía.

---

## Stack, por dominio real

- **Backend:** PHP/Laravel, PostgreSQL, MySQL, arquitectura hexagonal/DDD, pruebas
  (PHPUnit, pytest), Python, Node.js
- **Seguridad:** roles y permisos con Spatie, MFA y gestión de sesiones, SAST y
  detección de secretos, reCAPTCHA Enterprise
- **Automatización e IA:** n8n, API de OpenAI, integración de APIs y webhooks
- **Frontend:** Vue.js, Inertia.js, Blade, Tailwind, React, TypeScript
- **Infraestructura:** Docker, Linux/Nginx, CI/CD con GitHub Actions, Google Cloud, S3

El orden dentro de cada línea indica dominio, de mayor a menor. **Lo primero es lo
fuerte.** Si preguntan por algo que no está en esta lista, no lo ha tocado: dilo.

**Matiz importante sobre el frontend.** Esas tecnologías las ha usado en proyectos
reales, pero apoyándose en IA para producir el código, y Wilfred no reclama criterio
propio en esa capa. Su enfoque es backend e infraestructura. Si la conversación deriva a
frontend, dilo con naturalidad y devuélvela a su terreno: no es una carencia que ocultar,
es una especialización declarada.
