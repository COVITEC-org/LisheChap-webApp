import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useScrolled } from '../../hooks/useScrolled.js';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { Logo } from '../brand/Logo.jsx';
import { Drawer } from '../ui/Drawer.jsx';
import { IconButton } from '../ui/IconButton.jsx';
import { PRIMARY_NAV_ITEMS } from './navItems.js';
import { ThemeSwitcher, ThemeToggle } from './ThemeControls.jsx';
import styles from './AppHeader.module.css';

/**
 * Sticky top navigation. Transparent at the top of the page, frosted glass
 * once the page scrolls so content stays readable underneath.
 */
export function AppHeader({ navItems = PRIMARY_NAV_ITEMS }) {
  const { t } = useTranslation();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <div className={cx('container', styles.inner)}>
        <Link to="/" className={styles.brand} aria-label={t('nav.homeAria')}>
          <Logo size={34} />
        </Link>

        <nav className={styles.desktopNav} aria-label={t('nav.mainLabel')}>
          <ul role="list" className={styles.navList}>
            {navItems.map(({ to, labelKey, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => cx(styles.navLink, isActive && styles.active)}
                >
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <IconButton
            className={styles.menuButton}
            icon={Menu}
            label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title={t('nav.menu')}>
        <nav aria-label={t('nav.mainLabel')} className={styles.drawerNav}>
          <ul role="list" className={styles.drawerList}>
            {navItems.map(({ to, labelKey, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => cx(styles.drawerLink, isActive && styles.drawerActive)}
                >
                  <Icon size={20} aria-hidden="true" />
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.drawerSection}>
          <p className={styles.drawerHeading}>{t('theme.label')}</p>
          <ThemeSwitcher fullWidth />
        </div>
      </Drawer>
    </header>
  );
}
