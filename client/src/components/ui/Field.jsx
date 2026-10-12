import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Field.module.css';

/**
 * Shared label, hint and error wiring for form controls.
 * The control receives the id, aria-invalid and aria-describedby it needs.
 */
function FieldShell({ id, label, hint, error, required, hideLabel, className, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.field, error && styles.hasError, className)}>
      {label && (
        <label htmlFor={id} className={cx(styles.label, hideLabel && 'visually-hidden')}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children({ describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  hideLabel,
  iconStart: IconStart,
  size = 'md',
  className,
  required,
  ref,
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={className}
    >
      {({ describedBy, invalid }) => (
        <div className={cx(styles.control, styles[size], IconStart && styles.withIcon)}>
          {IconStart && <IconStart className={styles.icon} size={18} strokeWidth={2} aria-hidden="true" />}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            required={required}
            {...inputProps}
          />
        </div>
      )}
    </FieldShell>
  );
}

export function TextAreaField({ id, label, hint, error, hideLabel, className, required, rows = 4, ref, ...props }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={className}
    >
      {({ describedBy, invalid }) => (
        <div className={cx(styles.control, styles.multiline)}>
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            className={cx(styles.input, styles.textarea)}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            required={required}
            {...props}
          />
        </div>
      )}
    </FieldShell>
  );
}

/** options: [{ value, label, disabled? }] */
export function SelectField({
  id,
  label,
  hint,
  error,
  hideLabel,
  className,
  required,
  options = [],
  placeholder,
  size = 'md',
  ref,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={className}
    >
      {({ describedBy, invalid }) => (
        <div className={cx(styles.control, styles[size], styles.selectControl)}>
          <select
            ref={ref}
            id={inputId}
            className={cx(styles.input, styles.select)}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.chevron} size={18} aria-hidden="true" />
        </div>
      )}
    </FieldShell>
  );
}
