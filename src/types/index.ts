export interface WorkConfig {
  hoursPerDay: number;
  startDate: Date | null;
  endDate: Date | null;
  holidays: Date[];
}