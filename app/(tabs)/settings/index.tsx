import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { View } from 'react-native';
import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useGetCredentials } from '@/api/login';
import * as SecureStore from 'expo-secure-store';
import CookieManager from '@react-native-cookies/cookies';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubjectsStore } from '@/data/subjects-store';
import { mergeSubjects } from '@/lib/subjects-util';
import * as Clipboard from 'expo-clipboard';

export default function Index() {
  const theme = useTheme();
  const credentials = useGetCredentials();
  const [cookie, setCookie] = useState('');
  const [json, setJson] = useState('');
  const subjectsStore = useSubjectsStore();

  useEffect(() => {
    CookieManager.get('https://www.noteincatalog.ro').then((cookies) => {
      setCookie(cookies['PHPSESSID'].value);
    });
  }, []);

  if (credentials.isLoading) {
    return (
      <AnimatedHeaderWrapper
        title='Settings'
        scrollViewProps={{
          style: {
            backgroundColor: theme.colors.background
          },
          contentContainerStyle: tw`px-4 gap-2`
        }}
      >
        <ActivityIndicator />
      </AnimatedHeaderWrapper>
    );
  }

  return (
    <AnimatedHeaderWrapper
      title='Settings'
      scrollViewProps={{
        style: {
          backgroundColor: theme.colors.background
        },
        contentContainerStyle: tw`px-4 gap-2 pb-10`
      }}
    >
      <View style={tw`gap-4 pb-8`}>
        <Text variant='titleLarge'>Import from JSON</Text>
        {/*<TextInput*/}
        {/*  theme={theme}*/}
        {/*  mode='outlined'*/}
        {/*  label={'JSON'}*/}
        {/*  placeholder='Paste your JSON here...'*/}
        {/*  value={json}*/}
        {/*  onChangeText={setJson}*/}
        {/*/>*/}
        <Button
          mode='outlined'
          onPress={async () => {
            const jsonData = await Clipboard.getStringAsync();
            const subjects = mergeSubjects(
              subjectsStore.getSubjects(),
              JSON.parse(jsonData)
            );
            subjectsStore.setSubjects(subjects);
          }}
        >
          Import from clipboard
        </Button>
      </View>
      <View style={tw`gap-4`}>
        <Text variant='titleLarge'>Import from other grade books</Text>
        {!credentials.isError &&
        credentials.data?.username != null &&
        credentials.data?.username.length > 0 &&
        credentials.data?.password != null &&
        credentials.data?.password.length > 0 &&
        credentials.data?.cookie != null &&
        credentials.data?.cookie.length > 0 &&
        credentials.data?.baseURL != null &&
        credentials.data?.baseURL.length > 0 ? (
          <View style={tw`gap-4`}>
            <View
              style={tw`rounded-[${theme.roundness}] gap-3 bg-[${theme.colors.elevation.level1}] p-4`}
            >
              <View style={tw`flex-row items-center gap-2.5`}>
                <MaterialCommunityIcons
                  name='account-circle'
                  size={44}
                  color={theme.colors.onSurfaceVariant}
                />
                <View style={tw`flex-1`}>
                  <Text variant='titleMedium'>
                    {credentials.data?.username}
                  </Text>
                  <Text variant='bodySmall'>
                    {credentials.data?.baseURL}
                  </Text>
                </View>
              </View>
              <Button
                mode='contained-tonal'
                onPress={async () => {
                  await Promise.all([
                    SecureStore.deleteItemAsync('username'),
                    SecureStore.deleteItemAsync('password'),
                    SecureStore.deleteItemAsync('cookie'),
                    SecureStore.deleteItemAsync('baseURL')
                  ]);
                }}
                icon={'logout'}
              >
                Logout
              </Button>
            </View>
          </View>
        ) : (
          <Button
            mode='contained'
            onPress={() => {
              router.push('/settings/login');
            }}
          >
            Login
          </Button>
        )}
      </View>
      <View style={tw`gap-4 pt-8`}>
        <Button
          mode='outlined'
          onPress={() => {
            Clipboard.setStringAsync(
              JSON.stringify(subjectsStore.subjects, null, 2)
            );
            console.log(JSON.stringify(subjectsStore.subjects, null, 2));
          }}
        >
          Copy all data as JSON
        </Button>
        <Button
          mode='outlined'
          onPress={() => {
            const subjects = subjectsStore.subjects.map((subject) => {
              return {
                ...subject,
                grades: [],
                absences: []
              };
            });
            Clipboard.setStringAsync(JSON.stringify(subjects, null, 2));
            console.log(JSON.stringify(subjects, null, 2));
          }}
        >
          Copy data without grades and absences
        </Button>
        <Button
          mode='outlined'
          onPress={() => {
            router.push('/settings/debug');
          }}
        >
          Debug Info
        </Button>
        <Button
          mode='outlined'
          textColor={theme.colors.error}
          onPress={() => {
            subjectsStore.setSubjects([]);
          }}
        >
          Delete all data
        </Button>
      </View>
    </AnimatedHeaderWrapper>
  );
}
