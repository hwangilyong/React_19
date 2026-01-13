import {forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode} from 'react';
import clsx from 'clsx';
import {icons} from '@/shared/assets/images';
import styles from './CheckBox.module.scss';

interface CheckBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: ReactNode;
    indeterminate?: boolean;
}

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
    ({label, className, disabled, indeterminate = false, ...inputProps}, ref) => {
        const innerRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (innerRef.current) {
                innerRef.current.indeterminate = indeterminate;
            }
        }, [indeterminate]);

        return (
            <label className={clsx(styles.checkbox, disabled && styles.disabled, className)}>
                <input
                    {...inputProps}
                    ref={(node) => {
                        innerRef.current = node;
                        if (typeof ref === 'function') {
                            ref(node);
                        } else if (ref) {
                            ref.current = node;
                        }
                    }}
                    type="checkbox"
                    disabled={disabled}
                    className={styles.input}
                />
                <span className={styles.box}>
                    <span className={styles.indeterminate} />
                    <img
                        alt=""
                        className={styles.checkIcon}
                        src={icons.input.checkboxActive}
                    />
                    <img
                        alt=""
                        className={styles.disabledIcon}
                        src={icons.input.checkboxDisabled}
                    />
                </span>
                {label && <span className={styles.label}>{label}</span>}
            </label>
        );
    },
);

export default CheckBox;
