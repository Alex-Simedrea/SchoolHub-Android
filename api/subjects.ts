import api from '@/api/api';
import { Absence, Grade, Subject } from '@/data/types';
import { convertToDate } from '@/lib/utils';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import { useSubjectsStore } from '@/data/subjects-store';

const fetchSubjects = async () => {
  let res = await api.get(`/elev.php`).then((res: AxiosResponse<string>) => {
    console.log('fetched subjects');
    return res.data;
  });

  if (res.includes('table')) {
    return res;
  }

  const username = await SecureStore.getItemAsync('username');
  const password = await SecureStore.getItemAsync('password');

  if (!username || !password) {
    return res;
  }

  return api
    .post(
      `/login.php`,
      new URLSearchParams({
        txtUser: username,
        txtPwd: password
      }),
      {
        headers: {
          Accept: 'text/html'
        }
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

function parseSubjects(document: string): Subject[] {
  console.log('parsing subjects');
  const result: Subject[] = [];

  // First regex to get subject names
  const regex1 =
    /<th name=['"]n\d+['"] id=['"]n\d+['"].*align=['"]center['"][^>]*>([^<]*)/g;
  const matches1 = Array.from(document.matchAll(regex1));

  matches1.forEach((match) => {
    const name = match[1];
    result.push({
      id: uuid.v4(),
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      displayName: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), // Add default value as per interface
      hidden: false, // Add default value as per interface
      materialIconName: 'book', // Add default value as per interface
      grades: [],
      absences: [],
      timeSlots: []
    });
  });

  // Parse absences
  const regex2 =
    /<table class=['"]tbNoteAbs['"] border=['"]0['"] cellpadding=['"]0['"] cellspacing=['"]0['"]>([\s\S]*?)<\/table>/g;
  const matches2 = Array.from(document.matchAll(regex2));

  matches2.forEach((match, index) => {
    const regex3 =
      /<\s*td\s*class="ctdNoteddDate.*?"\s*align="left"\s*>.*?<\/td>/g;
    const matches3 = Array.from(match[1].matchAll(regex3));

    const currentAbsences: Absence[] = [];

    matches3.forEach((match3) => {
      let date: Date | undefined;
      let excused: boolean | undefined;

      const regex4 = /[\d.]+/;
      const match4 = match3[0].match(regex4);
      if (match4) {
        date = convertToDate(match4[0]);
      }

      const regex5 = /cAbsMot/;
      excused = regex5.test(match3[0]);

      if (date) {
        currentAbsences.push({
          id: uuid.v4(),
          date,
          excused: excused
        });
      }
    });

    if (result[index]) {
      result[index].absences = currentAbsences;
    }
  });

  // Parse grades
  const regex6 =
    /<table class=['"]tbNoteNote['"] border=['"]0['"] cellpadding=['"]0['"] cellspacing=['"]0['"]>([\s\S]*?)<\/table>/g;
  const matches6 = Array.from(document.matchAll(regex6));

  matches6.forEach((match, index) => {
    const regex7 =
      /<tr class=['"]cNoteNonEdit['"]>(?:(?!<td class=['"]ctdNoteAddNote['"]>&nbsp;<\/td>)[\s\S])*?<\/tr>/g;
    const matches7 = Array.from(match[1].matchAll(regex7));

    const currentGrades: Grade[] = [];

    matches7.forEach((match7) => {
      let date: Date | undefined;
      let grade: number | undefined;

      const regex8 =
        /<td class=['"]ctdNoteddDate['"] align=['"]left['"]>\s*(.*?)\s*<\/td>/;
      const match8 = match7[0].match(regex8);
      if (match8) {
        date = convertToDate(match8[1]);
      }

      const regex9 = /<td class=['"]ctdNoteAddNote['"]>\s*(.*?)\s*<\/td>/;
      const match9 = match7[0].match(regex9);
      if (match9) {
        grade = parseInt(match9[1]) || 0;
      }

      if (date && typeof grade !== 'undefined') {
        currentGrades.push({
          id: uuid.v4(),
          date,
          value: grade
        });
      }
    });

    if (result[index]) {
      result[index].grades = currentGrades;
    }
  });

  console.log(result);
  return result;
}

export const useGetSubjects = () => {
  const subjectsStore = useSubjectsStore();

  return useQuery('subjects', fetchSubjects, {
    select: (data) => parseSubjects(data),
    onSuccess: (data) => {
      subjectsStore.updateSubjects(data);
    }
  });
};
