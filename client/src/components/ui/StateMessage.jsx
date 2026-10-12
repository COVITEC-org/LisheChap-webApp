import { RefreshCw, SearchX, TriangleAlert } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { Button } from './Button.jsx';
import styles from './StateMessage.module.css';

function StateMessage({ tone, icon: Icon, title, titleAs: Title = 'p', description, action, compact, role, className }) {
  return (
    <div className={cx(styles.state, styles[tone], compact && styles.compact, className)} role={role}>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon size={compact ? 22 : 28} strokeWidth={1.8} />
      </span>
      <div className={styles.text}>
        <Title className={styles.title}>{title}</Title>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

/**
 * Shown when a request succeeded but returned nothing, e.g. no nearby restaurants.
 * `action` is optional and must be a real, working control.
 */
export function EmptyState({ icon = SearchX, title, titleAs, description, action, compact, className }) {
  return (
    <StateMessage
      tone="empty"
      icon={icon}
      title={title}
      titleAs={titleAs}
      description={description}
      action={action}
      compact={compact}
      className={className}
    />
  );
}

/** Shown when something failed. Provide `onRetry` only when retrying can help. */
export function ErrorState({ icon = TriangleAlert, title, titleAs, description, onRetry, retryLabel, compact, className }) {
  const { t } = useTranslation();

  return (
    <StateMessage
      tone="error"
      icon={icon}
      title={title ?? t('states.error.title')}
      titleAs={titleAs}
      description={description ?? t('states.error.description')}
      compact={compact}
      role="alert"
      className={className}
      action={
        onRetry && (
          <Button variant="outline" size="sm" iconStart={RefreshCw} onClick={onRetry}>
            {retryLabel ?? t('common.retry')}
          </Button>
        )
      }
    />
  );
}
