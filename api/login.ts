import api from '@/api/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as SecureStore from 'expo-secure-store';
import { AxiosResponse } from 'axios';
import CookieStorage from '@react-native-cookies/cookies';

const fetchCookie = async () => {
  return api
    .get(`/login.php`, {
      headers: {
        Accept: 'text/html'
      }
    })
    .then((res) => res.headers['set-cookie']);
};

const saveCookie = async (cookie: string[] | undefined) => {
  console.log(cookie);
  if (cookie !== undefined && cookie !== null && cookie.length > 0) {
    await SecureStore.setItemAsync('cookie', cookie[0]);
  }
};

const login = async ({
  username,
  password
}: {
  username: string;
  password: string;
}) => {
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

const getCredentials = async () => {
  const username = await SecureStore.getItemAsync('username');
  const password = await SecureStore.getItemAsync('password');
  const cookie = await SecureStore.getItemAsync('cookie');
  const baseURL = await SecureStore.getItemAsync('baseURL');
  return { username, password, cookie, baseURL };
};

export const useCreateCookie = () => {
  return useMutation({
    mutationKey: 'cookie',
    mutationFn: async () => saveCookie(await fetchCookie())
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: 'login',
    mutationFn: login,
    onSuccess: async (data, variables) => {
      await Promise.all([
        SecureStore.setItemAsync('username', variables.username),
        SecureStore.setItemAsync('password', variables.password)
      ]);
      await queryClient.refetchQueries('credentials');
      await CookieStorage.clearAll();
    }
  });
};

export const useGetCredentials = () => {
  return useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials
  });
};
