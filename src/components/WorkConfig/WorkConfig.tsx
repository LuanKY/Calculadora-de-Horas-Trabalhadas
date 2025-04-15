import { ChangeEvent } from 'react';
import { WorkConfig as WorkConfigType } from '../../types';
import styles from './WorkConfig.module.css';

interface WorkConfigProps {
  config: WorkConfigType;
  onConfigChange: (config: WorkConfigType) => void;
}

export function WorkConfig({ config, onConfigChange }: WorkConfigProps) {
  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    onConfigChange({
      ...config,
      hoursPerDay: Number(e.target.value)
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label}>
          Horas trabalhadas por dia:
          <input
            type="number"
            min="1"
            max="24"
            value={config.hoursPerDay}
            onChange={handleHoursChange}
            className={styles.input}
          />
        </label>
        <p className={styles.description}>
          Informe a quantidade de horas que você trabalha em um dia normal
        </p>
      </div>

      <div className={styles.field}>
        <p className={styles.description}>
          • Os dias úteis (segunda a sexta) são considerados dias de trabalho
          <br />
          • Use Ctrl + Clique no calendário para marcar feriados
          <br />
          • Finais de semana são automaticamente excluídos do cálculo
        </p>
      </div>
    </div>
  );
}