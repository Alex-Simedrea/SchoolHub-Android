import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create();

api.interceptors.request.use(
  async function (config) {
    try {
      let baseURL = await SecureStore.getItemAsync('baseURL');
      if (baseURL !== undefined && baseURL !== null) {
        if (baseURL.endsWith('/')) baseURL = baseURL.slice(0, -1);
        baseURL = baseURL.replace('/login.php', '');
        config.baseURL = baseURL;
      }

      let cookie = await SecureStore.getItemAsync('cookie');
      if (cookie !== undefined && cookie !== null) {
        config.headers['Cookie'] = cookie;
      }
      console.log(config);
    } catch (err) {
      console.log((err as any).code);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
