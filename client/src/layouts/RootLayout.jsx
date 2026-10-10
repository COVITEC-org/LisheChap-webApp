import { Suspense } from 'react';
import { Link, Outlet } from 'react-router';
import { useTranslation } from '../lib/i18n/useTranslation.js';

export function RootLayout() {
  const { t } = useTranslation();

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="app-header__inner" aria-label={t('nav.mainLabel')}>
          <Link to="/" className="brand">
            {t('common.appName')}
          </Link>
        </nav>
      </header>

      <main className="app-main" id="main-content">
        <Suspense fallback={<p className="page-loading" role="status">{t('common.loading')}</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
