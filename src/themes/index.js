import { cyberpunk } from './cyberpunk.js';
import { modern } from './modern.js';
import { cartoon } from './cartoon.js';

export const themes = {
  cyberpunk,
  modern,
  cartoon,
};

export const defaultThemeId = 'cartoon';

export const themeList = [cyberpunk, modern, cartoon];

export function getTheme(id) {
  return themes[id] || themes[defaultThemeId];
}
