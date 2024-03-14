import axios from "axios";
import Constants from "expo-constants";
import { SERVER_SETTING } from "../constants/serverSettings";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Constants.manifest2.
const isRunningInExpoGo = Constants.appOwnership === "expo";

// const uri = isRunningInExpoGo
//   ? `http://${Constants.expoConfig.hostUri
//       .split(`:`)
//       .shift()
//       .concat(`:3001/api`)}`
//   : `https://amuse-backend-feb14ba0a8da.herokuapp.com/api`;

const uri = "https://amuse-backend-feb14ba0a8da.herokuapp.com/api";

export const baseUrl = uri;

export const axiosClient = axios.create({ baseURL: baseUrl });

// // Set the AUTH_TOKEN header for every request
// axiosClient.interceptors.request.use(
//   async (config) => {
//     const token = await SecureStore.getItemAsync(SERVER_SETTING.TOKEN_KEY);
//     config.headers.Authorization = token ? `Bearer ${token}` : "";
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Add a response interceptor to refresh token on 401 error
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If we got a 401 error, try to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Get the refresh token from SecureStore
        const refreshToken = await SecureStore.getItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY
        );
        // If there is a refresh token, use it to get a new access token
        if (refreshToken) {
          const res = await axiosClient.post("/auth/refreshToken", {
            refreshToken,
          });
          if (res.status === 200) {
            // Store the new tokens in SecureStore
            await SecureStore.setItemAsync(
              SERVER_SETTING.TOKEN_KEY,
              res.data.data.accessToken
            );
            await SecureStore.setItemAsync(
              SERVER_SETTING.REFRESH_TOKEN_KEY,
              res.data.data.refreshToken
            );
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            // Retry the original request with the new token
            return axiosClient(originalRequest);
          }
        } else {
          router.replace("/Login");
          console.log("no refresh token");
        }
      } catch (err) {
        // If the refresh token is invalid or expired, redirect to login page
        console.log(err);
        router.replace("/Login");
      }
    }
    // If the error is not related to token, reject the promise
    return Promise.reject(error);
  }
);
