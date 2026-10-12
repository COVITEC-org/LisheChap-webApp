import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let openDialogCount = 0;

function lockScroll() {
  openDialogCount += 1;
  if (openDialogCount > 1) return;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockScroll() {
  openDialogCount = Math.max(0, openDialogCount - 1);
  if (openDialogCount > 0) return;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * Accessible dialog behavior shared by Modal and Drawer:
 * moves focus inside on open, traps Tab, closes on Escape, locks page scroll,
 * and returns focus to the element that opened the dialog.
 */
export function useDialogBehavior({ open, onClose, containerRef, initialFocusRef }) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const container = containerRef.current;
    lockScroll();

    const focusTarget =
      initialFocusRef?.current ?? container?.querySelector(FOCUSABLE_SELECTOR) ?? container;
    focusTarget?.focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !container) return;

      const focusable = [...container.querySelectorAll(FOCUSABLE_SELECTOR)];
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, containerRef, initialFocusRef]);
}
