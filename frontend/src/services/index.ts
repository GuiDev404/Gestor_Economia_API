import axios, { AxiosError } from "axios";
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

          console.log('ERROR 401: ', storagedAuth);

          const res = normalInstance.post('/Auth/Refresh', {
            RefreshToken: storagedAuth?.refreshToken,
            AccessToken: storagedAuth?.accessToken
          })
          .then(({ data }) => {

            storagedAuth.accessToken = data.accessToken;
            storagedAuth.refreshToken = data.refreshToken;
            
            console.log({ storagedAuth, data });

            originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`;
            setStorage(KEY_STORAGE, storagedAuth);

            return authInstance(originalReq);
          })
          .catch(console.error)

          resolve(res);
      } 
      
      // else if ([400, 404, 405, 409, 500].includes(err.response.status)){
      //   const errorData = err.response.data;
      //   const errorMessage = errorData?.errors[""] || 'Algo salió mal';
      //   throw new AxiosError(errorMessage, err.response.config, err.response.status, err.response.statusText, err.response);
      // }

      return reject(err);
    });
});

export {
  authInstance,
  normalInstance,
};