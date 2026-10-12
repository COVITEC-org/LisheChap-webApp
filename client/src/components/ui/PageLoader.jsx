import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { Spinner } from './Spinner.jsx';
import styles from './PageLoader.module.css';

/** Route-level loading state shown while a lazy page chunk downloads. */
export function PageLoader() {
  const { t } = useTranslation();
  return (
    <div className={styles.loader}>
      <Spinner size={28} label={t('common.loading')} />
    </div>
  );
}
