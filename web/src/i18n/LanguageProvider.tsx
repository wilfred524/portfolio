import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { content, LANGS } from '../content';
import type { Lang, Profile } from '../content';

const STORAGE_KEY = 'wm.lang';

/**
 * Idioma inicial: lo que el visitante eligió la última vez y, si no eligió nunca,
 * INGLÉS. Deliberadamente no se mira `navigator.language`: redirigir por idioma del
 * navegador impide a los buscadores rastrear la otra versión, y aquí además solo hay
 * una URL, así que la detección automática dejaría al visitante sin pista de que el
 * contenido puede cambiar.
 */
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

  // El atributo lang del documento importa para lectores de pantalla, para el corrector
  // del navegador y para que el navegador ofrezca traducir la página correctamente.
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

/** Contenido del idioma activo. Los componentes ya no importan un perfil concreto. */
export function useContent(): Profile {
  return useLanguage().profile;
}

/** Para el conmutador de la nav. */
export function useLangSwitch() {
  const { lang, setLang } = useLanguage();
  return { lang, setLang };
}
