import clsx from 'clsx';
import {forwardRef, useMemo, useState} from 'react';
import {DatePicker as ReactDatePicker} from 'react-datepicker';
import {enUS} from 'date-fns/locale';
import Input from '@/shared/ui/inputs/Input';
import {icons} from '@/shared/assets/images';
import styles from './DatePicker.module.scss';

const eventDays = new Set([1, 2, 5, 6]);

const formatMonthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const DateInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>((props, ref) => {
    return <Input {...props} ref={ref} rightIco={icons.input.calendarActive} placeholder="YYYY-MM-DD" />;
});

const DatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 9, 14));
    const monthForEvents = useMemo(() => selectedDate ?? new Date(2024, 9, 14), [selectedDate]);

    return (
        <div className={styles.datePicker}>
            <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                customInput={<DateInput className={styles.input} />}
                locale={enUS}
                dateFormat="yyyy-MM-dd"
                formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 1).toUpperCase()}
                renderCustomHeader={({date, decreaseMonth, increaseMonth}) => (
                    <div className={styles.calendarHeader}>
                        <button type="button" className={styles.navButton} aria-label="이전 달" onClick={decreaseMonth}>
                            <img
                                alt=""
                                className={clsx(styles.navIcon, styles.navIconPrev)}
                                src={icons.input.dateNavPrev}
                            />
                        </button>
                        <span className={styles.monthLabel}>{formatMonthLabel(date)}</span>
                        <button type="button" className={styles.navButton} aria-label="다음 달" onClick={increaseMonth}>
                            <img
                                alt=""
                                className={styles.navIcon}
                                src={icons.input.dateNavNext}
                            />
                        </button>
                    </div>
                )}
                renderDayContents={(day, date) => {
                    const isEvent =
                        date?.getMonth() === monthForEvents.getMonth() &&
                        date?.getFullYear() === monthForEvents.getFullYear() &&
                        eventDays.has(day);
                    return (
                        <span className={styles.dayContent}>
                            {day}
                            {isEvent && <span className={styles.eventDot} />}
                        </span>
                    );
                }}
                dayClassName={(date) => {
                    const isEvent =
                        date.getMonth() === monthForEvents.getMonth() &&
                        date.getFullYear() === monthForEvents.getFullYear() &&
                        eventDays.has(date.getDate());
                    return clsx(isEvent && styles.eventDay);
                }}
            />
        </div>
    );
};

export default DatePicker;
