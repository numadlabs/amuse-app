import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
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

type LayoutProps = {
  navigation: any;
};

type LoadingStates = {
  updates: boolean;
  pushNotification: boolean;
  fonts: boolean;
  internetCheck: boolean;
};

const PUSH_TOKEN_KEY = '@PushToken';

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { currentLocation, permissionStatus, getLocation } = useLocationStore();
  const { expoPushToken } = usePushNotifications();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    updates: false,
    pushNotification: false,
    fonts: false,
    internetCheck: true,
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

  const checkForUpdates = useCallback(async () => {
    if (__DEV__) return;

    setLoadingStates(prev => ({ ...prev, updates: true }));
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, updates: false }));
    }
  }, []);

  const checkInternetAndUpdate = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, internetCheck: true }));
    const netInfo = await NetInfo.fetch();
    setIsConnected(netInfo.isConnected);

    if (netInfo.isConnected) {
      await checkForUpdates();
    }
    setLoadingStates(prev => ({ ...prev, internetCheck: false }));
  }, [checkForUpdates]);

  const prepareApp = useCallback(async () => {
    try {
      await checkInternetAndUpdate();

      if (expoPushToken?.data) {
        setLoadingStates(prev => ({ ...prev, pushNotification: true }));
        const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        if (storedToken !== expoPushToken.data) {
          await sendPushToken({ pushToken: expoPushToken.data });
          await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
        }
        setLoadingStates(prev => ({ ...prev, pushNotification: false }));
      }

      await getLocation();
    } catch (error) {
      console.error("Error preparing app:", error);
    }
  }, [expoPushToken, sendPushToken, getLocation, checkInternetAndUpdate]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    setLoadingStates(prev => ({ ...prev, fonts: !fontsLoaded }));
  }, [fontsLoaded]);

  useEffect(() => {
    if (!authState.loading && fontsLoaded && !loadingStates.internetCheck && !loadingStates.updates) {
      setAppIsReady(true);
    }
  }, [authState.loading, fontsLoaded, loadingStates.internetCheck, loadingStates.updates]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!appIsReady) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (authState.authenticated === false) {
    return <Redirect href="/Login" />;
  }

  if (isConnected === false) {
    return <ErrorBoundary />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default Layout;