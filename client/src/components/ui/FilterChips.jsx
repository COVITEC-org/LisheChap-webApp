import { cx } from '../../lib/cx.js';
import styles from './FilterChips.module.css';

/**
 * Row of pill filters ("Zote", "Wazi sasa", "Ukadiriaji wa juu").
 * Single-select by default; each chip exposes its state with aria-pressed.
 * options: [{ value, label }]
 */
export function FilterChips({ label, options, value, onChange, className }) {
  return (
    <div className={cx(styles.row, className)} role="group" aria-label={label}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={cx(styles.chip, selected && styles.selected)}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
