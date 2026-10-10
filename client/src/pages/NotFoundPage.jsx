import { Link } from 'react-router';
import { useTranslation } from '../lib/i18n/useTranslation.js';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="page page--not-found">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link className="button" to="/">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}
