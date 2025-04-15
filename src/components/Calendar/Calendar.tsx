import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  isWeekend,
  isWithinInterval,
  startOfMonth,
  subMonths
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import styles from './Calendar.module.css';

interface CalendarProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  holidays: Date[];
  onDateSelect: (date: Date) => void;
  onHolidayToggle: (date: Date) => void;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Calendar({
  selectedStartDate,
  selectedEndDate,
  holidays,
  onDateSelect,
  onHolidayToggle
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = getDay(monthStart); 
  const blanks = Array.from({ length: startDayOfWeek });

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return isWithinInterval(date, { start: selectedStartDate, end: selectedEndDate });
  };

  const isHoliday = (date: Date) => {
    return holidays.some(holiday => isSameDay(holiday, date));
  };

  const handleDateClick = (date: Date, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      onHolidayToggle(date);
    } else {
      onDateSelect(date);
    }
  };

  const formattedMonthYear = capitalizeFirstLetter(
    format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })
  );

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          className={styles.navigationButton}
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft size={24} />
        </button>
        <span className={styles.monthYear}>
          {formattedMonthYear}
        </span>
        <button
          className={styles.navigationButton}
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={styles.weekdays}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.days}>
        {blanks.map((_, index) => (
          <div key={`blank-${index}`} className={styles.day} />
        ))}

        {days.map(day => {
          const isSelected = (selectedStartDate && isSameDay(day, selectedStartDate)) ||
            (selectedEndDate && isSameDay(day, selectedEndDate));
          const inRange = isDateInRange(day);
          const dayHoliday = isHoliday(day);
          const weekend = isWeekend(day);
          const todayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`
                ${styles.day} 
                ${isSelected ? styles.selected : ''} 
                ${inRange ? styles.inRange : ''} 
                ${dayHoliday ? styles.holiday : ''}
                ${weekend ? styles.weekend : ''}
                ${todayDate ? styles.today : ''}
              `}
              onClick={(e) => handleDateClick(day, e)}
              title={`${format(day, "dd 'de' MMMM", { locale: ptBR })}${dayHoliday ? ' - Feriado' : ''}`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096', textAlign: 'center' }}>
        Ctrl + Clique para marcar feriados
      </div>
    </div>
  );
}
