import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AppFooter } from '../components/navigation/AppFooter.jsx';
import { AppHeader } from '../components/navigation/AppHeader.jsx';
import { MobileTabBar } from '../components/navigation/MobileTabBar.jsx';
import { PRIMARY_NAV_ITEMS } from '../components/navigation/navItems.js';
import { PageLoader } from '../components/ui/PageLoader.jsx';
import { useTranslation } from '../lib/i18n/useTranslation.js';
import { cx } from '../lib/cx.js';
import styles from './RootLayout.module.css';

export function RootLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const hasTabBar = PRIMARY_NAV_ITEMS.length >= 2;

  return (
    <div className={cx(styles.shell, hasTabBar && styles.withTabBar)}>
      <a className="skip-link" href="#main-content">
        {t('common.skipToContent')}
      </a>
      <AppHeader />
      {/* Keyed by path so each page gets the entrance animation. */}
      <main id="main-content" key={pathname} className={cx(styles.main, 'page-enter')} tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <AppFooter />
      <MobileTabBar items={PRIMARY_NAV_ITEMS} />
    </div>
  );
}
