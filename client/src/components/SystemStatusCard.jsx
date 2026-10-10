import { useApiHealth } from '../hooks/useApiHealth.js';
import { useTranslation } from '../lib/i18n/useTranslation.js';

function StatusRow({ label, state, t }) {
  const text = state === 'checking' ? t('systemStatus.checking') : t(`systemStatus.${state}`);
  return (
    <div className="status-row">
      <dt>{label}</dt>
      <dd className={`status-pill status-pill--${state}`}>{text}</dd>
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
    <section className="status-card" aria-labelledby="system-status-title" aria-busy={isChecking}>
      <h2 id="system-status-title">{t('systemStatus.title')}</h2>
      <dl className="status-list">
        <StatusRow label={t('systemStatus.api')} state={apiState} t={t} />
        <StatusRow label={t('systemStatus.database')} state={databaseState} t={t} />
      </dl>

      {status === 'error' && (
        <p className="status-card__message" role="alert">
          {t('systemStatus.unreachable')}
        </p>
      )}

      <div className="status-card__footer">
        {checkedAt && (
          <span className="status-card__time">
            {t('systemStatus.lastChecked', {
              time: checkedAt.toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            })}
          </span>
        )}
        <button type="button" className="button" onClick={refresh} disabled={isChecking}>
          {t('systemStatus.checkAgain')}
        </button>
      </div>
    </section>
  );
}
