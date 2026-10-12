import { Bike, Clock, MapPin, ShieldCheck, Store } from 'lucide-react';
import { useId } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { formatDistance, formatTSh } from '../../utils/format.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { Rating } from '../ui/Rating.jsx';
import { SmartImage } from '../ui/SmartImage.jsx';
import { AvailabilityBadge } from './AvailabilityBadge.jsx';
import styles from './RestaurantCard.module.css';

/**
 * Restaurant result card used in discovery and alternatives.
 *
 * restaurant: {
 *   name, imageUrl, rating, reviewCount, distanceKm, locationLabel,
 *   prepTimeMinutes: [min, max], isOpen, isChefActive, hasDelivery
 * }
 * food: optional { name, price } for the dish the customer searched for
 * availabilityStatus: optional live confirmation status for this restaurant
 * href: optional link to the restaurant page (whole card becomes clickable)
 * onVerify: optional handler; the verify button renders only when provided
 */
export function RestaurantCard({ restaurant, food, availabilityStatus, href, onVerify, className }) {
  const { t } = useTranslation();
  const hintId = useId();
  const {
    name,
    imageUrl,
    rating,
    reviewCount,
    distanceKm,
    locationLabel,
    prepTimeMinutes,
    isOpen,
    isChefActive,
    hasDelivery,
  } = restaurant;

  const canRespond = isOpen && isChefActive;
  const titleContent = href ? (
    <Link to={href} className={styles.stretchedLink}>
      {name}
    </Link>
  ) : (
    name
  );

  return (
    <article className={cx(styles.card, href && styles.clickable, className)} data-zoom-parent>
      <SmartImage src={imageUrl} alt="" ratio="16 / 10" fallbackIcon={Store} zoom className={styles.media}>
        <div className={styles.mediaOverlay}>
          <Badge variant="glass" tone={isOpen ? 'success' : 'neutral'} dot>
            {isOpen ? t('restaurant.open') : t('restaurant.closed')}
          </Badge>
          {Number.isFinite(distanceKm) && (
            <Badge variant="glass" icon={MapPin}>
              {formatDistance(distanceKm)}
            </Badge>
          )}
        </div>
      </SmartImage>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.name}>{titleContent}</h3>
          <Rating value={rating} count={reviewCount} />
        </div>

        {locationLabel && (
          <p className={styles.location}>
            <MapPin size={14} aria-hidden="true" />
            <span>{locationLabel}</span>
          </p>
        )}

        {food && (
          <div className={styles.food}>
            <span className={styles.foodName}>{food.name}</span>
            <span className={styles.price}>{formatTSh(food.price)}</span>
          </div>
        )}

        <ul className={styles.meta} role="list">
          {prepTimeMinutes && (
            <li>
              <Clock size={15} aria-hidden="true" />
              {t('restaurant.prepTime', { min: prepTimeMinutes[0], max: prepTimeMinutes[1] })}
            </li>
          )}
          <li>
            {hasDelivery ? <Bike size={15} aria-hidden="true" /> : <Store size={15} aria-hidden="true" />}
            {hasDelivery ? t('restaurant.deliveryAvailable') : t('restaurant.pickupOnly')}
          </li>
        </ul>

        <div className={styles.status}>
          <Badge tone={isChefActive ? 'success' : 'neutral'} dot pulse={isChefActive}>
            {isChefActive ? t('restaurant.chefActive') : t('restaurant.chefInactive')}
          </Badge>
          <AvailabilityBadge status={availabilityStatus} />
        </div>

        {onVerify && (
          <div className={styles.actions}>
            <Button
              fullWidth
              iconStart={ShieldCheck}
              onClick={onVerify}
              disabled={!canRespond}
              aria-describedby={canRespond ? undefined : hintId}
            >
              {t('restaurant.verifyFood')}
            </Button>
            {!canRespond && (
              <p id={hintId} className={styles.actionHint}>
                {t('restaurant.cannotVerify')}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
