import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { cx } from '../../lib/cx.js';
import styles from './SectionHeader.module.css';

/** Section title with optional eyebrow, supporting text and a trailing action. */
export function SectionHeader({ id, eyebrow, title, subtitle, action, as: Heading = 'h2', className }) {
  return (
    <div className={cx(styles.header, className)}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Heading id={id} className={styles.title}>
          {title}
        </Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

/**
 * "Ona zote" style link placed in a SectionHeader action. Must point to a real
 * destination: `to` for an app route, or `href` for an in-page anchor.
 */
export function SeeAllLink({ to, href, children }) {
  const content = (
    <>
      {children}
      <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
    </>
  );
  return href ? (
    <a href={href} className={styles.seeAll}>
      {content}
    </a>
  ) : (
    <Link to={to} className={styles.seeAll}>
      {content}
    </Link>
  );
}
