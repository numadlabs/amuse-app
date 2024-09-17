import axios from "axios";
import Constants from "expo-constants";
import { SERVER_SETTING } from "../constants/serverSettings";
import * as SecureStore from "expo-secure-store";
import Config from "config";
import { logoutHandler } from "@/context/AuthContext";

// Constants.manifest2.
const isRunningInExpoGo = Constants.appOwnership === "expo";

// const uri = isRunningInExpoGo
//   ? `http://${Constants.expoConfig.hostUri
//       .split(`:`)
//       .shift()
//       .concat(`:3001/api`)}`
//   : `https://amuse-backend-feb14ba0a8da.herokuapp.com/api`;

const uri = `${Config.apiUrl}/api`;

export const baseUrl = uri;

export const axiosClient = axios.create({ baseURL: baseUrl });

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY
        );
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post("/auth/refreshToken", {
          refreshToken,
        });

        if (res.status === 200) {
          await SecureStore.setItemAsync(
            SERVER_SETTING.TOKEN_KEY,
            res.data.data.accessToken
          );
          await SecureStore.setItemAsync(
            SERVER_SETTING.REFRESH_TOKEN_KEY,
            res.data.data.refreshToken
          );

          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;

          return axiosClient(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        await logoutHandler();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
