import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { Logo } from '../brand/Logo.jsx';
import styles from './AppFooter.module.css';

export function AppFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo size={30} />
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>
        <p className={styles.copyright}>{t('footer.copyright', { year })}</p>
      </div>
    </footer>
  );
}
