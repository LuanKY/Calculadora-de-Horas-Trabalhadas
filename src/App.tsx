import { eachDayOfInterval, format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import styles from './App.module.css';
import { Calendar } from './components/Calendar/Calendar';
import { WorkConfig } from './components/WorkConfig/WorkConfig';
import { WorkConfig as WorkConfigType } from './types';

function App() {
  const [config, setConfig] = useState<WorkConfigType>({
    hoursPerDay: 8,
    startDate: null,
    endDate: null,
    holidays: []
  });

  const handleDateSelect = (date: Date) => {
    if (!config.startDate || (config.startDate && config.endDate)) {
      setConfig({
        ...config,
        startDate: date,
        endDate: null
      });
    } else {
      setConfig({
        ...config,
        endDate: date
      });
    }
  };

  const handleHolidayToggle = (date: Date) => {
    const isHoliday = config.holidays.some(
      holiday => format(holiday, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    if (isHoliday) {
      setConfig({
        ...config,
        holidays: config.holidays.filter(
          holiday => format(holiday, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd')
        )
      });
    } else {
      setConfig({
        ...config,
        holidays: [...config.holidays, date]
      });
    }
  };

  const calculateWorkHours = () => {
    if (!config.startDate || !config.endDate) return 0;

    const start = config.startDate < config.endDate ? config.startDate : config.endDate;
    const end = config.startDate > config.endDate ? config.startDate : config.endDate;

    const days = eachDayOfInterval({ start, end });

    const workingDays = days.filter(day => {
      const dayOfWeek = getDay(day);
      const isWorkDay = dayOfWeek > 0 && dayOfWeek < 6; 
      const isHoliday = config.holidays.some(
        holiday => format(holiday, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      return isWorkDay && !isHoliday;
    });

    return workingDays.length * config.hoursPerDay;
  };

  const totalHours = calculateWorkHours();

  const formatDateRange = () => {
    if (!config.startDate || !config.endDate) return '';

    const startDate = config.startDate < config.endDate ? config.startDate : config.endDate;
    const endDate = config.startDate > config.endDate ? config.startDate : config.endDate;

    const start = format(startDate, "dd 'de' MMMM", { locale: ptBR }).replace(/^./, str => str.toUpperCase());
    const end = format(endDate, "dd 'de' MMMM", { locale: ptBR }).replace(/^./, str => str.toUpperCase());

    return `${start} até ${end}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Calculadora de Horas Trabalhadas</h1>
      </header>

      <div className={styles.content}>
        <div>
          <h2>Selecione o Período</h2>
          <Calendar
            selectedStartDate={config.startDate}
            selectedEndDate={config.endDate}
            holidays={config.holidays}
            onDateSelect={handleDateSelect}
            onHolidayToggle={handleHolidayToggle}
          />
        </div>

        <WorkConfig
          config={config}
          onConfigChange={setConfig}
        />

        {config.startDate && config.endDate && (
          <div className={styles.totalHours}>
            Total de Horas Trabalhadas
            <span>
              {totalHours} horas
              <div style={{ fontSize: '1rem', marginTop: '0.5rem', color: '#4a5568' }}>
                {formatDateRange()}
              </div>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;