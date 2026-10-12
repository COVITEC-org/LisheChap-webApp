import { House, RefreshCw, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '../components/brand/Logo.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useTranslation } from '../lib/i18n/useTranslation.js';
import styles from './RouteErrorPage.module.css';

/**
 * Router error boundary. Shown when a page throws while rendering or its code
 * chunk fails to load (for example after a deploy or a dropped connection).
 * Error details are never shown to the customer.
 */
export default function RouteErrorPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Logo size={36} />
      <div className={styles.card} role="alert">
        <span className={styles.icon} aria-hidden="true">
          <TriangleAlert size={30} strokeWidth={1.8} />
        </span>
        <h1 className={styles.title}>{t('states.routeError.title')}</h1>
        <p className={styles.description}>{t('states.routeError.description')}</p>
        <div className={styles.actions}>
          <Button iconStart={RefreshCw} onClick={() => window.location.reload()}>
            {t('states.routeError.reload')}
          </Button>
          <Button as={Link} to="/" variant="outline" iconStart={House} reloadDocument>
            {t('notFound.backHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
