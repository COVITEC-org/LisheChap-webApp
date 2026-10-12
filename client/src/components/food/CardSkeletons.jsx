import { Skeleton, SkeletonText } from '../ui/Skeleton.jsx';
import styles from './CardSkeletons.module.css';

/** Loading placeholder matching RestaurantCard's layout, to avoid layout shift. */
export function RestaurantCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton height="auto" radius="0" style={{ aspectRatio: '16 / 10' }} />
      <div className={styles.body}>
        <div className={styles.row}>
          <Skeleton width="55%" height="1.1rem" />
          <Skeleton width="3.5rem" height="0.9rem" />
        </div>
        <Skeleton width="40%" height="0.8rem" />
        <Skeleton height="2.75rem" radius="var(--radius-md)" />
        <div className={styles.row}>
          <Skeleton width="45%" height="0.8rem" />
          <Skeleton width="30%" height="0.8rem" />
        </div>
        <Skeleton width="10rem" height="1.6rem" radius="var(--radius-full)" />
      </div>
    </div>
  );
}

/** Loading placeholder matching FoodCard's layout. */
export function FoodCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton height="auto" radius="0" style={{ aspectRatio: '4 / 3' }} />
      <div className={styles.body}>
        <Skeleton width="70%" height="1rem" />
        <SkeletonText lines={2} />
        <div className={styles.row}>
          <Skeleton width="5rem" height="1.1rem" />
          <Skeleton width="4.5rem" height="1.3rem" radius="var(--radius-full)" />
        </div>
      </div>
    </div>
  );
}
