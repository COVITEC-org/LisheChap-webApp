import { Star } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { formatRating } from '../../utils/format.js';
import styles from './Rating.module.css';

/** Average rating with review count. Shows a "new" label when there are no reviews yet. */
export function Rating({ value, count = 0, className }) {
  const { t } = useTranslation();

  if (!count || !Number.isFinite(value)) {
    return <span className={cx(styles.rating, styles.empty, className)}>{t('rating.noReviews')}</span>;
  }

  return (
    <span
      className={cx(styles.rating, className)}
      role="img"
      aria-label={t('rating.label', { value: formatRating(value), count })}
    >
      <Star className={styles.star} size={15} strokeWidth={0} aria-hidden="true" />
      <span className={styles.value}>{formatRating(value)}</span>
      <span className={styles.count}>({count})</span>
    </span>
  );
}
