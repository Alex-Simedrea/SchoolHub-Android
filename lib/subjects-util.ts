import { Absence, Grade, Subject, TimeSlot } from '@/data/types';
import uuid from 'react-native-uuid';

export function getOverallAverage(subjects: Subject[]): string {
  // Only consider non-hidden subjects
  const shownSubjects = subjects.filter((subject) => !subject.hidden);

  // Calculate average for each subject
  const subjectAverages = shownSubjects.map((subject) => {
    if (subject.grades.length === 0) return 10; // Default value if no grades
    return (
      subject.grades.reduce((sum, grade) => sum + grade.value, 0) /
      subject.grades.length
    );
  });

  // Sum up rounded averages
  const sum = subjectAverages.reduce(
    (total, avg) => total + Math.round(avg),
    0
  );

  // Calculate overall average
  const count = shownSubjects.length;
  const overallAverage = count === 0 ? 0 : sum / count;

  // Return formatted string with 2 decimal places
  return overallAverage.toFixed(2);
}

export function getTotalAbsences(subjects: Subject[]): number {
  return subjects.reduce((sum, subject) => sum + subject.absences.length, 0);
}

export function getThisMonthData(subjects: Subject[]) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const gradesThisMonth = subjects.flatMap((subject) =>
    subject.grades.filter((grade) => grade.date >= startOfMonth)
  ).length;

  const absencesThisMonth = subjects.flatMap((subject) =>
    subject.absences.filter((absence) => absence.date >= startOfMonth)
  ).length;

  return { gradesThisMonth, absencesThisMonth };
}

export function getRecentItems(subjects: Subject[], limit: number = 8) {
  return [
    ...subjects.flatMap((subject) =>
      subject.grades.map((grade) => ({
        type: 'grade' as const,
        subject,
        date: grade.date,
        value: grade.value
      }))
    ),
    ...subjects.flatMap((subject) =>
      subject.absences.map((absence) => ({
        type: 'absence' as const,
        subject,
        date: absence.date,
        excused: absence.excused
      }))
    )
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

function overallAverage(subjects: Subject[]): number {
  const shownSubjects = subjects.filter((subject) => !subject.hidden);

  const subjectAverages = shownSubjects.map((subject) => {
    if (subject.grades.length === 0) return 0; // Default value if no grades
    return (
      subject.grades.reduce((sum, grade) => sum + grade.value, 0) /
      subject.grades.length
    );
  });

  const sum = subjectAverages.reduce((total, avg) => total + avg, 0);

  const count = shownSubjects.filter(
    (subject) => subject.grades.length > 0
  ).length;
  return count === 0 ? 0 : sum / count;
}

export function getGradesTimeData(subjects: Subject[]) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const allGrades = subjects
    .filter((subject) => !subject.hidden)
    .flatMap((subject) =>
      subject.grades
        .filter((grade) => grade.date >= thirtyDaysAgo)
        .map((grade) => ({
          date: grade.date,
          grade: grade.value
        }))
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let previousAverage: number | null = null;
  let result: { date: number; value: number }[] = [];

  allGrades.forEach((currentGrade) => {
    const gradesUpToDate = subjects
      .filter((subject) => !subject.hidden)
      .map((subject) => {
        return {
          ...subject,
          grades: subject.grades.filter(
            (grade) => grade.date <= currentGrade.date
          )
        };
      });

    const currentAverage = overallAverage(gradesUpToDate);

    if (previousAverage === null || previousAverage !== currentAverage) {
      result.push({
        date: currentGrade.date.getTime(),
        value: currentAverage
      });
      previousAverage = currentAverage;
    }
  });

  if (result.length === 0) {
    return [
      { date: thirtyDaysAgo.getTime(), value: 0 },
      { date: new Date().getTime(), value: 0 }
    ];
  }

  return result;
}

export function getAbsencesTimeData(subjects: Subject[]) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const absencesByDate = subjects
    .flatMap((subject) => subject.absences)
    .filter((absence) => absence.date >= thirtyDaysAgo)
    .reduce(
      (acc, absence) => {
        const dateKey = absence.date.getTime();
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

  const timeData = Object.entries(absencesByDate)
    .map(([date, count]) => ({
      date: parseInt(date),
      value: count
    }))
    .sort((a, b) => a.date - b.date);

  if (timeData.length === 0) {
    return [
      { date: thirtyDaysAgo.getTime(), value: 0 },
      { date: new Date().getTime(), value: 0 }
    ];
  }

  return timeData;
}

export function getAverageForSubject(subject: Subject): number {
  if (subject.grades.length === 0) return 10;
  return (
    subject.grades.reduce((sum, grade) => sum + grade.value, 0) /
    subject.grades.length
  );
}

export function mergeSubjects(
  existingSubjects: Subject[],
  jsonData: any[]
): Subject[] {
  const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

  const subjectMap = new Map<string, Subject>(
    existingSubjects.map((subject) => [subject.name, subject])
  );

  dataArray.forEach((data) => {
    const absences: Absence[] =
      data.absences?.map((absence: any) => ({
        id: uuid.v4(),
        date: new Date(absence.date),
        excused: absence.excused
      })) || [];

    const grades: Grade[] =
      data.grades?.map((grade: any) => ({
        id: uuid.v4(),
        date: new Date(grade.date),
        value: grade.value
      })) || [];

    const timeSlots: TimeSlot[] =
      data.timeSlots?.map((slot: any) => ({
        id: uuid.v4(),
        weekday: slot.weekday,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime)
      })) || [];

    const newSubject: Subject = {
      id: uuid.v4(),
      name: data.name,
      displayName: data.displayName,
      hidden: data.hidden,
      materialIconName: data.materialIconName || '',
      absences,
      grades,
      timeSlots
    };

    if (subjectMap.has(data.name)) {
      const existingSubject = subjectMap.get(data.name)!;
      subjectMap.set(data.name, {
        ...existingSubject,
        ...newSubject,
        materialIconName:
          data.materialIconName || existingSubject.materialIconName
      });
    } else {
      subjectMap.set(data.name, newSubject);
    }
  });

  return Array.from(subjectMap.values());
}

export interface TimeSlotWithSubject extends TimeSlot {
  subjectDisplayName: string;
  subjectMaterialIconName: string;
}

export interface WeekdayTimeSlots {
  weekday: number;
  timeSlots: TimeSlotWithSubject[];
}

export function getTimeMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function groupTimeSlotsByWeekday(subjects: Subject[]): WeekdayTimeSlots[] {
  // First, create an array of all timeSlots with their subject information
  const allTimeSlots: TimeSlotWithSubject[] = subjects.flatMap(subject =>
    subject.timeSlots.map(timeSlot => ({
      ...timeSlot,
      subjectDisplayName: subject.displayName,
      subjectMaterialIconName: subject.materialIconName
    }))
  );

  // Group timeSlots by weekday
  const groupedByWeekday = allTimeSlots.reduce((acc, timeSlot) => {
    const weekdayGroup = acc.find(group => group.weekday === timeSlot.weekday);

    if (weekdayGroup) {
      weekdayGroup.timeSlots.push(timeSlot);
      // Sort timeSlots by time only
      weekdayGroup.timeSlots.sort((a, b) =>
        getTimeMinutes(a.startTime) - getTimeMinutes(b.startTime)
      );
    } else {
      acc.push({
        weekday: timeSlot.weekday,
        timeSlots: [timeSlot]
      });
    }

    return acc;
  }, [] as WeekdayTimeSlots[]);

  // Sort groups by weekday
  return groupedByWeekday.sort((a, b) => a.weekday - b.weekday);
}

export function getWeekdayName(weekday: number): string {
  switch (weekday) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return '';
  }
}