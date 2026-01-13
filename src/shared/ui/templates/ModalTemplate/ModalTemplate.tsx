import {useEffect, useRef} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './ModalTemplate.module.scss';

interface ModalTemplateProps {
	open?: boolean;
	title?: string;
	onClose?: () => void;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	footerClassName?: string;
	zIndex?: number;
	isTop?: boolean;
	closeOnEscape?: boolean;
}

const ModalTemplate = ({
	open,
	title,
	onClose,
	children,
	footer,
	className,
	headerClassName,
	contentClassName,
	footerClassName,
	zIndex,
	isTop = true,
	closeOnEscape = true,
}: ModalTemplateProps) => {
	if (open === false) return null;

	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isTop || !wrapperRef.current) return;
		const focusableSelector =
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
		const focusable = wrapperRef.current.querySelectorAll<HTMLElement>(
			focusableSelector
		);
		if (focusable.length > 0) {
			focusable[0].focus();
		} else {
			wrapperRef.current.focus();
		}
	}, [isTop]);

	useEffect(() => {
		if (!isTop) return;
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [isTop]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!isTop) return;
		if (closeOnEscape && event.key === 'Escape') {
			onClose?.();
			return;
		}
		if (event.key !== 'Tab' || !wrapperRef.current) return;

		const focusableSelector =
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
		const focusable = Array.from(
			wrapperRef.current.querySelectorAll<HTMLElement>(focusableSelector)
		).filter((el) => !el.hasAttribute('disabled'));
		if (focusable.length === 0) {
			event.preventDefault();
			wrapperRef.current.focus();
			return;
		}
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement as HTMLElement | null;

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	};

	return (
		<div
			className={styles.modalOverlay}
			role="dialog"
			aria-modal="true"
			aria-hidden={!isTop}
			style={{
				zIndex,
				pointerEvents: isTop ? 'auto' : 'none',
			}}
		>
			<div
				ref={wrapperRef}
				className={clsx(styles.modalWrapper, className)}
				onKeyDown={handleKeyDown}
				tabIndex={-1}
			>
				<div className={clsx(styles.modalHeader, headerClassName)}>
					{title && <span className={styles.modalTitle}>{title}</span>}
					{onClose && (
						<button
							type="button"
							className={styles.modalCloseButton}
							onClick={onClose}
							aria-label="닫기"
						>
							<span className={styles.modalCloseIcon} />
						</button>
					)}
				</div>
				<div className={clsx(styles.modalContent, contentClassName)}>
					{children}
				</div>
				{footer && (
					<>
						<div className={styles.modalFooterDivider} />
						<div className={clsx(styles.modalFooter, footerClassName)}>
							{footer}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ModalTemplate;
