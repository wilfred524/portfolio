import { en } from './profile.en';
import { es } from './profile.es';

export type {
  Profile,
  Employment,
  ProjectItem,
  ProjectGroup,
  SkillGroup,
  Fact,
  UiStrings,
} from './types';

/** El inglés va primero: es el idioma por defecto del sitio. */
export const content = { en, es };

export type Lang = keyof typeof content;

export const LANGS = Object.keys(content) as Lang[];

/** Etiqueta del conmutador. En su propio idioma, no traducida. */
export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
};
