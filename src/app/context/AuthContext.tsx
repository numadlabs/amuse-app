import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { axiosClient } from "../lib/axios";
import React from "react";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    nickname: string,
    preFix: string,
    telNumber: string,
    password: string
  ) => Promise<any>;
  onLogin?: (
    preFix: string,
    telNumber: string,
    password: string
  ) => Promise<any>;
  onLogout?: () => Promise<any>;
  onTestLogin?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";

const testAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmMWNiNzE4LTgwNjctNDU5NS1iN2M2LTEwM2ZiY2VlMjNmYSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzA4NjgyNzc3LCJleHAiOjE3NDAyMTg3Nzd9.3H62Q2N3Y2B3fWZTJzCVy3Gxa7y3rS7K5wETK8zva_4";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("🚀 ~ loadToken ~ token:", token);
      if (token) {
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    nickname: string,
    preFix: string,
    telNumber: string,
    password: string
  ) => {
    try {
      return await axiosClient.post(`/auth/register`, {
        telNumber,
        password,
      });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const login = async (prefix: string, telNumber: string, password: string) => {
    try {
      const result = await axiosClient.post(`/auth/login`, {
        prefix,
        telNumber,
        password,
      });
      console.log("birch", result.data.data, result.data.data.auth);
      if (result && result.data.data && result.data.data.auth) {
        // Successful login
        setAuthState({
          token: result.data.data.auth,
          authenticated: true,
        });

        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          TOKEN_KEY,
          result.data.data.auth.accessToken
        );

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

  const setTestAccessToken = async () => {
    await SecureStore.setItemAsync(TOKEN_KEY, testAccessToken);
  };

  const logout = async () => {
    // Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Update HTTP Headers
    axiosClient.defaults.headers.common["Authorization"] = "";

    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onTestLogin: setTestAccessToken,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
