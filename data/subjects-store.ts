import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subject } from '@/data/types';

export const useSubjectsStore = create(
  persist<{
    subjects: Subject[];
    getSubjects: () => Subject[];
    setSubjects: (subjects: Subject[]) => void;
    addSubject: (subject: Subject) => void;
    editSubject: (id: string, subject: Subject) => void;
    updateSubjects: (subjects: Subject[]) => void;
    removeSubject: (id: string) => void;
    removeAll: () => void;
  }>(
    (set, get) => ({
      subjects: [],
      getSubjects: () =>
        get().subjects.map((subject) => ({
          ...subject,
          grades: subject.grades.map((grade) => ({
            ...grade,
            date: new Date(grade.date)
          })),
          absences: subject.absences.map((absence) => ({
            ...absence,
            date: new Date(absence.date)
          })),
          timeSlots: subject.timeSlots.map((slot) => ({
            ...slot,
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime)
          }))
        })),
      setSubjects: (subjects) => set({ subjects }),
      addSubject: (subject) =>
        set((state) => ({ subjects: [...state.subjects, subject] })),
      editSubject: (id, subject) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? subject : s))
        })),
      updateSubjects: (subjects) =>
        set((state) => {
          let newState = state;

          for (const subject of subjects) {
            const index = newState.subjects.findIndex(
              (s) => s.name === subject.name
            );
            if (index !== -1) {
              newState.subjects[index].grades = subject.grades;
              newState.subjects[index].absences = subject.absences;
            } else {
              newState.subjects.push(subject);
            }
          }
          return { subjects: newState.subjects };
        }),
      removeSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id)
        })),
      removeAll: () => set({ subjects: [] })
    }),
    {
      name: 'subjects',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
