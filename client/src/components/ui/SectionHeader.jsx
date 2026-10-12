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
