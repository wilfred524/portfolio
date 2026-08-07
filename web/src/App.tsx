import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './i18n/LanguageProvider';
import HenryPage from './designs/henry/HenryPage';

/**
 * Una sola página, en dos idiomas. La colección de diseños se retiró: varias páginas
 * diluían el mensaje y sembraban la duda de si el autor es diseñador o backend.
 */
export default function App() {
  return (
    <LanguageProvider>
      <HenryPage />
      {/* Sin cookies y sin datos personales; ver lib/analytics.ts. */}
      <Analytics />
    </LanguageProvider>
  );
}
