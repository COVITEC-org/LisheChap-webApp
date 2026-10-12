import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_COLORS,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  THEME_TRANSITION_MS,
} from './themeConfig.js';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function readStoredPreference() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_PREFERENCES.includes(stored) ? stored : DEFAULT_THEME_PREFERENCE;
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

function storePreference(preference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable (private mode). The choice still applies for this visit.
  }
}

function systemPrefersDark() {
  return typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;
}

/**
 * Theme preference: 'system' (follow the device), 'light' or 'dark'.
 * The resolved theme is written to <html data-theme> so tokens.css can switch.
 */
export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readStoredPreference);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const transitionTimer = useRef(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => () => clearTimeout(transitionTimer.current), []);

  const resolvedTheme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[resolvedTheme]);
  }, [resolvedTheme]);

  const setPreference = useCallback((next) => {
    if (!THEME_PREFERENCES.includes(next)) return;
    // Briefly enable color transitions so the switch feels smooth, not jarring.
    const root = document.documentElement;
    root.classList.add('theme-transition');
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => root.classList.remove('theme-transition'), THEME_TRANSITION_MS);

    setPreferenceState(next);
    storePreference(next);
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
