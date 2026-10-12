import { Bike, Clock, Heart, MapPin, ShieldCheck, Store } from 'lucide-react';
import { useId } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { formatDistance, formatTSh } from '../../utils/format.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { IconButton } from '../ui/IconButton.jsx';
import { Rating } from '../ui/Rating.jsx';
import { SmartImage } from '../ui/SmartImage.jsx';
import { AvailabilityBadge } from './AvailabilityBadge.jsx';
import styles from './RestaurantCard.module.css';

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/**
 * Restaurant result card used in discovery and alternatives.
 *
 * restaurant: {
 *   name, imageUrl, logoUrl?, rating, reviewCount, distanceKm, locationLabel,
 *   cuisines?: string[], prepTimeMinutes: [min, max], isOpen, closesAt?: 'HH:mm',
 *   isChefActive, hasDelivery
 * }
 * food: optional { name, price } for the dish the customer searched for
 * availabilityStatus: optional live confirmation status for this restaurant
 * href: optional link to the restaurant page (whole card becomes clickable)
 * onVerify: optional handler; the verify button renders only when provided
 * onToggleFavorite + isFavorite: optional; the heart renders only when provided
 */
export function RestaurantCard({
  restaurant,
  food,
  availabilityStatus,
  href,
  onVerify,
  onToggleFavorite,
  isFavorite = false,
  className,
}) {
  const { t } = useTranslation();
  const hintId = useId();
  const {
    name,
    imageUrl,
    logoUrl,
    rating,
    reviewCount,
    distanceKm,
    locationLabel,
    cuisines,
    prepTimeMinutes,
    isOpen,
    closesAt,
    isChefActive,
    hasDelivery,
  } = restaurant;

  const canRespond = isOpen && isChefActive;

  return (
    <article className={cx(styles.card, href && styles.clickable, className)} data-zoom-parent>
      <SmartImage src={imageUrl} alt="" ratio="16 / 10" fallbackIcon={Store} zoom className={styles.media}>
        <div className={styles.mediaOverlay}>
          {Number.isFinite(distanceKm) ? (
            <Badge variant="glass" icon={MapPin}>
              {formatDistance(distanceKm)}
            </Badge>
          ) : (
            <span />
          )}
          {onToggleFavorite && (
            <IconButton
              className={cx(styles.favorite, isFavorite && styles.favoriteActive)}
              icon={Heart}
              variant="glass"
              size="sm"
              label={isFavorite ? t('restaurant.removeFavorite') : t('restaurant.addFavorite')}
              aria-pressed={isFavorite}
              onClick={onToggleFavorite}
            />
          )}
        </div>
      </SmartImage>

      <div className={styles.body}>
        <div className={styles.identity}>
          <span className={styles.logo} aria-hidden="true">
            {logoUrl ? <img src={logoUrl} alt="" loading="lazy" /> : initialsOf(name)}
          </span>
          <div className={styles.identityText}>
            <h3 className={styles.name}>
              {href ? (
                <Link to={href} className={styles.stretchedLink}>
                  {name}
                </Link>
              ) : (
                name
              )}
            </h3>
          </div>
        </div>

        <div className={styles.metaRow}>
          <Rating value={rating} count={reviewCount} />
          {prepTimeMinutes && (
            <span className={styles.prep}>
              <Clock size={13} aria-hidden="true" />
              {t('restaurant.prepTime', { min: prepTimeMinutes[0], max: prepTimeMinutes[1] })}
            </span>
          )}
        </div>

        {cuisines?.length > 0 && (
          <ul className={styles.cuisines} role="list" aria-label={t('restaurant.cuisines')}>
            {cuisines.map((cuisine) => (
              <li key={cuisine}>{cuisine}</li>
            ))}
          </ul>
        )}

        <p className={cx(styles.openState, isOpen ? styles.isOpen : styles.isClosed)}>
          <span className={styles.openDot} aria-hidden="true" />
          {isOpen ? t('restaurant.open') : t('restaurant.closed')}
          {isOpen && closesAt && <span className={styles.closes}>{t('restaurant.closesAt', { time: closesAt })}</span>}
        </p>

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

        <div className={styles.status}>
          <Badge tone={isChefActive ? 'success' : 'neutral'} dot pulse={isChefActive}>
            {isChefActive ? t('restaurant.chefActive') : t('restaurant.chefInactive')}
          </Badge>
          <Badge tone="neutral" icon={hasDelivery ? Bike : Store}>
            {hasDelivery ? t('restaurant.deliveryAvailable') : t('restaurant.pickupOnly')}
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
