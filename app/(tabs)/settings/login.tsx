import { Appbar, Button, TextInput, useTheme } from 'react-native-paper';
import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import tw from 'twrnc';
import { View } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCreateCookie, useLogin } from '@/api/login';

export default function Login() {
  const theme = useTheme();
  const [baseURL, setBaseURL] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const createCookie = useCreateCookie();
  const login = useLogin();

  return (
    <AnimatedHeaderWrapper
      title='Login'
      scrollViewProps={{
        style: {
          backgroundColor: theme.colors.background
        },
        contentContainerStyle: tw`px-4 gap-2`
      }}
      leftContent={
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
      }
    >
      <View style={tw`gap-4 pb-8`}>
        <TextInput
          theme={theme}
          mode='outlined'
          label={'Base URL'}
          placeholder='Enter the base URL...'
          value={baseURL}
          onChangeText={setBaseURL}
        />
        <TextInput
          theme={theme}
          mode='outlined'
          label={'Username'}
          placeholder='Enter your username...'
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          theme={theme}
          mode='outlined'
          label={'Password'}
          placeholder='Enter your password...'
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          mode='outlined'
          onPress={async () => {
            await SecureStore.setItemAsync('baseURL', baseURL);
            createCookie.mutateAsync().then(() => {
              login.mutate({ username, password }, {
                onSuccess: (data) => {
                  if (data.includes('table')) {
                    router.back();
                  }
                }
              });
            });
          }}
        >
          Login
        </Button>
      </View>
    </AnimatedHeaderWrapper>
  );
}
