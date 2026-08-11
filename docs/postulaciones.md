# Dónde y cómo postular

Sin esto, el trabajo sobre el CV y el perfil rinde poco: hoy buena parte de las
postulaciones van a vacantes cuyo corte es aritmético y no se puede ganar escribiendo
mejor.

## El diagnóstico, en corto

Los rechazos llegan **en minutos u horas**. Eso significa que nadie leyó el PDF: lo que
decidió fue una pregunta de descarte del formulario o un umbral de matching. Contra el
perfil real:

| Filtro habitual de la vacante | El dato | Qué pasa |
|---|---|---|
| «2+ años de experiencia» | 10 meses | descarte automático |
| «Título en Ingeniería de Sistemas o afín» | en curso | descarte automático |
| «Empleo actual» | contrato cerrado en jul 2026 | penalización |

El CV ya se comprobó: se parsea limpio, en una columna, con las fuentes embebidas y el
texto extraíble. **El documento no es el problema.** El problema es a qué puerta se llama.

## Dónde sí compite

Por orden de rendimiento esperado:

1. **Vacantes de 0-2 años, junior o «desarrollador backend» sin número de años.** Es el
   único tramo donde el umbral no te excluye de entrada.
2. **Empresas pequeñas, agencias y consultoras.** Leen personas, no filtros. Es donde 10
   meses con sistemas en producción en un sector regulado pesa lo que vale.
3. **Vacantes de Laravel en producto.** El respaldo real más fuerte. Usa la variante:
   `npm run build:cv -w @portfolio/cv -- --variante=laravel`
4. **Procesos con prueba técnica.** El mejor escenario posible: ahí el portfolio, el
   código público y la forma de razonar cuentan más que la fecha de inicio del contrato.
5. **Contacto directo con el responsable técnico**, saltándose el formulario. Bajo volumen
   y alta conversión.

## Dónde no

No es que sea imposible: es que el coste por postulación no compensa mientras haya
opciones del bloque anterior sin agotar.

- Vacantes de **3+ años**. El filtro es aritmético.
- Vacantes que **exigen título**. Ídem, y además mentir ahí se comprueba con un
  certificado.
- **Formularios masivos de staffing internacional** (Turing y similares). Están calibrados
  para perfiles con varios años y descartan por umbral antes de mirar nada.
- **Vacantes de Python puro.** Tu experiencia de Python en producción es scripting y SQL
  directo. Es real y se defiende, pero compite en desventaja contra alguien con años de
  Django o FastAPI. Para las que sí valga la pena, usa `--variante=datos`.

## Preguntas de descarte: cómo responder sin mentir

**«¿Cuántos años de experiencia tienes con PHP/Laravel?»**
Si el campo es numérico, pon **1**. No 0: es falso a la baja, llevas diez meses en
producción y redondear al año entero es la convención. No inventes 3.

**«¿Tienes título universitario?»**
Si es sí/no, la respuesta es **no**. Si hay campo de texto, añade: «Ingeniería Informática
en curso, UNET». No lo conviertas en un párrafo.

**«¿Cuál es tu expectativa salarial?»**
Nunca la dejes en blanco (muchos formularios descartan por campo vacío) y nunca pongas 0.
Da un rango, y decide el número antes de empezar a postular, no en el formulario.

**«¿Estás disponible para empezar?»**
Inmediatamente. Es de las pocas casillas donde hoy puntúas mejor que la media.

**«¿Requieres patrocinio de visado?»**
Solo aparece en vacantes de otros países. Si trabajas en remoto desde Colombia, la
respuesta honesta suele ser «no, trabajo en remoto desde Colombia y facturo vía Deel».

**Regla general:** una pregunta de descarte respondida con honestidad y sin adorno te
cuesta esa vacante. Una respondida con una mentira te cuesta el proceso entero más tarde,
cuando ya invertiste tiempo y quedaste bien. La primera es mucho más barata.

## Cuando hay una persona detrás

Es lo que salta el filtro de años. Cuatro o cinco líneas, sin carta de presentación
formal, enviadas por mensaje de LinkedIn al responsable técnico o al reclutador:

```
Hola [nombre]:

Vi la vacante de [puesto]. Trabajé diez meses como desarrollador backend en una fintech
de crédito, en un equipo de cuatro, construyendo un motor de reglas sobre PostgreSQL, un
módulo de firma electrónica con validación de identidad y una tubería mensual en Python
que puntúa a más de 320.000 personas por corrida.

Sé que pedís más años de los que llevo. Te dejo el código y el detalle técnico por si el
trabajo compensa la fecha: [enlace al portfolio]

Gracias por leer.
```

Funciona porque nombra la objeción antes de que la piensen, y porque lo que ofrece a
cambio es verificable en un clic. No lo alargues ni le añadas entusiasmo: la carta larga
se salta.

## Qué medir

Sin registro, dentro de un mes no vas a saber qué cambió. Apunta por postulación: fecha,
empresa, canal, variante de CV enviada, años que pedía la vacante, y respuesta.

La pregunta que tiene que contestar esa tabla es una sola: **de las vacantes de 0-2 años y
con persona detrás, ¿qué proporción responde?** Si esa proporción sigue en cero después de
veinte postulaciones bien dirigidas, el problema no está en el filtro y hay que volver a
mirar el contenido.
