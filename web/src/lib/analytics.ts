/**
 * Medición de uso.
 *
 * POR QUÉ: hasta ahora no había ninguna. Cada decisión sobre qué poner en la primera
 * pantalla, si el CV se descarga o si alguien llega a hablar con el agente era una
 * opinión sin forma de comprobarse. Tres eventos bastan para responderlo.
 *
 * Se usa Vercel Analytics porque el sitio ya se despliega ahí: no hace falta clave ni
 * script de terceros, solo activarlo en el panel del proyecto. Sin cookies y sin datos
 * personales.
 *
 * AVISO: las páginas vistas funcionan en el plan gratuito; los eventos con nombre
 * (`track`) requieren plan Pro. Si el proyecto está en gratuito, estas llamadas no
 * fallan —simplemente no se registran— y las visitas se siguen contando. Por eso todo
 * pasa por esta función y no por llamadas sueltas repartidas por los componentes:
 * cambiar de proveedor es tocar este archivo y nada más.
 */
import { track as vercelTrack } from '@vercel/analytics';

/** Lo que interesa saber, cerrado a mano: una lista corta se puede leer de un vistazo. */
export type Evento =
  | 'cv-descargado'
  | 'chat-abierto'
  | 'repositorio-abierto'
  | 'linkedin-abierto';

export function track(evento: Evento, datos?: Record<string, string>) {
  vercelTrack(evento, datos);
}
