import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from '../Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIco?: string;
  theme?: 'white' | 'dark' | 'blue';
  size?: 'small' | 'middle';
  state?: 'hover' | 'pressed';
}

const BtnBasic = ({
  className,
  theme = 'white',
  size = 'middle',
  leftIco,
  state,
  type = 'button',
  children,
  ...btnProps
}: ButtonProps) => {
  return (
    <button
      {...btnProps}
      type={type}
      style={btnProps.style}
      className={clsx(
        styles.basicButton,
        styles[theme],
        size && styles[`padding${size[0].toUpperCase()}${size.slice(1)}`],
        state && styles[`state${state[0].toUpperCase()}${state.slice(1)}`],
        className
      )}
    >
      {leftIco && <img alt="" className={styles.ico} src={leftIco} />}
      {children}
    </button>
  );
};

export default BtnBasic;
