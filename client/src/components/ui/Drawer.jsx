import { X } from 'lucide-react';
import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehavior } from '../../hooks/useDialogBehavior.js';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { IconButton } from './IconButton.jsx';
import styles from './Overlay.module.css';

/** Side panel for navigation menus, filters and details. side: right | left | bottom */
export function Drawer({ open, onClose, title, children, footer, side = 'right', initialFocusRef }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  const titleId = useId();

  useDialogBehavior({ open, onClose, containerRef: panelRef, initialFocusRef });

  if (!open) return null;

  return createPortal(
    <div className={cx(styles.root, styles.drawerRoot, styles[`side-${side}`])}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={cx(styles.panel, styles.drawer)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon={X} label={t('common.close')} size="sm" onClick={onClose} />
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
