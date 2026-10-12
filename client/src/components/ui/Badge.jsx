import { cx } from '../../lib/cx.js';
import styles from './Badge.module.css';

/**
 * Compact status label.
 *
 * tone:    neutral | primary | success | warning | danger | info
 * variant: soft | solid | glass (glass for badges placed over images)
 * dot:     leading status dot; `pulse` animates it to signal something live
 */
export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon: Icon,
  dot = false,
  pulse = false,
  className,
  children,
  ...rest
}) {
  return (
    <span className={cx(styles.badge, styles[tone], styles[variant], styles[size], className)} {...rest}>
      {dot && <span className={cx(styles.dot, pulse && styles.pulse)} aria-hidden="true" />}
      {Icon && !dot && <Icon size={size === 'sm' ? 12 : 14} strokeWidth={2.4} aria-hidden="true" />}
      {children}
    </span>
  );
}
