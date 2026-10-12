import { cx } from '../../lib/cx.js';
import styles from './Spinner.module.css';

/**
 * Indeterminate progress indicator. Pass `label` when the spinner is the only
 * signal of loading so screen readers announce it; omit it when decorative.
 */
export function Spinner({ size = 20, label, className }) {
  return (
    <span
      className={cx(styles.spinner, className)}
      style={{ '--spinner-size': `${size}px` }}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <span className="visually-hidden">{label}</span>}
    </span>
  );
}
