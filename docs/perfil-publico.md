# Dossier de referencia — actualización de perfiles públicos (Wilfred Morales)

Fuente de verdad para cualquier edición en LinkedIn, GitHub u otras superficies.
Todo lo de aquí está acordado y verificado contra el repo `portfolio`.

## 1. Identidad y posicionamiento

- **Rol:** desarrollador backend. No full-stack.
- **Stack de cabecera:** PHP/Laravel · PostgreSQL · Python.
- **El dominio es la prueba, no la identidad.** Fintech de crédito por libranza es donde
  se demostró la capacidad, no lo que él es. Regla:
  - **Titular, headline, nombres de perfil:** sin nicho. Capacidad + stack.
  - **Resumen / "Acerca de":** el dominio aparece **una vez**, como circunstancia.
  - **Experiencia, proyectos, detalle:** ahí sí, entero (libranza, Ley 1527, pagadurías).
    Es lo que lo hace escaso para una fintech colombiana.
- **Modalidad: remoto.** Híbrido y presencial están descartados.
- **Ubicación:** Colombia, GMT-5. Contratación local o internacional vía Deel.

## 2. Voz

- Sustantivos técnicos, no metáforas de impacto. Nada de "soluciones robustas",
  "apasionado", "experto en", "donde el error cuesta dinero".
- Sin adjetivos de valor, sin tricolon retórico, sin frases de post motivacional.
- Datos antes que adjetivos: "puntúa más de 320.000 personas cada mes" dice más que
  "gran experiencia en procesamiento de datos".
- **Nunca la raya (—)** ni el guion medio fuera de rangos de fechas. Paréntesis, dos
  puntos, o partir la frase.
- Listón de referencia, escrito por él: *"El modelo no es mío; la tubería que lo pone en
  producción sí"*.

## 3. Copys aprobados

**Titular / headline**
> Desarrollador backend — PHP/Laravel · PostgreSQL · Python
> Backend developer — PHP/Laravel · PostgreSQL · Python

*(en LinkedIn, sin la raya: `Desarrollador backend · PHP/Laravel · PostgreSQL · Python`)*

**Resumen / Acerca de (ES)**
> Desarrollador backend en PHP/Laravel y Python, sobre PostgreSQL. Trabajo en lógica de
> negocio configurable, integraciones con servicios externos, procesos por lotes, control
> de accesos y despliegue en Docker sobre Linux. Toda mi experiencia de producción viene
> de una fintech de crédito.

**Resumen / About (EN)**
> Backend developer working with PHP/Laravel and Python on PostgreSQL. I work on
> configurable business logic, integrations with external services, batch processing,
> access control, and deployment with Docker on Linux. All my production experience comes
> from a credit fintech.

**Credencial corta (para bios de una línea, GitHub, etc.)**
> Lógica de negocio configurable, integraciones con servicios externos y procesos por
> lotes, en producción.

## 4. Datos duros verificados

- **Empleo:** GAF Technology Solutions. Desarrollador backend. Oct 2025 – Jul 2026.
  Contrato por obra o labor. Remoto, Colombia. Equipo de tecnología de 4 personas
  (2 desarrolladores, líder técnico, responsable de infraestructura y seguridad).
  Las solicitudes las origina CK Comercializadora, empresa del mismo grupo.
- **Formación:** Ingeniería Informática, Universidad Nacional Experimental del Táchira
  (UNET). Cursando 7.º semestre. Nunca dar detalles del expediente.
- **Idiomas:** Español nativo · Inglés B2 (EF SET). **Sin desglose por destreza y sin
  enlace al certificado**: el global es B2 y las otras tres destrezas son B1.
- **Certificación en curso:** Google IT Automation with Python (Coursera).
- **Contacto:** wilfred3019@gmail.com · +57 301 737 4234
- **Enlaces:** portfolio-wilfred524.vercel.app · github.com/wilfred524

## 5. Los seis proyectos (orden por seniority demostrada)

1. **Motor de reglas de crédito** (CK Comercializadora). Reglas de negocio modeladas como
   datos en PostgreSQL: elegibilidad, embargos, límites de plazo, requisitos por
   pagaduría. Capacidad de endeudamiento según Ley 1527 y Ley 50. El área de negocio
   ajusta parámetros sin desplegar código. Portal público de solicitudes con trazabilidad
   por asesor y reCAPTCHA Enterprise. *La API de envío la construyó un compañero.*
   `Laravel · Vue.js · Inertia.js · PostgreSQL`
2. **Migración a arquitectura por capas.** Primera etapa sobre seis años de código.
   Verificación módulo a módulo con revisión del líder técnico en cada paso. Eliminadas
   por completo las consultas SQL en crudo de los controladores. Tres meses.
   `Arquitectura por capas · Laravel · PostgreSQL`
3. **Proceso mensual de puntaje crediticio.** Contenedor con cron mensual: extrae de
   PostgreSQL, ejecuta el modelo, persiste. Más de 320.000 personas distintas por corrida,
   carga en bloques de 5.000, idempotente y reanudable, descarta filas inválidas sin
   abortar. *El modelo venía del área de riesgo; la tubería es suya.*
   `Python · PostgreSQL · Docker · Laravel`
4. **Infraestructura y despliegue.** Dockerización de una app que corría nativa, nueva
   instancia GCP con nginx como proxy inverso, migración en paralelo con la instancia
   anterior aún en producción, DNS y certificados con Certbot.
   `Docker · Linux/Nginx · GCP · Certbot`
5. **Firma electrónica con validación de identidad.** Módulo desde cero que sustituyó a
   uno legacy. Documento de 24 páginas generado desde plantillas (una por producto).
   Flujo como máquina de estados sobre respuestas asíncronas del proveedor: el asesor
   aprueba un borrador, los datos se validan contra TransUnion, la identidad por OTP o
   KBA. Trámite completo en unos 20 minutos. Documento firmado con hash, trazabilidad y
   respaldo en S3. `Laravel · Vue.js · Python · TransUnion · AWS S3`
6. **Control de accesos y permisos.** Árbol de permisos sobre 17 módulos, a nivel de
   opción y subproceso, blindaje ruta a ruta, migración de usuarios y roles existentes sin
   interrumpir la operación. `Spatie Permission · Laravel · PostgreSQL`

**Proyectos propios:** asistente del portafolio (Python/FastAPI/DeepSeek en Vercel),
CLI de recorte de vídeo, y el sitio (React/TypeScript).

## 6. Historias mal contadas: qué corregir

- **Duración en prosa.** Nunca "en diez meses" ni "X meses de experiencia": caduca y
  ancla. Las fechas van en los campos de fecha.
- **Nicho en el titular.** Fuera "Fintech de crédito" de cualquier headline.
- **Full-stack.** No se usa. Frontend solo Vue.js, Inertia.js y Blade, y solo donde tocó
  producción.
- **Pruebas (PHPUnit) como habilidad.** Retirado: se declaraba mientras el proyecto de
  migración dice que no había suite. Vuelve cuando existan pruebas escritas.
- **Atenuaciones.** Se conserva la que delimita autoría ("la API la hizo un compañero",
  "el modelo no es mío"). Se van las que justifican contexto ("equipo pequeño", "no había
  suite de pruebas", "la segunda etapa se ejecutó tras mi salida").
- **Resumir arriba lo que está detallado abajo.** El resumen abre con categorías de
  problema; no repite la lista de proyectos.
- **Métricas.** Solo las verificables: 320.000 personas por corrida, 17 módulos, bloques
  de 5.000, 24 páginas, seis años de código, equipo de 4, tres meses. Nunca porcentajes
  de mejora ni ahorros inventados.

## 7. Qué NO publicar

- Estatus migratorio, visado, patrocinio o nacionalidad.
- Pretensión salarial.
- Motivo detallado de salida de GAF (se cerró esa etapa y su contrato con ella).
- Nada sobre la pausa en la carrera, la situación familiar o el origen socioeconómico.
- El desglose por destreza del EF SET.
- Cualquier periodo posterior a Jul 2026 como si fuera empleo. No se narra.
