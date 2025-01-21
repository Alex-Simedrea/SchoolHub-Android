import tw from 'twrnc';
import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import {
  Divider,
  List,
  SegmentedButtons,
  Text,
  useTheme
} from 'react-native-paper';
import React, { useState } from 'react';
import { groupTimeSlotsByWeekday } from '@/lib/subjects-util';
import { useSubjectsStore } from '@/data/subjects-store';
import { useWindowDimensions, View } from 'react-native';

export default function Timetable() {
  const theme = useTheme();
  const subjectsStore = useSubjectsStore();
  const [selectedDay, setSelectedDay] = useState('1');

  const timeslots = groupTimeSlotsByWeekday(subjectsStore.getSubjects());

  return (
    <AnimatedHeaderWrapper
      title='Timetable'
      scrollViewProps={{
        style: {
          backgroundColor: theme.colors.background
        },
        contentContainerStyle: tw`px-4 gap-2`
      }}
    >
      <SegmentedButtons
        value={selectedDay}
        onValueChange={setSelectedDay}
        buttons={[
          {
            value: '1',
            label: 'M',
            style: {
              minWidth: 0
            }
          },
          {
            value: '2',
            label: 'T',
            style: {
              minWidth: 0
            }
          },
          {
            value: '3',
            label: 'W',
            style: {
              minWidth: 0
            }
          },
          {
            value: '4',
            label: 'T',
            style: {
              minWidth: 0
            }
          },
          {
            value: '5',
            label: 'F',
            style: {
              minWidth: 0
            }
          }
        ]}
        style={{
          width: '100%'
        }}
      />

      <List.Section>
        {timeslots
          .filter((day) => day.weekday === +selectedDay)
          ?.at(0)
          ?.timeSlots.map((timeSlot, index, arr) => (
            <React.Fragment key={timeSlot.id}>
              <List.Item
                title={timeSlot.subjectDisplayName}
                left={() => (
                  <List.Icon icon={timeSlot.subjectMaterialIconName} />
                )}
                style={tw.style(
                  `bg-[${theme.colors.elevation.level1}] px-5`,
                  index === 0 && `rounded-t-[${theme.roundness}]`,
                  index === arr.length - 1 && `rounded-b-[${theme.roundness}]`
                )}
                right={() => (
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
                )}
              />
              {index !== arr.length - 1 && <Divider />}
            </React.Fragment>
          ))}
      </List.Section>
    </AnimatedHeaderWrapper>
  );
}
