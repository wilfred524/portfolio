# Credenciales de Google (Calendar y Sheets)

Lo que hace falta para encender el registro en la hoja de cálculo y la agenda del chat.

**No necesitas Google Workspace.** La suite de pago no interviene aquí: basta un proyecto
en Google Cloud con una **cuenta de servicio**, que es gratis y funciona con una cuenta de
Gmail normal. Una cuenta de servicio es un usuario robot con su propio correo, y el
mecanismo es simple: compartes con ese correo tu calendario y tu hoja, igual que los
compartirías con una persona.

El backend usa las API REST directamente (`_lib/google.py`), así que de todo el JSON solo
se aprovechan tres campos: `client_email`, `private_key` y `token_uri`.

## 1. Proyecto y APIs

1. Entra en [console.cloud.google.com](https://console.cloud.google.com) con tu Gmail.
2. Crea un proyecto. El nombre da igual (`portfolio-agente` sirve).
3. Con ese proyecto seleccionado, ve a **APIs y servicios → Biblioteca** y habilita las
   dos que se usan, una por una:
   - **Google Calendar API**
   - **Google Sheets API**

   Si se te olvida habilitarlas, las credenciales serán correctas y aun así las llamadas
   fallarán con un 403 que menciona que la API está deshabilitada.

## 2. La cuenta de servicio y su clave

1. **IAM y administración → Cuentas de servicio → Crear cuenta de servicio.**
2. Nombre: `agente-portfolio`. **No le asignes ningún rol** en el paso de permisos: los
   roles de IAM gobiernan recursos de Google Cloud, y aquí el acceso no viene de ahí, sino
   de compartir el calendario y la hoja con su correo (paso 3).
3. Ábrela y copia su dirección, del tipo
   `agente-portfolio@tu-proyecto.iam.gserviceaccount.com`. La vas a necesitar dos veces.
4. Pestaña **Claves → Agregar clave → Crear clave nueva → JSON**. Se descarga un archivo.

**Ese archivo es una credencial de acceso completa, no una contraseña recuperable.** No lo
metas en el repositorio, no lo pegues en un chat y no lo subas a Drive. Si se filtra, se
borra la clave desde la misma pantalla y se genera otra.

## 3. Compartir el calendario y la hoja

Este es el paso que se olvida y el que produce el 403 más desconcertante: credenciales
válidas, API habilitada, y Google respondiendo que no.

**Calendario.** En [calendar.google.com](https://calendar.google.com), sobre el calendario
que quieras usar: **Opciones → Configuración y uso compartido → Compartir con determinadas
personas → Añadir**. Pegas el correo de la cuenta de servicio y le das
**«Realizar cambios en los eventos»**. Con permiso de solo lectura puede mirar la
ocupación, pero no crear la cita.

En esa misma pantalla, más abajo, está el **ID del calendario**. Para tu calendario
principal es tu propia dirección de Gmail. Ese valor va en `GOOGLE_CALENDAR_ID`.

**Hoja de cálculo.** Crea una hoja nueva y **renombra las pestañas exactamente así**, en
minúsculas y sin acentos (`_lib/hojas.py:30-32` las busca por nombre literal):

| Pestaña | Columnas que escribe el backend |
|---|---|
| `conversaciones` | fecha, id de visitante, pregunta, respuesta |
| `leads` | fecha, id de visitante, nombre, correo, resumen |
| `agenda` | fecha, id de visitante, nombre, correo, inicio, enlace |

No hace falta que pongas encabezados: el backend siempre hace `append` y Google decide la
fila. Si los pones, quedan arriba y ya está.

Compártela con el correo de la cuenta de servicio como **Editor**. El
`GOOGLE_SHEET_ID` es el tramo largo de la URL:
`docs.google.com/spreadsheets/d/`**`ESTE_TROZO`**`/edit`.

## 4. Las variables

En `api/.env` para local, y en el panel de Vercel para producción:

```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...",...}
GOOGLE_SHEET_ID=
GOOGLE_CALENDAR_ID=tu-correo@gmail.com
AGENDA_HABILITADA=1
```

**El JSON va entero y en una sola línea.** `config.py:_cargar_dotenv` lee el `.env` línea a
línea, así que un JSON con saltos de línea se corta en la primera y no parsea. El archivo
que descarga Google viene formateado: ábrelo, quítale los saltos de línea y pégalo de un
tirón. Los `\n` que hay **dentro** del valor de `private_key` van escapados así, con
barra y ene literales, y deben quedarse tal cual.

`AGENDA_HABILITADA` es un interruptor aparte de las credenciales, y es deliberado
(`config.py:104-121`): agendar es la única acción del agente con consecuencias fuera del
chat, porque crea eventos reales y escribe a desconocidos. No debe encenderse sola porque
alguien dejara una credencial puesta en el panel. **Déjala apagada hasta haber probado**
los pasos anteriores.

## 5. Comprobarlo

Hay un script para esto, que va de menos a más consecuencias: primero pide el token, luego
lee la ocupación del calendario, luego escribe una fila en la hoja, y solo si se lo pides
crea un evento de verdad.

```bash
.venv/Scripts/python tools/probar-google.py            # token, calendario y hoja
.venv/Scripts/python tools/probar-google.py --evento   # además crea un evento real
```

Sin `--evento` no toca nada de tu calendario. Con `--evento` crea una cita mañana a esta
hora, con Meet: **bórrala después**. Ese último paso es el que puede fallar por lo que se
explica abajo, así que hazlo antes de encender `AGENDA_HABILITADA`.

El script imprime el correo de la cuenta de servicio, que es justo el que tienes que haber
compartido en el paso 3, por si dudas de haber pegado el correcto.

## Dos límites que ya están asumidos en el código

**Al visitante no se le invita al evento.** Una cuenta de servicio no puede añadir
invitados externos sin delegación de dominio, que solo existe en Workspace, y la llamada
entera fallaría por intentarlo. Por eso `calendario.py:59-62` lo evita a propósito y la
confirmación se manda por correo desde `_lib/correo.py`, con el enlace dentro. Que a su vez
depende de Resend, que hoy tampoco puede escribir a un tercero: ver `api/README.md`.

**El enlace de Meet puede no crearse.** `crear_evento` pide una videollamada con
`conferenceData`, y crear conferencias desde una cuenta de servicio sobre un calendario
personal es un caso conocido por fallar con «Invalid conference type value». Si Google lo
rechaza, no es una degradación suave: `calendario.py:90` hace `raise_for_status()`, la
excepción sube a `chat.py:131` y **la cita no se crea en absoluto**; el agente dice con
franqueza que no pudo y ofrece el correo. Compruébalo en el paso 5 antes de encender
`AGENDA_HABILITADA`. Si falla, la salida es quitar el bloque `conferenceData` y la cita
queda sin Meet: `correo.py:40` ya contempla ese caso y escribe «el enlace te llegará antes
de la reunión».

## Si algo falla

| Síntoma | Causa casi siempre |
|---|---|
| 403 al leer o escribir | No compartiste el calendario o la hoja con el correo de la cuenta de servicio |
| 403 «API deshabilitada» | Falta habilitar Calendar API o Sheets API en el proyecto |
| `Google rechazó las credenciales (HTTP 400)` | El JSON está mal pegado: cortado en varias líneas, o con la `private_key` alterada |
| La cita se crea pero no hay Meet | Lo de arriba: `conferenceData` desde cuenta de servicio |
| Nada se registra y no hay error | `sheets_activo` es falso: falta `GOOGLE_SHEET_ID` |
| El agente no ofrece horarios | `AGENDA_HABILITADA` sin poner, o falta `GOOGLE_CALENDAR_ID` |
