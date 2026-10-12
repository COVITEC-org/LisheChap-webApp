import { X } from 'lucide-react';
import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehavior } from '../../hooks/useDialogBehavior.js';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import { IconButton } from './IconButton.jsx';
import styles from './Overlay.module.css';

/**
 * Centered dialog. On small screens it becomes a bottom sheet so actions stay
 * within thumb reach. size: sm | md | lg
 */
export function Modal({ open, onClose, title, description, children, footer, size = 'md', initialFocusRef }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useDialogBehavior({ open, onClose, containerRef: panelRef, initialFocusRef });

  if (!open) return null;

  return createPortal(
    <div className={cx(styles.root, styles.modalRoot)}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={cx(styles.panel, styles.modal, styles[size])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div className={styles.headings}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          <IconButton icon={X} label={t('common.close')} size="sm" onClick={onClose} />
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
