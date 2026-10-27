import { useEffect, useState } from 'react';

// Only an explicit toggle is stored; everyone else gets dark. (The old 'theme'
// key was auto-saved from the OS preference, so it is ignored.)
const STORAGE_KEY = 'theme-choice';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export default function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    const handler = (event) => {
      const next = event.detail;
      if (next === 'light' || next === 'dark') {
        setThemeState(next);
      }
    };
    window.addEventListener('theme-change', handler);
    return () => window.removeEventListener('theme-change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = (value) => {
    setThemeState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: value }));
  };

  return { theme, setTheme };
}
