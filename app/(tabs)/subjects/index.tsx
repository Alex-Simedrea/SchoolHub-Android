import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import { Divider, List, Switch, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';
import React, { useState } from 'react';
import { useSubjectsStore } from '@/data/subjects-store';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAverageForSubject } from '@/lib/subjects-util';
import SubjectMenu from '@/components/subject-menu';
import { router } from 'expo-router';

export default function Index() {
  const theme = useTheme();
  const subjectsStore = useSubjectsStore();
  const [showHiddenSubjects, setShowHiddenSubjects] = useState(false);

  return (
    <AnimatedHeaderWrapper
      title='Subjects'
      scrollViewProps={{
        contentContainerStyle: tw`px-4`
      }}
    >
      <List.Section>
        {subjectsStore
          .getSubjects()
          .filter((subject) => !subject.hidden || showHiddenSubjects)
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((subject, index, arr) => (
            <React.Fragment key={subject.id}>
              <List.Item
                title={subject.displayName}
                titleStyle={tw.style(subject.hidden && 'opacity-50')}
                description={
                  <View style={tw`flex-row items-center gap-2`}>
                    <View style={tw`flex-row items-center`}>
                      <MaterialIcons
                        name='bar-chart'
                        size={16}
                        color={theme.colors.onSurfaceVariant + 'b0'}
                      />
                      <Text
                        style={tw`text-[${theme.colors.onSurfaceVariant + 'b0'}]`}
                      >
                        {Math.round(getAverageForSubject(subject))}
                      </Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                      <MaterialIcons
                        name='numbers'
                        size={16}
                        color={theme.colors.onSurfaceVariant + 'b0'}
                      />
                      <Text
                        style={tw`text-[${theme.colors.onSurfaceVariant + 'b0'}]`}
                      >
                        {subject.grades.length}
                      </Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                      <MaterialIcons
                        name='calendar-month'
                        size={16}
                        color={theme.colors.onSurfaceVariant + 'b0'}
                      />
                      <Text
                        style={tw`text-[${theme.colors.onSurfaceVariant + 'b0'}]`}
                      >
                        {subject.absences.length}
                      </Text>
                    </View>
                  </View>
                }
                left={() => <List.Icon icon={subject.materialIconName} />}
                style={tw.style(
                  `bg-[${theme.colors.elevation.level1}] px-5`,
                  index === 0 && `rounded-t-[${theme.roundness}]`,
                  index === arr.length - 1 && `rounded-b-[${theme.roundness}]`
                )}
                right={() => <SubjectMenu subject={subject} />}
                onPress={() => {
                  router.push(`/subjects/subject?subjectID=${subject.id}`);
                }}
              />
              {index !== arr.length - 1 && <Divider />}
            </React.Fragment>
          ))}
      </List.Section>
      <View style={tw`my-4 w-full flex-row items-center justify-between`}>
        <Text>Show hidden subjects</Text>
        <Switch
          value={showHiddenSubjects}
          onValueChange={setShowHiddenSubjects}
        />
      </View>
    </AnimatedHeaderWrapper>
  );
}
