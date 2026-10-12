import { UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './SmartImage.module.css';

/**
 * Image with a reserved aspect ratio (no layout shift), lazy loading, a fade-in
 * once loaded, and a branded placeholder when the source is missing or fails.
 *
 * Real restaurant and food photography replaces placeholders by simply passing
 * `src`; see client/public/assets/images/README.md for the folder structure.
 *
 * ratio:    CSS aspect-ratio, e.g. "4 / 3", "16 / 10", "1 / 1"
 * priority: load eagerly (above-the-fold hero images only)
 * zoom:     scale the image when an ancestor with [data-zoom-parent] is hovered
 */
export function SmartImage({
  src,
  alt,
  ratio = '4 / 3',
  priority = false,
  zoom = false,
  fallbackIcon: FallbackIcon = UtensilsCrossed,
  sizes,
  srcSet,
  className,
  children,
}) {
  // Track which source failed rather than resetting state when `src` changes.
  const [failedSrc, setFailedSrc] = useState(null);
  const [loadedSrc, setLoadedSrc] = useState(null);

  const showImage = Boolean(src) && failedSrc !== src;
  const isLoaded = loadedSrc === src;

  return (
    <div className={cx(styles.frame, zoom && styles.zoom, className)} style={{ aspectRatio: ratio }}>
      {!isLoaded && (
        <div className={styles.placeholder} aria-hidden="true">
          {!showImage && <FallbackIcon className={styles.placeholderIcon} strokeWidth={1.6} />}
        </div>
      )}
      {showImage && (
        <img
          className={cx(styles.image, isLoaded && styles.loaded)}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      )}
      {!showImage && alt && <span className="visually-hidden">{alt}</span>}
      {children}
    </div>
  );
}
