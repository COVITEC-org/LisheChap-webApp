import { useMemo } from 'react';
import { DEFAULT_LOCALE, FALLBACK_LOCALE, LOCALES } from './locales/index.js';
import { I18nContext } from './I18nContext.js';
import { createTranslator } from './translator.js';

export function I18nProvider({ locale = DEFAULT_LOCALE, children }) {
  const value = useMemo(() => {
    const activeLocale = LOCALES[locale] ? locale : DEFAULT_LOCALE;
    const t = createTranslator(LOCALES[activeLocale].messages, LOCALES[FALLBACK_LOCALE].messages);
    return { locale: activeLocale, intlLocale: LOCALES[activeLocale].intl, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
