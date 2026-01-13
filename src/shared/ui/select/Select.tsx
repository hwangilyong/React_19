import {
    Children,
    cloneElement,
    type HTMLAttributes,
    isValidElement,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    useEffectEvent,
    type ReactElement,
    type ReactNode,
    type MouseEvent as ReactMouseEvent,
} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import {icons} from '@/shared/assets/images';
import styles from './Select.module.scss';

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

interface SelectProps {
    options?: SelectOption[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    state?: 'hover' | 'focus' | 'active';
    children?: ReactNode;
    className?: string;
    triggerClassName?: string;
    menuClassName?: string;
    onChange?: (value: string, option: SelectOption) => void;
}

type SelectOptionChildProps = HTMLAttributes<HTMLLIElement> & {
    'data-value'?: string;
    'data-disabled'?: boolean | 'true' | 'false';
};

const isDisabledFlag = (value: SelectOptionChildProps['data-disabled']) => value === true || value === 'true';

const Select = ({
    options = [],
    value,
    defaultValue,
    placeholder = 'Select',
    disabled = false,
    state,
    children,
    className,
    triggerClassName,
    menuClassName,
    onChange,
}: SelectProps) => {
    /* useState: 드롭다운 열림 상태 관리 */
    const [open, setOpen] = useState(false);
    /* useState: 비제어형 값 저장 */
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    /* useState: 포탈 메뉴 위치/너비 계산값 저장 */
    const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number }>({
        top: 0,
        left: 0,
        width: 0,
    });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const selectedValue = value ?? internalValue;
    const selectedOption = useMemo(
        () => options.find((option) => option.value === selectedValue),
        [options, selectedValue],
    );
    const hasChildren = useMemo(() => Children.count(children) > 0, [children]);
    const selectedLabel = useMemo(() => {
        if (!hasChildren) return selectedOption?.label;
        /* ul/li 옵션을 사용할 때 children에서 라벨 추출 */
        let label: string | undefined;
        Children.forEach(children, (child) => {
            if (!isValidElement<SelectOptionChildProps>(child)) return;
            if (child.type !== 'li') return;
            if (child.props['data-value'] !== selectedValue) return;
            if (typeof child.props.children === 'string' || typeof child.props.children === 'number') {
                label = String(child.props.children);
            }
        });
        return label;
    }, [children, hasChildren, selectedOption?.label, selectedValue]);

    const updateMenuPosition = useEffectEvent(() => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;
        /* 기본은 아래 배치, 화면 밖이면 위로 뒤집기 */
        const menuHeight = menuRef.current?.offsetHeight ?? 0;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const offset = 4;
        let top = rect.bottom + window.scrollY + offset;
        if (menuHeight) {
            if (spaceBelow < menuHeight && spaceAbove >= menuHeight) {
                top = rect.top + window.scrollY - menuHeight - offset;
            } else if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                top = Math.max(window.scrollY + 8, rect.top + window.scrollY - menuHeight - offset);
            }
        }
        setMenuStyle({
            top,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    });

    /* useLayoutEffect: 열림 상태에서 위치 계산을 동기적으로 반영 */
    useLayoutEffect(() => {
        if (!open) return;
        /* 스크롤/리사이즈에도 메뉴 위치를 유지 */
        updateMenuPosition();

        const handlePositionUpdate = () => updateMenuPosition();
        window.addEventListener('resize', handlePositionUpdate);
        window.addEventListener('scroll', handlePositionUpdate, true);
        return () => {
            window.removeEventListener('resize', handlePositionUpdate);
            window.removeEventListener('scroll', handlePositionUpdate, true);
        };
    }, [open]);

    const handlePointerDown = useEffectEvent((event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (triggerRef.current?.contains(target)) return;
        if (menuRef.current?.contains(target)) return;
        setOpen(false);
    });

    /* useLayoutEffect: 열림 상태에서 바깥 클릭 감지 */
    useLayoutEffect(() => {
        if (!open) return;
        /* 트리거/메뉴 밖 클릭 시 닫기 */
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
        };
    }, [open]);

    const handleSelect = (option: SelectOption) => {
        /* options prop 기반 선택 처리 */
        if (option.disabled) return;
        if (value === undefined) {
            setInternalValue(option.value);
        }
        onChange?.(option.value, option);
        setOpen(false);
    };

    const handleSelectValue = (nextValue: string | undefined, label?: string, disabledFlag?: boolean) => {
        /* children의 data-value/data-disabled 기반 선택 처리 */
        if (!nextValue || disabledFlag) return;
        if (value === undefined) {
            setInternalValue(nextValue);
        }
        onChange?.(nextValue, {
            label: label ?? nextValue,
            value: nextValue,
            disabled: disabledFlag,
        });
        setOpen(false);
    };

    const resolvedTriggerClassName = triggerClassName ?? className;

    return (
        <div className={clsx(styles.selectRoot, className)}>
            <button
                type="button"
                className={clsx(
                    styles.trigger,
                    resolvedTriggerClassName,
                    state === 'hover' && styles.triggerHover,
                    state === 'focus' && styles.triggerFocus,
                    open && styles.triggerActive,
                    disabled && styles.triggerDisabled,
                    className
                )}
                onClick={() => !disabled && setOpen((prev) => !prev)}
                onKeyDown={(event) => {
                    if (disabled) return;
                    if (event.key === 'Escape') {
                        setOpen(false);
                    }
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setOpen((prev) => !prev);
                    }
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setOpen(true);
                    }
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                ref={triggerRef}
            >
                <span className={clsx(styles.value, !selectedLabel && styles.placeholder)}>
                    {selectedLabel ?? placeholder}
                </span>
                <img
                    alt=""
                    className={clsx(styles.icon, open && styles.iconOpen)}
                    src={(open || state === 'active') ? icons.input.chevronActive : icons.input.chevron}
                />
            </button>
            {open &&
                createPortal(
                    <div
                        className={clsx(styles.menu, menuClassName)}
                        ref={menuRef}
                        style={{
                            top: `${menuStyle.top}px`,
                            left: `${menuStyle.left}px`,
                            width: `${menuStyle.width}px`,
                        }}
                    >
                        {hasChildren ? (
                            <ul className={styles.optionList} role="listbox">
                                {Children.map(children, (child) => {
                                    if (!isValidElement<SelectOptionChildProps>(child)) return null;
                                    if (child.type !== 'li') return child;
                                    /* li를 옵션으로 매핑 */
                                    const itemValue = child.props['data-value'];
                                    const disabledFlag = isDisabledFlag(child.props['data-disabled']);
                                    const isSelected = itemValue === selectedValue;
                                    const label =
                                        typeof child.props.children === 'string' ||
                                        typeof child.props.children === 'number'
                                            ? String(child.props.children)
                                            : undefined;

                                    return cloneElement(child as ReactElement<SelectOptionChildProps>, {
                                        className: clsx(
                                            styles.option,
                                            child.props.className,
                                            isSelected && styles.optionSelected,
                                            disabledFlag && styles.optionDisabled,
                                        ),
                                        role: 'option',
                                        'aria-selected': isSelected,
                                        'data-selected': isSelected ? 'true' : undefined,
                                        onClick: (event: ReactMouseEvent<HTMLLIElement>) => {
                                            child.props.onClick?.(event);
                                            if (event.defaultPrevented) return;
                                            handleSelectValue(itemValue, label, disabledFlag);
                                        },
                                    });
                                })}
                            </ul>
                        ) : options.length === 0 ? (
                            <div className={styles.empty}>No options</div>
                        ) : (
                            <ul className={styles.optionList} role="listbox">
                                {options.map((option) => {
                                    const isSelected = option.value === selectedValue;
                                    return (
                                        <li
                                            key={option.value}
                                            className={clsx(
                                                styles.option,
                                                isSelected && styles.optionSelected,
                                                option.disabled && styles.optionDisabled,
                                            )}
                                            role="option"
                                            aria-selected={isSelected}
                                            data-value={option.value}
                                            data-disabled={option.disabled ? 'true' : undefined}
                                            onClick={() => handleSelect(option)}
                                        >
                                            {option.label}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    );
};

export default Select;
