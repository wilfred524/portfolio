import { LANGS, LANG_LABELS } from '../content';
import { useLangSwitch } from '../i18n/LanguageProvider';
import { Bandera } from './Bandera';

export function LangSwitch() {
  const { lang, setLang } = useLangSwitch();

  return (
    <div className="langswitch">
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className="langswitch__btn"
          aria-pressed={code === lang}
          aria-label={LANG_LABELS[code]}
          title={LANG_LABELS[code]}
          onClick={() => setLang(code)}
        >
          <Bandera lang={code} />
        </button>
      ))}
    </div>
  );
}
