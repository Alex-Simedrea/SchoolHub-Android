import { useGetSubjects } from '@/api/subjects';
import AbsencesEvolutionChart from '@/components/absences-evolution-chart';
import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import GradesEvolutionChart from '@/components/grades-evolution-chart';
import HighlightCard from '@/components/highlight-card';
import { useSubjectsStore } from '@/data/subjects-store';
import {
  getAbsencesTimeData,
  getGradesTimeData,
  getOverallAverage,
  getRecentItems,
  getThisMonthData,
  getTotalAbsences
} from '@/lib/subjects-util';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { RefreshControl, useWindowDimensions, View } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';
import { useQueryClient } from 'react-query';

export default function Index() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const subjectsStore = useSubjectsStore();
  const subjects = useGetSubjects();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (subjects.isSuccess) {
      subjectsStore.updateSubjects(subjects.data);
    }
  }, [subjects.isSuccess]);

  return (
    <AnimatedHeaderWrapper
      title='Dashboard'
      scrollViewProps={{
        style: {
          backgroundColor: theme.colors.background
        },
        contentContainerStyle: tw`px-4 gap-2`,
        refreshControl: (
          <RefreshControl
            refreshing={subjects.isFetching}
            onRefresh={async () => {
              await queryClient.invalidateQueries('subjects');
              await subjects.refetch();
            }}
          />
        )
      }}
    >
      <View style={tw`flex-row gap-2`}>
        <HighlightCard
          value={getOverallAverage(subjectsStore.getSubjects())}
          label='Overall average'
        />
        <HighlightCard
          value={getTotalAbsences(subjectsStore.getSubjects()).toString()}
          label='Absences this year'
        />
      </View>
      <View style={tw`flex-row gap-2`}>
        <HighlightCard
          value={getThisMonthData(
            subjectsStore.getSubjects()
          ).gradesThisMonth.toString()}
          label='Grades this month'
        />
        <HighlightCard
          value={getThisMonthData(
            subjectsStore.getSubjects()
          ).absencesThisMonth.toString()}
          label='Absences this month'
        />
      </View>
      <View
        style={tw.style(`flex-1 gap-0.5 rounded-3xl pr-6`, {
          backgroundColor: theme.colors.elevation.level1
        })}
      >
        <View
          style={tw.style(`flex-row gap-2 pl-5 pt-3`, {
            marginBottom: -8
          })}
        >
          <MaterialCommunityIcons
            name='chart-line'
            size={24}
            color={theme.colors.onSurface}
          />
          <Text variant='bodyLarge'>Grades evolution</Text>
        </View>
        <GradesEvolutionChart
          data={getGradesTimeData(subjectsStore.getSubjects())}
          width={width + 80}
          lineColor={theme.colors.secondary}
          textColor={theme.colors.onSurface + 'b0'}
          gridColor={theme.colors.onSurface + '40'}
          dom={{
            style: { height: 170, userSelect: 'none' },
            scrollEnabled: false,
            showsVerticalScrollIndicator: false,
            showsHorizontalScrollIndicator: false
          }}
        />
      </View>
      <View
        style={tw.style(`flex-1 gap-0.5 rounded-3xl pr-6`, {
          backgroundColor: theme.colors.elevation.level1
        })}
      >
        <View
          style={tw.style(`flex-row gap-2 pl-5 pt-3`, {
            marginBottom: -8
          })}
        >
          <MaterialCommunityIcons
            name='chart-bar'
            size={24}
            color={theme.colors.onSurface}
          />
          <Text variant='bodyLarge'>Absences evolution</Text>
        </View>
        <AbsencesEvolutionChart
          data={getAbsencesTimeData(subjectsStore.getSubjects())}
          width={width + 80}
          lineColor={theme.colors.secondary}
          textColor={theme.colors.onSurface + 'b0'}
          gridColor={theme.colors.onSurface + '40'}
          dom={{
            style: { height: 170, userSelect: 'none' },
            scrollEnabled: false,
            showsVerticalScrollIndicator: false,
            showsHorizontalScrollIndicator: false
          }}
        />
      </View>
      <List.Section>
        <List.Subheader>Recents</List.Subheader>
        {getRecentItems(subjectsStore.getSubjects()).map((item, index) => (
          <React.Fragment key={index}>
            <List.Item
              key={index}
              title={item.subject.displayName}
              style={tw`pr-0`}
              description={item.type === 'grade' ? 'Grade' : 'Absence'}
              left={() => (
                <List.Icon
                  color={theme.colors.primary}
                  icon={item.subject.materialIconName}
                />
              )}
              right={() =>
                item.type === 'grade' ? (
                  <View style={tw`items-end justify-center`}>
                    <Text variant='bodyLarge'>{item.value}</Text>
                    <Text
                      variant='bodyMedium'
                      style={{
                        color: theme.colors.onSurface + 'b0'
                      }}
                    >
                      {item.date.toLocaleDateString()}
                    </Text>
                  </View>
                ) : (
                  <View style={tw`items-end justify-center`}>
                    <Text
                      variant='bodyLarge'
                      style={{
                        color: item.excused
                          ? theme.colors.onSurface
                          : theme.colors.error
                      }}
                    >
                      {item.excused ? 'Excused' : 'Not excused'}
                    </Text>
                    <Text
                      variant='bodyMedium'
                      style={{
                        color: theme.colors.onSurface + 'b0'
                      }}
                    >
                      {item.date.toLocaleDateString()}
                    </Text>
                  </View>
                )
              }
            />
            <Divider />
          </React.Fragment>
        ))}
      </List.Section>
    </AnimatedHeaderWrapper>
  );
}
