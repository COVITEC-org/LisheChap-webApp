import { Database, RefreshCw, Server } from 'lucide-react';
import { useApiHealth } from '../hooks/useApiHealth.js';
import { useTranslation } from '../lib/i18n/useTranslation.js';
import { Badge } from './ui/Badge.jsx';
import { Button } from './ui/Button.jsx';
import { Card } from './ui/Card.jsx';
import styles from './SystemStatusCard.module.css';

const STATE_TONES = { up: 'success', down: 'danger', checking: 'neutral' };

function StatusRow({ icon: Icon, label, state }) {
  const { t } = useTranslation();
  return (
    <div className={styles.row}>
      <dt className={styles.label}>
        <Icon size={18} aria-hidden="true" />
        {label}
      </dt>
      <dd>
        <Badge tone={STATE_TONES[state]} dot pulse={state === 'up'}>
          {t(`systemStatus.${state}`)}
        </Badge>
      </dd>
    </div>
  );
}

export function SystemStatusCard() {
  const { t, intlLocale } = useTranslation();
  const { status, data, checkedAt, refresh } = useApiHealth();

  const isChecking = status === 'loading';
  const apiState = isChecking ? 'checking' : status === 'success' ? 'up' : 'down';
  const databaseState = isChecking ? 'checking' : data?.services?.database?.status === 'up' ? 'up' : 'down';

  return (
    <Card as="section" className={styles.card} aria-labelledby="system-status-title" aria-busy={isChecking}>
      <div className={styles.heading}>
        <h2 id="system-status-title" className={styles.title}>
          {t('systemStatus.title')}
        </h2>
        <p className={styles.subtitle}>{t('systemStatus.subtitle')}</p>
      </div>

      <dl className={styles.list}>
        <StatusRow icon={Server} label={t('systemStatus.api')} state={apiState} />
        <StatusRow icon={Database} label={t('systemStatus.database')} state={databaseState} />
      </dl>

      {status === 'error' && (
        <p className={styles.message} role="alert">
          {t('systemStatus.unreachable')}
        </p>
      )}

      <div className={styles.footer}>
        <span className={styles.time}>
          {checkedAt &&
            t('systemStatus.lastChecked', {
              time: checkedAt.toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            })}
        </span>
        <Button variant="outline" size="sm" iconStart={RefreshCw} onClick={refresh} loading={isChecking}>
          {t('systemStatus.checkAgain')}
        </Button>
      </div>
    </Card>
  );
}
