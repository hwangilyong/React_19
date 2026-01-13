import clsx from "clsx";
import {forwardRef} from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    unit?: string;
    leftIco?: string;
    rightIco?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    unit,
    leftIco,
    rightIco,
    className,
    disabled,
    ...inputProps
}, ref) => {
    return (
        <div
            className={clsx(
                styles.inputWrapper,
                className,
            )}
        >
            {leftIco && <img alt="" className={styles.icon} src={leftIco} />}
            <input
                className={clsx(
                    styles.input,
                    leftIco && styles.hasLeft,
                    (rightIco || unit) && styles.hasRight,
                )}
                type="text"
                disabled={disabled}
                ref={ref}
                {...inputProps}
            />
            {(rightIco || unit) && (
                <span className={styles.rightSlot}>
                    {unit && <span className={styles.unit}>{unit}</span>}
                    {rightIco && <img alt="" className={styles.icon} src={rightIco} />}
                </span>
            )}
        </div>
    );
});

export default Input;
