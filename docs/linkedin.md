# Perfil de LinkedIn

Texto listo para pegar. Vive aquí, versionado, para que no se desincronice del CV: si
cambias `web/src/content/profile.*.ts`, revisa este archivo.

**Por qué existe.** En LinkedIn Easy Apply el PDF casi no interviene: el filtro lee el
perfil. Un CV impecable no sirve de nada en ese canal si el perfil dice otra cosa, y ese
canal es donde más rechazos automáticos se están produciendo.

---

## Titular (headline)

Es el campo que más pesa en la búsqueda de LinkedIn Recruiter, junto con el cargo actual.
No se gasta en un eslogan: se gasta en los literales por los que quieres que te
encuentren.

```
Desarrollador Backend | PHP · Laravel · Python · PostgreSQL | APIs REST
```

En inglés, si vas a vacantes internacionales:

```
Backend Developer | PHP · Laravel · Python · PostgreSQL | REST APIs
```

Caben 220 caracteres. No los llenes con adjetivos: cada palabra que no sea una tecnología
o un cargo es una palabra que no te va a encontrar nadie.

## Extracto (Acerca de)

Las tres primeras líneas son las únicas que se ven sin desplegar. Ahí van las tecnologías.

```
Desarrollador backend en PHP/Laravel y Python, sobre PostgreSQL. Trabajo en lógica de
negocio configurable, APIs REST, integraciones con servicios externos, procesos por
lotes, optimización de consultas y despliegue en Docker sobre Linux.

Toda mi experiencia de producción viene de una fintech de crédito por libranza, un sector
regulado en Colombia. Lo que he construido allí: un motor de reglas donde las políticas
de crédito viven como datos en PostgreSQL y el área de negocio las ajusta sin esperar un
despliegue; un módulo de firma electrónica con validación de identidad contra TransUnion,
diseñado como una máquina de estados sobre respuestas asíncronas; y una tubería mensual
en Python que puntúa a más de 320.000 personas por corrida, idempotente y reanudable.

También trabajo la parte de infraestructura: dockericé la plataforma, la migré a una
instancia nueva de GCP sin interrupción del servicio y la dejé operando sobre HTTPS.

Remoto, GMT-5. Contratación local en Colombia o internacional vía Deel.
El código de mis proyectos propios está público: github.com/wilfred524
```

## Cargo actual

LinkedIn calcula tu experiencia a partir de las entradas de empleo, así que el cargo tiene
que ser literal, no creativo:

- **Puesto:** `Desarrollador Backend`
- **Empresa:** `GAF Technology Solutions`
- **Fechas:** `oct 2025 – jul 2026`
- **Modalidad:** Remoto
- **Descripción:** las mismas viñetas del CV. No las reescribas: si el reclutador compara
  y no coinciden, lo que se le queda es la discrepancia.

Marca **Sector: Servicios financieros** en la empresa si te deja: parte de las búsquedas
de reclutadores de fintech filtran por ahí.

## Aptitudes

LinkedIn permite 50 y las primeras tres son las que se muestran. El orden importa porque
el matching de Easy Apply cruza estas aptitudes con las de la vacante.

Las tres fijadas arriba: **PHP**, **Laravel**, **PostgreSQL**.

El resto, en este orden: Python · APIs REST · SQL · Eloquent ORM · Docker · Git · Linux ·
Nginx · MySQL · Vue.js · Inertia.js · Node.js · GitHub Actions · CI/CD · PHPUnit ·
Arquitectura por capas · Optimización de consultas · Spatie Permission · GCP · AWS S3 ·
Metodologías ágiles · Integración de APIs · Webhooks · Blade · TypeScript · React ·
FastAPI

No añadas nada que no esté en el CV. Una aptitud que no puedes defender cuesta más de lo
que suma, y aquí la lista es pública.

## Open to work

Actívalo en modo **solo para reclutadores** si sigues empleado en algún sitio, o público
si no. Dentro, rellena:

- **Cargos:** Desarrollador Backend, Desarrollador PHP, Desarrollador Laravel,
  Desarrollador Python, Desarrollador Full Stack. Pon los cinco: es un OR, no un AND, y
  cada uno te mete en un conjunto de búsquedas distinto.
- **Ubicaciones:** Colombia + **Remoto**. Añade también «Bogotá» y «Medellín» aunque
  trabajes en remoto: muchas vacantes remotas se publican con ciudad.
- **Tipo:** Jornada completa y Por contrato. Deja fuera prácticas.

## URL personalizada

Hoy es `linkedin.com/in/wilfred-morales-3220b2126`. Cámbiala a
`linkedin.com/in/wilfredmorales` si está libre. Es gratis, tarda un minuto, y la URL con
números lee como perfil abandonado. **Si la cambias, actualiza `social` en
`web/src/content/profile.es.ts` y `profile.en.ts`** y regenera el CV, porque la URL sale
impresa en el PDF.

## Lo que no hay que hacer

- **No pongas «Ingeniero de Sistemas» ni «Ingeniero Informático» como cargo.** No tienes
  el título; el cargo es Desarrollador Backend.
- **No rellenes la sección de Educación con una fecha de graduación que no exista.**
  LinkedIn la usa para calcular seniority, y una fecha inventada es la clase de dato que
  se comprueba.
- **No pongas «Open to work» y luego dejes el perfil en inglés a medias.** Si vas a
  vacantes internacionales, traduce el perfil entero o ninguno: un perfil mitad y mitad
  puntúa peor en las dos búsquedas.
