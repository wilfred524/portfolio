import { LANGS, LANG_LABELS } from '../content';
import { useLangSwitch } from '../i18n/LanguageProvider';
import { Bandera } from './Bandera';

/**
 * Conmutador de idioma. Botones y no enlaces: no hay navegación, solo cambio de estado.
 *
 * Con banderas y no con las siglas «EN ES» pegadas: dos pares de letras sin contexto no
 * se leen como un conmutador y pasan desapercibidos.
 *
 * El nombre accesible sigue siendo el código del idioma, y cada botón declara su propio
 * `lang` para que un lector de pantalla lo pronuncie como corresponde. El estado activo
 * se marca con `aria-pressed` y se estila desde ese atributo: un solo origen de verdad
 * para lo que se ve y lo que se anuncia.
 */
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
