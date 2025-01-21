export interface Absence {
  id: string;
  date: Date;
  excused: boolean;
}

export interface Grade {
  id: string;
  date: Date;
  value: number;
}

export interface Subject {
  id: string;
  name: string;
  displayName: string;
  hidden: boolean;
  materialIconName: string;
  absences: Absence[];
  grades: Grade[];
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  weekday: number;
  startTime: Date;
  endTime: Date;
}
