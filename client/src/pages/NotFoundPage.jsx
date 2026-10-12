import { House, MapPinOff } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/StateMessage.jsx';
import { useTranslation } from '../lib/i18n/useTranslation.js';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="container container--narrow page-section">
      <EmptyState
        icon={MapPinOff}
        titleAs="h1"
        title={t('notFound.title')}
        description={t('notFound.description')}
        action={
          <Button as={Link} to="/" iconStart={House}>
            {t('notFound.backHome')}
          </Button>
        }
      />
    </div>
  );
}
