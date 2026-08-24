import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { content, LANGS } from '../content';
import type { Lang, Profile } from '../content';

const STORAGE_KEY = 'wm.lang';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return LANGS.includes(stored as Lang) ? (stored as Lang) : 'en';
}

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  profile: Profile;
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, profile: content[lang] as Profile }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  return value;
}

export function useContent(): Profile {
  return useLanguage().profile;
}

export function useLangSwitch() {
  const { lang, setLang } = useLanguage();
  return { lang, setLang };
}
