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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    verificationCode: number,
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
          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setAuthState({
            token: token,
            authenticated: true,
            loading: false,
            userId: userId,
          });
        } else {
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
    verificationCode: number,
  ) => {
    try {
      const result = await axiosClient.post(`/auth/register`, {
        email,
        password,
        nickname,
        verificationCode,
      });

      if (result.data.success && result.data.data && result.data.data.auth) {
        setAuthState({
          token: result.data.data.auth.accessToken,
          authenticated: true,
          loading: false,
          userId: result.data.data.user.id,
        });

        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          result.data.data.auth.accessToken,
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          result.data.data.auth.refreshToken,
        );
        await saveUserId(result.data.data.user.id);

        return { success: true, data: result.data.data };
      } else {
        return { 
          success: false, 
          error: result.data.error || "Registration failed. Please try again." 
        };
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with error status:",
          error.response.status,
          error.response.data
        );
        return { 
          success: false, 
          error: error.response.data.error || "Server error. Please try again later." 
        };
      } else if (error.request) {
        console.error("No response received from server.");
        return { success: false, error: "No response received from server." };
      } else {
        console.error("An error occurred:", error.message);
        return {
          success: false,
          error: "An error occurred. Please try again later.",
        };
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axiosClient.post(`/auth/login`, {
        email,
        password,
      });

      if (result.data.success && result.data.data && result.data.data.auth) {
        setAuthState({
          token: result.data.data.auth.accessToken,
          authenticated: true,
          loading: false,
          userId: result.data.data.user.id,
        });

        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          result.data.data.auth.accessToken,
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          result.data.data.auth.refreshToken,
        );
        await saveUserId(result.data.data.user.id);

        return { success: true, data: result.data.data };
      } else {
        return { 
          success: false, 
          error: result.data.error || "Login failed. Please try again." 
        };
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with error status:",
          error.response.status,
          error.response.data
        );
        return { 
          success: false, 
          error: error.response.data.error || "Server error. Please try again later." 
        };
      } else if (error.request) {
        console.error("No response received from server.");
        return { success: false, error: "No response received from server." };
      } else {
        console.error("An error occurred:", error.message);
        return {
          success: false,
          error: "An error occurred. Please try again later.",
        };
      }
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(SERVER_SETTING.TOKEN_KEY);
      await SecureStore.deleteItemAsync(SERVER_SETTING.REFRESH_TOKEN_KEY);
      
      axiosClient.defaults.headers.common["Authorization"] = "";
      
      setAuthState({
        token: null,
        authenticated: false,
        loading: false,
        userId: null,
      });

      await deleteUserId();
      queryCache.clear();
      router.replace("/Login");

      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      return {
        success: false,
        error: "An error occurred during logout. Please try again.",
      };
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};