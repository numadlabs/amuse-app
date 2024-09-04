import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Footer from "@/components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "@/components/icons/Logo";
import Color from "@/constants/Color";
import { useAuth } from "@/context/AuthContext";
import useLocationStore from "@/lib/store/userLocation";
import * as Updates from "expo-updates";
import { useFonts } from "expo-font";
import SplashScreenAnimated from "../SplashScreenAnimated";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useMutation } from "@tanstack/react-query";
import { registerDeviceNotification } from "@/lib/service/mutationHelper";
import ErrorBoundary from "../ErrorBoundary";
import { BODY_1_REGULAR, BUTTON_48 } from "@/constants/typography";

type LayoutProps = {
  navigation: any;
};

type LoadingStates = {
  internetCheck: boolean;
  updateCheck: boolean;
  pushNotification: boolean;
  fonts: boolean;
};

const PUSH_TOKEN_KEY = '@PushToken';

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { getLocation, isLoading, error } = useLocationStore();
  const { expoPushToken } = usePushNotifications();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    internetCheck: true,
    updateCheck: false,
    pushNotification: false,
    fonts: true,
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
    SoraBold: require("@/public/fonts/Sora-Bold.otf"),
    SoraMedium: require("@/public/fonts/Sora-Medium.otf"),    
    SoraSemiBold: require("@/public/fonts/Sora-SemiBold.otf"),   
  });

  const checkInternetConnection = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, internetCheck: true }));
    try {
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);
      return netInfo.isConnected;
    } catch (error) {
      console.error("Error checking internet connection:", error);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, internetCheck: false }));
    }
  }, []);

  const checkForUpdates = useCallback(async () => {
    if (__DEV__) return false;

    setLoadingStates(prev => ({ ...prev, updateCheck: true }));
    try {
      const updateCheck = await Promise.race([
        Updates.checkForUpdateAsync(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Update check timed out')), 5000))
      ]);

      if (updateCheck && typeof updateCheck === 'object' && 'isAvailable' in updateCheck) {
        if (updateCheck.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          return true;
        }
      } else {
        console.log("Update check returned an unexpected result");
      }
      return false;
    } catch (error) {
      console.error("Error checking for updates:", error);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, updateCheck: false }));
    }
  }, []);

  const registerPushNotification = useCallback(async () => {
    if (!expoPushToken?.data) return;

    setLoadingStates(prev => ({ ...prev, pushNotification: true }));
    try {
      const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (storedToken !== expoPushToken.data) {
        await sendPushToken({ pushToken: expoPushToken.data });
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
      }
    } catch (error) {
      console.error("Error registering push notification:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, pushNotification: false }));
    }
  }, [expoPushToken, sendPushToken]);

  const prepareApp = useCallback(async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return;
    }

    const updateAvailable = await checkForUpdates();
    if (!updateAvailable) {
      await registerPushNotification();
      setAppIsReady(true);
    }
  }, [checkInternetConnection, checkForUpdates, registerPushNotification]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    setLoadingStates(prev => ({ ...prev, fonts: !fontsLoaded }));
  }, [fontsLoaded]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setAppIsReady(false);
      } else if (state.isConnected && !appIsReady) {
        prepareApp();
      }
    });

    return () => unsubscribe();
  }, [appIsReady, prepareApp]);

  const handleRetry = useCallback(async () => {
    setAppIsReady(false);
    await prepareApp();
  }, [prepareApp]);

  if (isConnected === false) {
    return (
      <ErrorBoundary>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No internet connection. Please check your network settings and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ErrorBoundary>
    );
  }

  if (loadingStates.internetCheck || loadingStates.updateCheck || loadingStates.pushNotification || !fontsLoaded) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (authState.authenticated === false) {
    return <Redirect href="/Login" />;
  }

  if (!appIsReady) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  return (
    <Tabs tabBar={(props) => <Footer {...props} navigation={navigation} />}>
      <Tabs.Screen
        name="index"
        options={{
          headerStyle: {
            shadowOpacity: 0,
            backgroundColor: Color.Gray.gray600,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/profileSection/Profile")}
            >
              <View style={{ paddingHorizontal: 20 }}>
                <User color={Color.base.White} />
              </View>
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Logo />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/Notification")}>
              <View style={{ paddingHorizontal: 20 }}>
                <Notification color={Color.base.White} />
              </View>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen name="Acards" options={{ headerShown: false }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.Gray.gray600,
    padding: 20,
  },
  errorText: {
    ...BODY_1_REGULAR,
    color: Color.base.White,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Color.Gray.gray300,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    ...BUTTON_48,
    color: Color.base.White,
  },
});

export default Layout;