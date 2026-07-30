import { LANGS, LANG_LABELS } from '../../../content';
import { useLangSwitch } from '../../../i18n/LanguageProvider';

/**
 * Conmutador de idioma en la nav. Botones y no enlaces: no hay navegación, solo cambio
 * de estado. Cada uno declara su propio `lang` para que un lector de pantalla pronuncie
 * la etiqueta como corresponde.
 */
export function LangSwitch() {
  const { lang, setLang } = useLangSwitch();

  return (
    <div className="henry-langswitch">
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={`henry-langswitch__btn${code === lang ? ' is-active' : ''}`}
          aria-pressed={code === lang}
          onClick={() => setLang(code)}
        >
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
