import { IconButton, Menu } from 'react-native-paper';
import tw from 'twrnc';
import React, { useState } from 'react';
import { Subject } from '@/data/types';
import { useSubjectsStore } from '@/data/subjects-store';
import { router } from 'expo-router';

export default function SubjectMenu({ subject }: { subject: Subject }) {
  const [visible, setVisible] = useState(false);
  const subjectsStore = useSubjectsStore();

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          icon='dots-vertical'
          style={tw`m-0`}
          onPress={() => {
            setVisible(true);
          }}
        />
      }
    >
      <Menu.Item
        leadingIcon='pencil'
        onPress={() => {
          setVisible(false);
          router.push({
            pathname: '/subjects/edit-subject',
            params: { subjectID: subject.id }
          });
        }}
        title='Edit'
      />
      <Menu.Item
        leadingIcon={subject.hidden ? 'eye' : 'eye-off'}
        onPress={() => {
          setVisible(false);
          subjectsStore.editSubject(subject.id, {
            ...subject,
            hidden: !subject.hidden
          });
        }}
        title={subject.hidden ? 'Show' : 'Hide'}
      />
    </Menu>
  );
}
