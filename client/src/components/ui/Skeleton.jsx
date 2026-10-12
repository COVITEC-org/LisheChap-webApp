import { cx } from '../../lib/cx.js';
import styles from './Skeleton.module.css';

/**
 * Placeholder shape shown while content loads. Always decorative: wrap a group
 * of skeletons in an element with aria-busy="true" and a visually hidden label.
 */
export function Skeleton({ width = '100%', height = '1rem', radius = 'var(--radius-sm)', className, style }) {
  return (
    <span
      className={cx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <span className={cx(styles.text, className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} height="0.75rem" width={index === lines - 1 && lines > 1 ? '62%' : '100%'} />
      ))}
    </span>
  );
}
