import { cx } from '../../lib/cx.js';
import styles from './IconButton.module.css';

const ICON_SIZES = { sm: 16, md: 20, lg: 22 };

/**
 * Icon-only button. `label` is required: it becomes the accessible name and the
 * tooltip, because an icon alone is not understandable to screen readers.
 *
 * variant: ghost | soft | solid | glass
 */
export function IconButton({
  as: Component = 'button',
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  badge,
  className,
  type,
  ref,
  ...rest
}) {
  return (
    <Component
      ref={ref}
      className={cx(styles.iconButton, styles[variant], styles[size], className)}
      type={Component === 'button' ? (type ?? 'button') : type}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon size={ICON_SIZES[size]} strokeWidth={2} aria-hidden="true" />
      {badge > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Component>
  );
}
