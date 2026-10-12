import { UtensilsCrossed } from 'lucide-react';
import { cx } from '../../lib/cx.js';
import { SmartImage } from '../ui/SmartImage.jsx';
import styles from './CategoryChip.module.css';

/**
 * Food category toggle. Uses a category photo when available, otherwise an icon.
 * `selected` is exposed with aria-pressed so assistive tech announces the filter state.
 */
export function CategoryChip({ label, icon: Icon = UtensilsCrossed, imageUrl, selected = false, onClick }) {
  return (
    <button
      type="button"
      className={cx(styles.chip, selected && styles.selected)}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.thumb} aria-hidden="true">
        {imageUrl ? (
          <SmartImage src={imageUrl} alt="" ratio="1 / 1" fallbackIcon={Icon} />
        ) : (
          <Icon size={26} strokeWidth={1.8} />
        )}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}

/** Horizontally scrollable row of chips on small screens, wrapping grid on large ones. */
export function CategoryRail({ label, children }) {
  return (
    <div className={styles.rail} role="group" aria-label={label}>
      {children}
    </div>
  );
}
