import { cx } from '../../lib/cx.js';
import styles from './Card.module.css';

/**
 * Surface container.
 *
 * variant:  default | elevated | outline | muted | glass
 *           (glass is for floating panels, promos and dashboard widgets only)
 * padding:  none | sm | md | lg
 * interactive: adds hover lift for clickable cards
 */
export function Card({
  as: Component = 'div',
  variant = 'default',
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}) {
  return (
    <Component
      className={cx(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        interactive && styles.interactive,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
