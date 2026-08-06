# Contexto del agente

Todo lo que el agente sabe y todo lo que puede hacer está en esta carpeta. Son archivos
de texto plano que el backend concatena para formar el *system prompt* de cada
conversación (`api/_lib/persona.py`).

## Por qué está separado del contenido del sitio

El sitio y el CV ya cuentan lo básico: puestos, fechas, tecnologías. Quien escribe al
agente **ya tiene esa información delante**, así que repetirla no aporta nada. Esta
carpeta es para lo que el CV no cabe: el porqué de cada decisión, el contexto personal,
cómo se trabaja. Por eso **no se genera desde `web/src/content/profile.*.ts`**: se
escribe a mano y se mantiene aparte.

## ⚠️ Mantenimiento: esto NO se actualiza solo

Si cambia la página, este contexto se queda obsoleto en silencio: el agente seguirá
afirmando lo antiguo con total seguridad, que es la peor forma de fallar.

**Revisar esta carpeta cuando cambie cualquiera de estas cosas:**

| Si cambias… | Revisa |
|---|---|
| Un puesto, empresa o periodo en `profile.*.ts` | `40-experiencia.md` |
| Un proyecto (añadido, retirado o reescrito) | `40-experiencia.md` |
| Formación, idiomas, ubicación o modalidad (`facts`) | `30-perfil.md` |
| Disponibilidad o el tipo de rol que buscas | `30-perfil.md`, `50-agenda.md` |
| Email, teléfono o redes | `30-perfil.md` |
| Tu situación laboral (te contratan, dejas de buscar) | `30-perfil.md`, `50-agenda.md`, y valora apagar el agente |

## Orden y función de cada archivo

Se cargan por orden de número. El orden importa: lo que va antes pesa más.

| Archivo | Qué define | Quién lo edita |
|---|---|---|
| `00-rol.md` | Quién es el agente, para qué existe, qué no es | Técnico |
| `10-limites.md` | Qué no puede decir ni hacer; resistencia a manipulación | Técnico |
| `20-respuestas.md` | Formato, tono, longitud, idioma | Técnico |
| `30-perfil.md` | Quién es Wilfred: procedencia, situación, motivación | **Wilfred** |
| `40-experiencia.md` | Trayectoria y proyectos, con el detrás de escena | **Wilfred** |
| `50-agenda.md` | Cuándo ofrecer una llamada y cómo | **Wilfred** |

`50-agenda.md` solo se carga si hay `GOOGLE_CALENDAR_ID` configurado. Las reglas duras de
la cita (duración, franja horaria, antelación) **no están en el markdown**: viven en
`api/_lib/agenda.py`, porque el código las necesita para calcular los huecos y escritas en
dos sitios acabarían contradiciéndose. El sistema las inyecta al final del archivo.

Los tres primeros son infraestructura del agente; tócalos solo con criterio. Los tres
últimos son contenido tuyo y están pensados para que los edites sin saber Python.

## Regla que no se negocia

**Si un dato no está en estos archivos, el agente no lo sabe.** Nunca debe rellenar
huecos por su cuenta: un dato inventado sobre tu experiencia, dicho a un reclutador con
aplomo, hace más daño que no responder. Es la misma regla que ya rige el contenido del
sitio (`Fact` con `value` vacío no se renderiza: mejor omitir que inventar).
