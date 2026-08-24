import { track as vercelTrack } from '@vercel/analytics';

type Evento =
  | 'cv-descargado'
  | 'chat-abierto'
  | 'repositorio-abierto'
  | 'linkedin-abierto';

export function track(evento: Evento, datos?: Record<string, string>) {
  vercelTrack(evento, datos);
}
