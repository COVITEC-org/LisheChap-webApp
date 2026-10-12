import { ArrowRight, Sparkles, Store } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { formatTSh } from '../../utils/format.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { SmartImage } from '../ui/SmartImage.jsx';
import styles from './FoodCard.module.css';

// Menu status set by the restaurant (FoodItem.status). This is NOT a live
// confirmation: only an availability request answered with KIPO confirms food.
const MENU_STATUS_TONES = {
  AVAILABLE: 'success',
  UNAVAILABLE: 'neutral',
};

/**
 * Dish card.
 *
 * food: { name, description, price, imageUrl, restaurantName?, status, isFeatured? }
 * href: optional link to the food detail page (whole card becomes clickable)
 * onSelect + actionLabel: optional primary action; rendered only when provided
 */
export function FoodCard({ food, href, onSelect, actionLabel, className }) {
  const { t } = useTranslation();
  const { name, description, price, imageUrl, restaurantName, status, isFeatured } = food;
  const isUnavailable = status === 'UNAVAILABLE';

  return (
    <article className={cx(styles.card, isUnavailable && styles.unavailable, className)} data-zoom-parent>
      <SmartImage src={imageUrl} alt="" ratio="4 / 3" zoom className={styles.media}>
        <div className={styles.mediaOverlay}>
          {isFeatured ? (
            <Badge variant="solid" tone="primary" icon={Sparkles} size="sm">
              {t('food.featured')}
            </Badge>
          ) : (
            <span />
          )}
          {MENU_STATUS_TONES[status] && (
            <Badge variant="glass" tone={MENU_STATUS_TONES[status]} size="sm" dot>
              {t(`food.menuStatus.${status}`)}
            </Badge>
          )}
        </div>
      </SmartImage>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.name}>
            {href ? (
              <Link to={href} className={styles.stretchedLink}>
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          {restaurantName && (
            <p className={styles.restaurant}>
              <Store size={14} aria-hidden="true" />
              <span>{restaurantName}</span>
            </p>
          )}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <p className={styles.price}>{formatTSh(price)}</p>

        {onSelect && (
          <Button
            className={styles.action}
            variant="secondary"
            size="sm"
            iconEnd={ArrowRight}
            onClick={onSelect}
            disabled={isUnavailable}
            fullWidth
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </article>
  );
}
