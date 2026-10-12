import { useId } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './SegmentedControl.module.css';

/**
 * Single choice between a few options, built on native radio inputs so it is
 * keyboard accessible (arrow keys) without custom key handling.
 * options: [{ value, label, icon? }]
 */
export function SegmentedControl({ label, options, value, onChange, name, fullWidth = false, className }) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <fieldset className={cx(styles.group, fullWidth && styles.fullWidth, className)}>
      <legend className="visually-hidden">{label}</legend>
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => (
        <label key={optionValue} className={styles.option}>
          <input
            type="radio"
            className={styles.input}
            name={groupName}
            value={optionValue}
            checked={value === optionValue}
            onChange={() => onChange(optionValue)}
          />
          <span className={styles.face}>
            {Icon && <Icon size={16} strokeWidth={2.2} aria-hidden="true" />}
            {optionLabel}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
