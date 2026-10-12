import { ArrowRight, Plus, Sparkles, Store, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { formatRating, formatTSh } from '../../utils/format.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { IconButton } from '../ui/IconButton.jsx';
import { SmartImage } from '../ui/SmartImage.jsx';
import styles from './FoodCard.module.css';

// Menu status set by the restaurant (FoodItem.status). This is NOT a live
// confirmation: only an availability request answered with KIPO confirms food.
const MENU_STATUS_TONES = {
  AVAILABLE: 'success',
  UNAVAILABLE: 'neutral',
};

function FoodTitle({ name, href }) {
  return href ? (
    <Link to={href} className={styles.stretchedLink}>
      {name}
    </Link>
  ) : (
    name
  );
}

/**
 * Dish card.
 *
 * food: { name, description, price, imageUrl, restaurantName?, status, isFeatured?, rating? }
 * layout: 'card' (grid tile, default) | 'row' (compact list row, as in menus and popular dishes)
 * href: optional link to the food detail page (whole card becomes clickable)
 * onSelect + actionLabel: optional primary action; rendered only when provided.
 *   In the row layout it is the round "+" button and actionLabel is its accessible name.
 */
export function FoodCard({ food, layout = 'card', href, onSelect, actionLabel, className }) {
  const { t } = useTranslation();
  const { name, description, price, imageUrl, restaurantName, status, isFeatured, rating } = food;
  const isUnavailable = status === 'UNAVAILABLE';
  const statusBadge = MENU_STATUS_TONES[status] && (
    <Badge variant={layout === 'row' ? 'soft' : 'glass'} tone={MENU_STATUS_TONES[status]} size="sm" dot>
      {t(`food.menuStatus.${status}`)}
    </Badge>
  );

  if (layout === 'row') {
    return (
      <article className={cx(styles.row, isUnavailable && styles.unavailable, className)} data-zoom-parent>
        <SmartImage src={imageUrl} alt="" ratio="1 / 1" zoom className={styles.rowMedia} />
        <div className={styles.rowBody}>
          <h3 className={styles.rowName}>
            <FoodTitle name={name} href={href} />
          </h3>
          {description && <p className={styles.rowDescription}>{description}</p>}
          <div className={styles.rowMeta}>
            <span className={styles.price}>{formatTSh(price)}</span>
            {Number.isFinite(rating) && (
              <span className={styles.rowRating}>
                <Star size={13} strokeWidth={0} aria-hidden="true" />
                {formatRating(rating)}
              </span>
            )}
          </div>
          {statusBadge}
        </div>
        {onSelect && (
          <IconButton
            className={styles.rowAction}
            icon={Plus}
            variant="solid"
            size="sm"
            label={actionLabel}
            onClick={onSelect}
            disabled={isUnavailable}
          />
        )}
      </article>
    );
  }

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
          {statusBadge}
        </div>
      </SmartImage>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.name}>
            <FoodTitle name={name} href={href} />
          </h3>
          {restaurantName && (
            <p className={styles.restaurant}>
              <Store size={14} aria-hidden="true" />
              <span>{restaurantName}</span>
            </p>
          )}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <p className={cx(styles.price, styles.cardPrice)}>{formatTSh(price)}</p>

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
