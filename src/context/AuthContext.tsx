import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { axiosClient } from "../lib/axios";
import { useRouter } from "expo-router";
import { SERVER_SETTING } from "../constants/serverSettings";
import {
  deleteUserId,
  loadUserId,
  saveUserId,
} from "../lib/service/asyncStorageHelper";
import { logoutHandler } from "@/lib/auth-utils";

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';  
import { QueryClient, useMutation } from '@tanstack/react-query';
import { QueryCache } from "@tanstack/react-query";
import { signInWithGoogle } from "@/lib/service/mutationHelper";


const queryClient = new QueryClient()
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
  onGoogleSignIn?: () => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const queryCache = new QueryCache();
  
  const [state, setState] = useState({
    isSignedIn: false,
    userInfo: null,
    isInProgress: false,
  });

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
          axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;
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
    verificationCode: number,
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

        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          result.data.data.auth.accessToken,
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          result.data.data.auth.refreshToken,
        );
        await saveUserId(result.data.data.user.id);
        return result.data;
      } else if (
        result.data.success === false &&
        result.data.error === "User already exists with this phone number"
      ) {
        return {
          error: true,
          msg: "User already exists with this email",
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
          error.response.status,
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
  

  const signInWithGoogle = async () => {
    GoogleSignin.configure({
      webClientId: '102784688709-4au2h4ad48bf6un169fmc0gq6g30neqg.apps.googleusercontent.com', // client ID of type WEB for your server
      scopes: ['profile', 'email'], // what API you want to access on behalf of the user
      iosClientId: '102784688709-3ooh6h0ogu7c0psa8ip8708jvlkiap35.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS
    });
    const { mutateAsync: googleSignInMutation } = useMutation({
      mutationFn: signInWithGoogle
    })
    
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User signed in!', userInfo.data);
      console.log('User signed in!', userInfo.data.idToken);
      setState({
        userInfo,
        isSignedIn: true,
        isInProgress: false,
      });
      const response = await googleSignInMutation({ idToken: userInfo.data.idToken })
      if (response) {
        console.log("logged", response);
        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${response.auth.accessToken}`;
        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          response.auth.accessToken
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          response.auth.refreshToken
        );
        await saveUserId(response.user.id);

        setAuthState({
          token: response.auth.accessToken,
          authenticated: true,
          loading: false,
          userId: response.user.id,
        });
        // router.replace('(tabs)/')
        return response;
      }
    } catch (error) {
      setState(prevState => ({ ...prevState, isInProgress: false }));

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Some other error happened:', error.message);
      }
    }
  };


  const login = async (email, password: string) => {
    try {
      queryCache.clear();
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

        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${result.data.data.auth.accessToken}`;

        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          result.data.data.auth.accessToken,
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          result.data.data.auth.refreshToken,
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
        console.error("Server responded with error status:", error.response);
        return {
          error: true,
          msg:
            error.response.data.error ??
            "Server error. Please try again later.",
        };
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
    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false,
      loading: false,
      userId: null,
    });
    queryCache.clear();

    await logoutHandler(axiosClient);
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onGoogleSignIn: signInWithGoogle,
    authState,
    setAuthState: setAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
