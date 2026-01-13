import {useMemo, useState} from 'react';
import clsx from 'clsx';
import styles from './LoginInput.module.scss';

interface LoginInputProps {
	value: string;
	placeholder: string;
	leftIcon: string;
	rightIcon?: string;
	type?: 'text' | 'password';
	error?: boolean;
	onChange: (value: string) => void;
	onRightIconClick?: () => void;
}

const LoginInput = ({
	value,
	placeholder,
	leftIcon,
	rightIcon,
	type = 'text',
	error = false,
	onChange,
	onRightIconClick,
}: LoginInputProps) => {
	const [isFocused, setIsFocused] = useState(false);
	const isFilled = value.length > 0;
	const inputType = useMemo(() => type, [type]);

	return (
		<div
			className={clsx(
				styles.inputWrapper,
				isFocused && styles.isFocused,
				isFilled && styles.isFilled,
				error && styles.isError
			)}
		>
			<div className={styles.left}>
				<img alt="" className={styles.icon} src={leftIcon} />
			</div>
			<input
				className={styles.input}
				type={inputType}
				value={value}
				placeholder={placeholder}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onChange={(event) => onChange(event.target.value)}
			/>
			{rightIcon && (
				<button
					type="button"
					className={styles.right}
					onClick={onRightIconClick}
					aria-label="toggle"
				>
					<img alt="" className={styles.rightIcon} src={rightIcon} />
				</button>
			)}
		</div>
	);
};

export default LoginInput;
