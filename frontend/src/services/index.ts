import axios from "axios";
import { BASE_URL } from "./config";
import { KEY_STORAGE, getStorage, setStorage } from "../utils/storage";

const BASE_OPTIONS = {
  baseURL: BASE_URL,
  // headers: DEFAULT_HEADERS,
}

const normalInstance = axios.create(BASE_OPTIONS);

const authInstance = axios.create(BASE_OPTIONS);

authInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = getStorage(KEY_STORAGE) ?? {};

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(response => {
  return response;
}, err => {
  return new Promise((resolve, reject) => {
      const originalReq = err.config;

      if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          originalReq._retry = true;
          const storagedAuth = getStorage(KEY_STORAGE)

          // console.log('ERROR 401: ', storagedAuth);

          const res = normalInstance.post('/Auth/Refresh', {
            RefreshToken: storagedAuth?.refreshToken,
            AccessToken: storagedAuth?.accessToken
          })
          .then(({ data }) => {
            console.log(data);
            storagedAuth.accessToken = data.accessToken;
            storagedAuth.refreshToken = data.refreshToken;
            
            originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`;
            setStorage(KEY_STORAGE, storagedAuth);

            return authInstance(originalReq);
          })

          resolve(res);
      }

      return reject(err);
    });
});

export {
  authInstance,
  normalInstance,
};