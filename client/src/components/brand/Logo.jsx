import { useId } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Logo.module.css';

// Brand mark colors are fixed (they must match public/favicon.svg and
// public/assets/brand/*.svg), so they live here rather than in theme tokens.
const MARK_GRADIENT = ['#ff8c3a', '#e2560b'];
const MARK_FOREGROUND = '#ffffff';

/**
 * LisheChap mark: a bowl with a check rising from it, "food, confirmed".
 * Decorative by default; pass `title` when the mark stands alone as a link name.
 */
export function LogoMark({ size = 40, title, className }) {
  const gradientId = useId();
  return (
    <svg
      className={cx(styles.mark, className)}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={MARK_GRADIENT[0]} />
          <stop offset="1" stopColor={MARK_GRADIENT[1]} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
      <path
        d="M17.5 15l4.5 4.5 8.5-8.5"
        fill="none"
        stroke={MARK_FOREGROUND}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 23.5h26a13 13 0 0 1-26 0z" fill={MARK_FOREGROUND} />
      <path
        d="M15.5 27.5a9 9 0 0 0 17 0"
        fill="none"
        stroke={MARK_GRADIENT[1]}
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="18" y="36.5" width="12" height="3.5" rx="1.75" fill={MARK_FOREGROUND} />
    </svg>
  );
}

/**
 * variant: horizontal (mark + wordmark, default) | mark (compact, e.g. mobile)
 * size: height of the mark in pixels; the wordmark scales with it.
 */
export function Logo({ variant = 'horizontal', size = 36, className }) {
  if (variant === 'mark') return <LogoMark size={size} title="LisheChap" className={className} />;

  return (
    <span className={cx(styles.logo, className)} style={{ '--logo-size': `${size}px` }}>
      <LogoMark size={size} />
      <span className={styles.wordmark}>
        Lishe<span className={styles.accent}>Chap</span>
      </span>
    </span>
  );
}
