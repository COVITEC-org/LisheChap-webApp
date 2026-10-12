import { NavLink } from 'react-router';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { Logo } from '../brand/Logo.jsx';
import { PRIMARY_NAV_ITEMS } from './navItems.js';
import styles from './AppFooter.module.css';

/** Dark site footer. Lists only routes that exist; more columns join as features ship. */
export function AppFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo size={34} />
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>

        <nav className={styles.column} aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" className={styles.columnTitle}>
            {t('footer.quickLinks')}
          </h2>
          <ul role="list" className={styles.links}>
            {PRIMARY_NAV_ITEMS.map(({ to, labelKey, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={styles.link}>
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copyright}>{t('footer.copyright', { year })}</p>
      </div>
    </footer>
  );
}
