import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { QueryCache } from "@tanstack/react-query";
import { axiosClient } from "../lib/axios";
import { useRouter } from "expo-router";
import { SERVER_SETTING } from "../constants/serverSettings";
import {
  deleteUserId,
  loadUserId,
  saveUserId,
} from "../lib/service/asyncStorageHelper";
interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    loading: boolean;
    userId: string | null;
  };
  onRegister?: (
    nickname: string,
    email: string,
    password: string,
    verificationCode: number
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

const queryCache = new QueryCache();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();

  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    loading: boolean;
    userId: string | null;
  }>({
    token: null,
    authenticated: null,
    loading: true,
    userId: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(SERVER_SETTING.TOKEN_KEY);
        if (token) {
          const userId = await loadUserId();
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          setAuthState({
            token: token,
            authenticated: true,
            loading: false,
            userId: userId,
          });
        } else {
          // Reset auth state
          setAuthState({
            token: null,
            authenticated: false,
            loading: false,
            userId: null,
          });
        }
      } catch (error) {
        console.error("Error loading token:", error);
        setAuthState({
          token: null,
          authenticated: false,
          loading: false,
          userId: null,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    nickname: string,
    email: string,
    password: string,
    verificationCode: number
  ) => {
    try {
      const result = await axiosClient.post(`/auth/register`, {
        email,
        password,
        nickname,
        verificationCode,
      });
      if (result && result.data.data && result.data.data.auth) {
        // Successful Register
        setAuthState({
          token: result.data.data.auth,
          authenticated: true,
          loading: false,
          userId: result.data.data.user.id,
        });

        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          result.data.data.auth.accessToken
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          result.data.data.auth.refreshToken
        );
        await saveUserId(result.data.data.user.id);
        return result.data;
      } else if (
        result.data.success === false &&
        result.data.error === "User already exists with this phone number"
      ) {
        return {
          error: true,
          msg: "User already exists with this phone number",
        };
      } else {
        // Register failed
        return { error: true, msg: "Invalid response from server" };
      }
    } catch (error) {
      // Network error or other exception
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with error status:",
          error.response.status
        );
        return { error: true, msg: "Server error. Please try again later." };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server.");
        return { error: true, msg: "No response received from server." };
      } else {
        // Other errors
        console.error("An error occurred:", error.message);
        return {
          error: true,
          msg: "An error occurred. Please try again later.",
        };
      }
    }
  };

  const login = async (email, password: string) => {
    try {
      const result = await axiosClient.post(`/auth/login`, {
        email,
        password,
      });
      if (result && result.data.data && result.data.data.auth) {
        // Successful login
        setAuthState({
          token: result.data.data.auth,
          authenticated: true,
          loading: false,
          userId: result.data.data.user.id,
        });

        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          result.data.data.auth.accessToken
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          result.data.data.auth.refreshToken
        );
        await saveUserId(result.data.data.user.id);

        return result.data;
      } else {
        // Login failed
        return { error: true, msg: "Invalid response from server" };
      }
    } catch (error) {
      // Network error or other exception
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with error status:",
          error.response.status
        );
        return { error: true, msg: "Server error. Please try again later." };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server.");
        return { error: true, msg: "No response received from server." };
      } else {
        // Other errors
        console.error("An error occurred:", error.message);
        return {
          error: true,
          msg: "An error occurred. Please try again later.",
        };
      }
    }
  };

  const logout = async () => {
    // Delete token from storage
    await SecureStore.deleteItemAsync(SERVER_SETTING.TOKEN_KEY);
    await SecureStore.deleteItemAsync(SERVER_SETTING.REFRESH_TOKEN_KEY);

    // Update HTTP Headers
    axiosClient.defaults.headers.common["Authorization"] = "";

    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false,
      loading: false,
      userId: null,
    });

    await deleteUserId();
    queryCache.clear();
    router.replace("/Login");
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};