import { NavLink } from 'react-router';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import styles from './MobileTabBar.module.css';

/**
 * Bottom navigation for phones and small tablets (hidden from 768px).
 * Renders only when there are at least two destinations; a single tab adds
 * nothing over the header.
 */
export function MobileTabBar({ items }) {
  const { t } = useTranslation();
  if (!items || items.length < 2) return null;

  return (
    <nav className={styles.tabBar} aria-label={t('nav.tabBarLabel')}>
      <ul role="list" className={styles.list}>
        {items.map(({ to, labelKey, icon: Icon, end }) => (
          <li key={to} className={styles.item}>
            <NavLink to={to} end={end} className={({ isActive }) => cx(styles.link, isActive && styles.active)}>
              <span className={styles.iconWrap}>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className={styles.label}>{t(labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
