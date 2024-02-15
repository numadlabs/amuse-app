import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import LoginSchema from "../validators/LoginSchema";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (telNumber: string, password: string) => Promise<any>;
  onLogin?: (preFix: string, telNumber: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
const localDeviceIp = "172.20.10.5";
export const API_URL = `http://${localDeviceIp}:3001/api`;
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
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (telNumber: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/auth/register`, { telNumber, password });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const login = async (prefix: string, telNumber: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        prefix,
        telNumber,
        password,
      });
  
      if (result && result.data && result.data.token) {
        // Successful login
        setAuthState({
          token: result.data.token,
          authenticated: true,
        });
  
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.token}`;
  
        await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
        console.log("Response from server:", result);
        
        return result;
      } else {
        // Login failed
        return { error: true, msg: "Invalid response from server" };
      }
    } catch (error) {
      // Network error or other exception
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error status:", error.response.status);
        return { error: true, msg: "Server error. Please try again later." };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server.");
        return { error: true, msg: "No response received from server." };
      } else {
        // Other errors
        console.error("An error occurred:", error.message);
        return { error: true, msg: "An error occurred. Please try again later." };
      }
    }
  };

  const logout = async () => {
    // Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Update HTTP Headers
    axios.defaults.headers.common["Authorization"] = "";

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
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
