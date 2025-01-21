import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  Appbar,
  List,
  Switch,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useSubjectsStore } from '@/data/subjects-store';
import { Subject } from '@/data/types';
import IconPicker from '@/components/icon-picker';
import { EmptySubject } from '@/lib/utils';

export default function EditSubject() {
  const { subjectID } = useLocalSearchParams();
  const theme = useTheme();
  const subjectStore = useSubjectsStore();
  const subject: Subject =
    subjectStore.getSubjects().find((subject) => subject.id === subjectID) ??
    EmptySubject;

  const [displayName, setDisplayName] = useState(subject.displayName);
  const [iconName, setIconName] = useState(subject.materialIconName);
  const [hidden, setHidden] = useState(subject.hidden);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Appbar.Header elevated>
              <Appbar.BackAction
                onPress={() => {
                  router.back();
                }}
              />
              <Appbar.Content title='Edit Subject' />
              <Appbar.Action
                icon='check'
                onPress={() => {
                  subjectStore.editSubject(subjectID as string, {
                    ...subject,
                    displayName,
                    materialIconName: iconName,
                    hidden
                  });
                  router.back();
                }}
              />
            </Appbar.Header>
          )
        }}
      />
      <ScrollView
        style={tw`bg-[${theme.colors.background}]`}
        contentContainerStyle={tw`p-4`}
      >
        <View style={tw`gap-1`}>
          <TextInput
            mode='outlined'
            label={'Display name'}
            value={displayName}
            onChangeText={setDisplayName}
          />
          <Text style={tw`text-[${theme.colors.onSurfaceVariant}]`}>
            Original name: {subject.name}
          </Text>
          <List.Section>
            <List.Subheader>Appearance</List.Subheader>
            <List.Item
              title='Hidden'
              right={() => <Switch value={hidden} onValueChange={setHidden} />}
            />
          </List.Section>
        </View>
        <IconPicker
          selectedIcon={iconName}
          iconColor={theme.colors.onSurface}
          iconSize={16}
          backgroundColor={theme.colors.surface}
          numColumns={6}
          placeholderText=''
          placeholderTextColor={theme.colors.onSurface}
          onClick={(
            id,
            searchText,
            iconName,
            iconSet,
            iconColor,
            backgroundColor
          ) => {
            setIconName(iconName);
          }}
        />
      </ScrollView>
    </>
  );
}
