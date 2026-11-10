import { useEffect, useState } from 'react';
import { readString, writeString } from '../lib/storage';

const THEMES = ['black', 'light', 'neo'];
const STORAGE_KEY = 'garage-theme';

const readSavedTheme = () => {
  const saved = readString(STORAGE_KEY);
  return THEMES.includes(saved) ? saved : THEMES[0];
};

export default function useTheme() {
  const [theme, setTheme] = useState(readSavedTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === THEMES[0]) root.removeAttribute('data-theme');
    else root.dataset.theme = theme;
    writeString(STORAGE_KEY, theme);

    const background = getComputedStyle(root).getPropertyValue('--color-black').trim();
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', `rgb(${background})`);
  }, [theme]);

  const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

  return { theme, nextTheme, cycleTheme: () => setTheme(nextTheme) };
}
