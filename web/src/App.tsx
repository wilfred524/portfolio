import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './i18n/LanguageProvider';
import SitePage from './page/SitePage';

export default function App() {
  return (
    <LanguageProvider>
      <SitePage />
      {/* Sin cookies y sin datos personales; ver lib/analytics.ts. */}
      <Analytics />
    </LanguageProvider>
  );
}
