# Puesta en marcha — obtener y conectar todos los accesos

Guion ordenado para dejar el agente funcionando de principio a fin. Cada paso termina con
una comprobación, y **no se pasa al siguiente hasta que la comprobación pasa**: si se ponen
las seis credenciales de golpe y algo falla, no se sabe cuál.

El orden no es arbitrario: va de lo que ya funciona a lo que tiene consecuencias fuera del
chat. Lo último que se enciende es la agenda, que es lo único que crea eventos reales y
escribe a desconocidos.

| # | Paso | Estado hoy | Sin esto… |
|---|---|---|---|
| 0 | Entorno local | listo | — |
| 1 | DeepSeek | **puesta** | el chat no responde |
| 2 | Telegram | falta | no te enteras de quién escribió |
| 3 | Google: proyecto y cuenta de servicio | falta | ni hoja ni calendario |
| 4 | Sheets | falta | no queda registro de nada |
| 5 | Calendar | falta | el agente no menciona llamadas |
| 6 | Resend | **puesta**, limitada | el visitante no recibe confirmación |
| 7 | Encender la agenda | apagada | el agente conversa pero no agenda |
| 8 | Vercel | falta | funciona en local y no en producción |

Todo se escribe en `api/.env`, que **está en `.gitignore` y no se comitea nunca**. La
plantilla con los nombres exactos es `api/.env.example`.

---

## 0. Entorno local

```bash
cd C:\Users\GAF\workspace\portfolio
npm install
pip install -r requirements.txt
npm run dev            # web en 5173, api en 3001
```

Los scripts de comprobación necesitan las dependencias del backend, y el intérprete global
no las tiene. Usa el del entorno virtual:

```bash
.venv/Scripts/python tools/probar-google.py
```

**Comprobación:** `http://localhost:5173` carga y el globo del chat aparece abajo a la
derecha.

---

## 1. DeepSeek — ya está puesta

`DEEPSEEK_API_KEY` está en tu `.env`. Es la única credencial imprescindible: sin ella el
endpoint responde que el chat no está disponible y no hay nada más que probar.

Se saca de [platform.deepseek.com](https://platform.deepseek.com) → **API keys**. Es de
pago por uso y requiere saldo; si el chat empieza a fallar con 402, es eso.

**Esta clave pasó por un historial de chat, así que conviene rotarla** cuando tengas un
rato: se genera una nueva en el panel y se revoca la vieja.

**Comprobación:** escribe cualquier cosa en el chat de `localhost:5173` y responde.

---

## 2. Telegram — el aviso al móvil

Es el paso más corto de todos y el que más se agradece: te enteras en el momento de que
alguien interesante escribió, en vez de descubrirlo tres días después.

**El token del bot.**

1. En Telegram, habla con [@BotFather](https://t.me/BotFather).
2. `/newbot` → te pide un nombre visible (`Portafolio Wilfred`) y luego un usuario que
   **debe terminar en `bot`** (`wilfred_portafolio_bot`).
3. Te devuelve el token, con esta forma: `8123456789:AAH...`. Eso es `TELEGRAM_BOT_TOKEN`.

**Tu chat id.** El bot no puede escribirte hasta que tú le hables primero — es una
restricción de Telegram, no del código.

1. Busca tu bot por su usuario y pulsa **Iniciar** (o mándale un «hola»).
2. Abre en el navegador, con tu token pegado:
   `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
3. En el JSON busca `"chat":{"id":123456789`. Ese número es `TELEGRAM_CHAT_ID`.

Si `getUpdates` devuelve `{"ok":true,"result":[]}`, es que no le has escrito todavía o que
Telegram ya entregó esas actualizaciones: mándale otro mensaje y recarga.

```
TELEGRAM_BOT_TOKEN=8123456789:AAH...
TELEGRAM_CHAT_ID=123456789
```

**Comprobación:**

```bash
.venv/Scripts/python tools/probar-telegram.py
```

Debe llegarte un mensaje al móvil. Si no llega, el script te dice qué respondió Telegram.

Fíjate en que **el aviso no salta con cada mensaje**, solo cuando la conversación tiene
sustancia o se agenda una cita (`telegram.py:5-9`). Un bot que vibra cada «hola» se
silencia en dos días.

---

## 3. Google — proyecto, APIs y cuenta de servicio

**No hace falta Google Workspace, ni existe una API key para esto.** Las claves de API de
Google solo abren datos públicos y en lectura; para tocar tu calendario de verdad hace falta
identidad. La que usa el backend es una **cuenta de servicio**: un usuario robot con su
propio correo.

El paso a paso completo, con las pantallas exactas, está en
[`credenciales-google.md`](credenciales-google.md). Resumido:

1. [console.cloud.google.com](https://console.cloud.google.com) → crear proyecto.
2. **APIs y servicios → Biblioteca** → habilitar **Google Calendar API** y
   **Google Sheets API**.
3. **IAM → Cuentas de servicio → Crear.** Sin asignarle ningún rol.
4. **Claves → Crear clave nueva → JSON.** Se descarga el archivo.
5. Copia el correo de la cuenta, del tipo
   `agente-portfolio@tu-proyecto.iam.gserviceaccount.com`. Lo necesitas en los pasos 4 y 5.

**Ese JSON es una credencial de acceso completa**, no una contraseña que se recupera. No va
al repositorio, no se pega en un chat y no se sube a Drive. Si se filtra, se borra la clave
desde la misma pantalla y se genera otra.

Va en el `.env` **entero y en una sola línea**, porque `config.py:_cargar_dotenv` lee el
archivo línea a línea y un JSON con saltos se corta en la primera:

```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...",...}
```

Los `\n` que hay dentro de `private_key` van escapados así, con barra y ene literales, y se
quedan tal cual.

**Comprobación:**

```bash
.venv/Scripts/python tools/probar-google.py
```

El paso 1 debe decir «Google entregó un token de acceso» e imprimir el correo de la cuenta
de servicio. Los pasos 2 y 3 saldrán omitidos: todavía no hay hoja ni calendario.

---

## 4. La hoja de cálculo

1. Crea una hoja nueva en [sheets.google.com](https://sheets.google.com).
2. **Renombra las pestañas exactamente así**, en minúsculas y sin acentos —`hojas.py:30-32`
   las busca por nombre literal—: `conversaciones`, `leads`, `agenda`.
3. **Compartir → añade el correo de la cuenta de servicio como Editor.**
4. El `GOOGLE_SHEET_ID` es el tramo largo de la URL:
   `docs.google.com/spreadsheets/d/`**`ESTE_TROZO`**`/edit`.

El paso 3 es el que se olvida, y produce el 403 más desconcertante que existe: credenciales
válidas, API habilitada, y Google diciendo que no. **El permiso no viene de Google Cloud,
viene de compartir.**

**Comprobación:** vuelve a lanzar `probar-google.py`. El paso 3 escribe una fila en
`conversaciones`; ábrela y mírala. Ojo: `hojas.py` nunca lanza excepción a propósito —que
falle el registro no puede tumbar la respuesta al visitante—, así que si la fila no aparece,
el error está en el log de la consola, no en el resultado del script.

---

## 5. El calendario

**Crea un calendario nuevo**, no uses el principal. En
[calendar.google.com](https://calendar.google.com) → **Otros calendarios → + → Crear
calendario**, nómbralo `Portafolio`.

El motivo es acotar el daño: a la cuenta de servicio le das permiso de *cambiar eventos*, y
ahí van a caer citas de desconocidos. Mezclarlas con tu agenda personal, bajo una credencial
que vive en un servidor, no compensa.

La contrapartida, que conviene saber: `freeBusy` solo mirará ese calendario, así que si
tienes algo personal a esa hora, el agente puede ofrecerla igualmente.

1. Sobre el calendario nuevo: **⋮ → Configuración y uso compartido**.
2. **Compartir con determinadas personas → Añadir** → el correo de la cuenta de servicio,
   con permiso **«Realizar cambios en los eventos»**. Con solo lectura ve la ocupación pero
   no puede crear la cita.
3. Más abajo, en **Integrar calendario**, está el **ID de calendario**. Para un calendario
   creado a mano acaba en `@group.calendar.google.com` y va entero, sin recortar.

```
GOOGLE_CALENDAR_ID=xxxxx@group.calendar.google.com
```

**Comprobación:** `probar-google.py` ya no omite el paso 2 y responde cuántos intervalos
ocupados ve. Todavía **no** pases `--evento`: eso es el paso 7.

---

## 6. Resend — el correo de confirmación

`RESEND_API_KEY` y `RESEND_FROM` ya están puestas, pero con una limitación que hay que tener
presente: el remitente es `onboarding@resend.dev`, que es el sandbox. **Solo entrega en la
dirección con la que se registró la cuenta.** A un visitante desconocido, la API responde
403 de dominio no verificado. Comprobado el 2026-08-11.

Para que la confirmación llegue de verdad a un visitante hace falta un **dominio propio
verificado** en Resend, con registros DKIM, SPF y MX, normalmente sobre un subdominio de
envío tipo `send.tudominio.com`. Un subdominio de `vercel.app` no vale: no se controla su
zona DNS.

No es urgente mientras la agenda esté apagada. Sí lo es antes del paso 7, porque la
confirmación de la cita —con el enlace de la videollamada dentro— viaja por ahí.

---

## 7. Encender la agenda

Este es el único paso con consecuencias fuera del chat, y por eso es el último.

Antes de encender nada, **prueba el evento**:

```bash
.venv/Scripts/python tools/probar-google.py --evento
```

Crea una cita real mañana a esta hora, con Meet. **Bórrala después.**

Ese paso es el que puede fallar: `crear_evento` pide videollamada con `conferenceData`, y
crear conferencias desde una cuenta de servicio sobre un calendario personal es un caso
conocido por fallar con «Invalid conference type value». Y ahí **no hay degradación suave**:
`calendario.py:90` hace `raise_for_status()`, la excepción sube a `chat.py:131` y la cita no
llega a existir. Si falla, la salida es quitar el bloque `conferenceData` y dejar la cita sin
Meet — `correo.py:40` ya contempla ese caso y escribe «el enlace te llegará antes de la
reunión».

Si el evento se crea bien:

```
AGENDA_HABILITADA=1
```

Es un interruptor **aparte** de las credenciales, y es deliberado (`config.py:104-121`): que
la agenda se encienda sola porque alguien dejó una variable puesta en un panel es demasiado
fácil.

Otro límite ya asumido en el código: **al visitante no se le invita al evento**. Una cuenta
de servicio no puede añadir invitados externos sin delegación de dominio, que solo existe en
Workspace, y la llamada entera fallaría por intentarlo (`calendario.py:59-62`). Por eso el
enlace se manda por correo, y por eso el paso 6 importa.

**Comprobación:** en el chat, pide una llamada. El agente debe ofrecer huecos reales,
crear el evento y anunciarlo. Nunca al revés: `_context/50-agenda.md` prohíbe anunciar una
cita que no exista ya.

---

## 8. Producción (Vercel)

En Vercel el `.env` no viaja —está en `.gitignore`—: las variables se cargan en el panel del
proyecto. El código no distingue entre los dos casos, solo lee `os.environ`.

El repositorio ya está enlazado al proyecto `portfolio-wilfred524`. Desde `portfolio/`:

```bash
npx vercel env add TELEGRAM_BOT_TOKEN production
npx vercel env add TELEGRAM_CHAT_ID production
npx vercel env add GOOGLE_SERVICE_ACCOUNT_JSON production
npx vercel env add GOOGLE_SHEET_ID production
npx vercel env add GOOGLE_CALENDAR_ID production
npx vercel env add AGENDA_HABILITADA production
```

O a mano en **Settings → Environment Variables**, que para el JSON de una línea es más
cómodo. Si prefieres el CLI y el pegado se rompe, usa el panel.

⚠️ **Nunca ejecutes `vercel` desde `C:\Users\GAF\workspace`.** Desde la raíz del workspace
publicaría el material de trabajo de `gaf/`, las credenciales de `n8n/` y los backups de
`postgres-local/`. Siempre desde `portfolio/`.

Las variables nuevas **no se aplican al despliegue actual**: hay que volver a desplegar
(`git push` a `main`, o **Redeploy** en el panel).

**Comprobación:** abre el sitio publicado, escribe en el chat y mira que llegue el aviso de
Telegram y aparezca la fila en la hoja.

---

## Si algo no funciona

Lo primero, siempre, es mirar qué cree el backend que tiene configurado:

```bash
.venv/Scripts/python tools/probar-google.py
```

Las cuatro primeras líneas (`google_activo`, `sheets_activo`, `calendar_activo`,
`agenda_activa`) responden a la mitad de las preguntas.

| Síntoma | Causa casi siempre |
|---|---|
| El chat responde pero no llega aviso | Falta una de las dos variables de Telegram: hacen falta las dos |
| 403 de Google con credenciales correctas | No compartiste la hoja o el calendario con el correo de la cuenta de servicio |
| `Google rechazó las credenciales (HTTP 400)` | El JSON está cortado en varias líneas, o `private_key` alterada |
| Nada se registra en la hoja y no hay error | `sheets_activo` es falso, o las pestañas no se llaman exactamente así |
| El agente no menciona llamadas | `AGENDA_HABILITADA` sin poner, o falta `GOOGLE_CALENDAR_ID` |
| El visitante no recibe el correo | Sandbox de Resend: hace falta dominio propio (paso 6) |
| Funciona en local y no en producción | Las variables no están en el panel de Vercel, o falta redesplegar |

Para cambiar cuándo se atienden las llamadas —duración, franja horaria, antelación mínima—:
`api/_lib/agenda.py`, y nada más. El prompt del agente las lee de ahí.
