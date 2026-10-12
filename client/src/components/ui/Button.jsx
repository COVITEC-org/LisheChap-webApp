import { cx } from '../../lib/cx.js';
import styles from './Button.module.css';
import { Spinner } from './Spinner.jsx';

const ICON_SIZES = { sm: 16, md: 18, lg: 20 };

/**
 * Primary action component.
 *
 * variant: primary | secondary | outline | ghost | danger | success
 * size:    sm | md | lg
 * as:      render as another element, e.g. as={Link} to="/" for navigation
 *
 * While `loading`, the button is disabled and announces busy state, keeping its
 * width stable so layouts do not jump.
 */
export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  iconStart: IconStart,
  iconEnd: IconEnd,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type,
  ref,
  ...rest
}) {
  const isNativeButton = Component === 'button';
  const iconSize = ICON_SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      type={isNativeButton ? (type ?? 'button') : type}
      disabled={isNativeButton ? isDisabled : undefined}
      aria-disabled={!isNativeButton && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={iconSize - 2} />
      ) : (
        IconStart && <IconStart size={iconSize} strokeWidth={2.2} aria-hidden="true" />
      )}
      {children && <span className={styles.label}>{children}</span>}
      {IconEnd && !loading && <IconEnd size={iconSize} strokeWidth={2.2} aria-hidden="true" />}
    </Component>
  );
}
