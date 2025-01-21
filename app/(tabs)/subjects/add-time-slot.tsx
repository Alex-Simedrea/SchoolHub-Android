import { Appbar, SegmentedButtons, Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import React, { useState } from 'react';
import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import { useSubjectsStore } from '@/data/subjects-store';
import { EmptySubject } from '@/lib/utils';
import { TimePickerModal } from 'react-native-paper-dates';
import { TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';

export default function AddTimeSlot() {
  const { subjectID } = useLocalSearchParams();
  const subjectsStore = useSubjectsStore();
  const subject =
    subjectsStore.getSubjects().find((s) => s.id === subjectID) ?? EmptySubject;

  const startDefault = new Date();
  startDefault.setHours(8);
  startDefault.setMinutes(0);

  const endDefault = new Date();
  endDefault.setHours(8);
  endDefault.setMinutes(50);

  const [startTime, setStartTime] = useState(startDefault);
  const [endTime, setEndTime] = useState(endDefault);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [selectedDay, setSelectedDay] = useState('1');

  return (
    <AnimatedHeaderWrapper
      title={subject.displayName}
      leftContent={<Appbar.BackAction onPress={() => router.back()} />}
      rightContent={
        <Appbar.Action
          icon='check'
          onPress={() => {
            subjectsStore.editSubject(subjectID as string, {
              ...subject,
              timeSlots: [
                ...subject.timeSlots,
                {
                  id: uuid.v4(),
                  startTime: startTime,
                  endTime: endTime,
                  weekday: +selectedDay
                }
              ]
            });
            router.back();
          }}
        />
      }
      scrollViewProps={{
        contentContainerStyle: tw`px-4 gap-4`
      }}
    >
      <Text variant='titleMedium'>Week day</Text>
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
      <View style={tw`w-full flex-row items-center justify-between`}>
        <Text variant='bodyLarge'>Start time</Text>
        <TouchableOpacity
          onPress={() => {
            setShowStartPicker(true);
          }}
          style={tw`rounded bg-white/10 p-2`}
        >
          <Text variant='bodyLarge'>
            {startTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`w-full flex-row items-center justify-between`}>
        <Text variant='bodyLarge'>End time</Text>
        <TouchableOpacity
          onPress={() => {
            setShowEndPicker(true);
          }}
          style={tw`rounded bg-white/10 p-2`}
        >
          <Text variant='bodyLarge'>
            {endTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </Text>
        </TouchableOpacity>
      </View>
      <TimePickerModal
        visible={showStartPicker}
        onDismiss={() => setShowStartPicker(false)}
        onConfirm={(date) => {
          const newStartTime = new Date();
          newStartTime.setHours(date.hours);
          newStartTime.setMinutes(date.minutes);
          setStartTime(newStartTime);

          if (newStartTime >= endTime) {
            const newEndTime = new Date(newStartTime);
            newEndTime.setMinutes(newStartTime.getMinutes() + 1);
            setEndTime(newEndTime);
          }

          setShowStartPicker(false);
        }}
        hours={8}
        minutes={0}
      />
      <TimePickerModal
        visible={showEndPicker}
        onDismiss={() => setShowEndPicker(false)}
        onConfirm={(date) => {
          const newEndTime = new Date();
          newEndTime.setHours(date.hours);
          newEndTime.setMinutes(date.minutes);
          setEndTime(newEndTime);

          if (newEndTime <= startTime) {
            const newStartTime = new Date(newEndTime);
            newStartTime.setMinutes(newEndTime.getMinutes() - 1);
            setStartTime(newStartTime);
          }

          setShowEndPicker(false);
        }}
        hours={8}
        minutes={50}
      />
    </AnimatedHeaderWrapper>
  );
}
