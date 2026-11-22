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

export const content = { en, es };

export type Lang = keyof typeof content;

export const LANGS = Object.keys(content) as Lang[];

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
};
