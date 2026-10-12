import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { I18nProvider } from '../lib/i18n/I18nProvider.jsx';
import { ThemeProvider } from '../lib/theme/ThemeProvider.jsx';

/** Renders UI with the same providers the app uses (theme, i18n, router). */
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <ThemeProvider>
      <I18nProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </I18nProvider>
    </ThemeProvider>,
  );
}

/** Minimal matchMedia stub; jsdom does not implement it. */
export function stubMatchMedia(matches = false) {
  const listeners = new Set();
  const query = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };
  window.matchMedia = () => query;
  return {
    setMatches(next) {
      query.matches = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
}
