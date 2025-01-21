import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import {
  Appbar,
  Button,
  Divider,
  IconButton,
  List,
  Text,
  useTheme
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { useSubjectsStore } from '@/data/subjects-store';
import { EmptySubject } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';
import HighlightCard from '@/components/highlight-card';
import { getAverageForSubject, getWeekdayName } from '@/lib/subjects-util';

export default function Subject() {
  const { subjectID } = useLocalSearchParams();
  const subjectsStore = useSubjectsStore();
  const subject =
    subjectsStore.getSubjects().find((s) => s.id === subjectID) ?? EmptySubject;

  const theme = useTheme();

  return (
    <AnimatedHeaderWrapper
      title={subject.displayName}
      leftContent={<Appbar.BackAction onPress={() => router.back()} />}
      rightContent={
        <Appbar.Action
          icon='pencil'
          onPress={() => {
            router.push({
              pathname: '/subjects/edit-subject',
              params: { subjectID }
            });
          }}
        />
      }
      scrollViewProps={{
        contentContainerStyle: tw`px-4 pb-4`
      }}
    >
      <View style={tw`gap-2`}>
        <View style={tw`flex-row gap-2`}>
          <HighlightCard
            value={getAverageForSubject(subject).toFixed(2).toString()}
            label='Average'
          />
          <HighlightCard
            value={
              subject.grades.length.toString() +
              '/' +
              (subject.timeSlots.length + 3).toString()
            }
            label='Grades Count'
          />
        </View>
        <View style={tw`flex-row gap-2`}>
          <HighlightCard
            value={subject.absences.filter((a) => a.excused).length.toString()}
            label='Excused'
          />
          <HighlightCard
            value={subject.absences.filter((a) => !a.excused).length.toString()}
            label='Unexcused'
          />
        </View>
      </View>
      <List.Section>
        <List.Subheader>Grades</List.Subheader>
        {subject.grades.map((grade) => (
          <React.Fragment key={grade.id}>
            <List.Item
              title={grade.value.toString()}
              description={grade.date.toLocaleDateString()}
            />
            <Divider />
          </React.Fragment>
        ))}
      </List.Section>
      <List.Section>
        <List.Subheader>Absences</List.Subheader>
        {subject.absences.map((absence) => (
          <React.Fragment key={absence.id}>
            <List.Item
              title={absence.date.toLocaleDateString()}
              description={absence.excused ? 'Excused' : 'Unexcused'}
              descriptionStyle={tw.style(
                !absence.excused && `text-[${theme.colors.error}]`
              )}
              key={absence.id}
            />
            <Divider />
          </React.Fragment>
        ))}
      </List.Section>
      <List.Section>
        <List.Subheader>Time Slots</List.Subheader>
        {subject.timeSlots
          .sort((a, b) => a.weekday - b.weekday)
          .map((timeSlot) => (
            <React.Fragment key={timeSlot.id}>
              <List.Item
                title={getWeekdayName(timeSlot.weekday)}
                right={() => (
                  <View style={tw`flex-row items-center gap-2`}>
                    <View>
                      <Text>
                        {timeSlot.startTime.toLocaleTimeString('ro-RO', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </Text>
                      <Text>
                        {timeSlot.endTime.toLocaleTimeString('ro-RO', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </Text>
                    </View>
                    <IconButton
                      icon={'minus-circle-outline'}
                      iconColor={theme.colors.error}
                      onPress={() => {
                        subjectsStore.editSubject(subjectID as string, {
                          ...subject,
                          timeSlots: subject.timeSlots.filter(
                            (ts) => ts.id !== timeSlot.id
                          )
                        });
                      }}
                      style={tw`mr-0`}
                    />
                  </View>
                )}
              />
              <Divider />
            </React.Fragment>
          ))}
      </List.Section>
      <Button
        mode='contained-tonal'
        onPress={() => {
          router.push({
            pathname: '/subjects/add-time-slot',
            params: { subjectID }
          });
        }}
      >
        Add time slot
      </Button>
    </AnimatedHeaderWrapper>
  );
}
