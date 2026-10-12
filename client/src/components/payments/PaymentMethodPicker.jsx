import { CircleCheck, Landmark } from 'lucide-react';
import { useId } from 'react';
import { PAYMENT_METHODS, PAYMENT_METHOD_TYPES } from '../../constants/paymentMethods.js';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { cx } from '../../lib/cx.js';
import styles from './PaymentMethodPicker.module.css';

function MethodLogo({ method }) {
  if (!method.logo) {
    return (
      <span className={cx(styles.logo, styles.logoText)} aria-hidden="true">
        <Landmark size={16} />
        {method.name}
      </span>
    );
  }
  return (
    <span className={cx(styles.logo, method.logoFit === 'cover' && styles.logoCover)} aria-hidden="true">
      <img src={method.logo} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

/**
 * Choice of payment method, built on native radio inputs (arrow-key navigation,
 * form-friendly). Selection only: starting a payment is the server's job.
 *
 * value / onChange: selected method code
 * methods: subset of PAYMENT_METHODS to offer (e.g. what the restaurant accepts)
 * unavailableCodes: methods shown but not selectable (e.g. provider not yet integrated)
 */
export function PaymentMethodPicker({
  label,
  value,
  onChange,
  methods = PAYMENT_METHODS,
  unavailableCodes = [],
  name,
}) {
  const { t } = useTranslation();
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.grid}>
        {methods.map((method) => {
          const selected = method.code === value;
          const unavailable = unavailableCodes.includes(method.code);
          return (
            <label
              key={method.code}
              className={cx(styles.option, selected && styles.selected, unavailable && styles.unavailable)}
            >
              <input
                className={styles.input}
                type="radio"
                name={groupName}
                value={method.code}
                checked={selected}
                disabled={unavailable}
                onChange={() => onChange(method.code)}
              />
              <MethodLogo method={method} />
              <span className={styles.text}>
                <span className={styles.name}>{method.name}</span>
                <span className={styles.type}>
                  {unavailable
                    ? t('payments.unavailable')
                    : method.type === PAYMENT_METHOD_TYPES.BANK
                      ? t('payments.types.BANK')
                      : t('payments.types.MOBILE_MONEY')}
                </span>
              </span>
              <CircleCheck className={styles.check} size={20} aria-hidden="true" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
