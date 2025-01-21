import { Subject } from '@/data/types';

export function convertToDate(dateString: string): Date | undefined {
  const [day, month] = dateString.split('.').map(Number);
  if (isNaN(day) || isNaN(month)) return undefined;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const yearToUse =
    month >= 9 && currentMonth < 9 ? currentYear - 1 : currentYear;

  return new Date(yearToUse, month - 1, day);
}

export const EmptySubject: Subject = {
  id: '',
  name: '',
  displayName: '',
  hidden: false,
  materialIconName: '',
  absences: [],
  grades: [],
  timeSlots: []
};
