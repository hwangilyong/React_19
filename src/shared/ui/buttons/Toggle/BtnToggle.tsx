import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './BtnToggle.module.scss';

interface BtnToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const BtnToggle = forwardRef<HTMLInputElement, BtnToggleProps>(
  ({ className, disabled, ...inputProps }, ref) => {
    return (
      <label className={clsx(styles.toggle, disabled && styles.disabled, className)}>
        <input
          {...inputProps}
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={styles.input}
        />
        <span aria-hidden="true" className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </label>
    );
  }
);

BtnToggle.displayName = 'BtnToggle';

export default BtnToggle;
