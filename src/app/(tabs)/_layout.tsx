import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
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

type LayoutProps = {
  navigation: any;
};

type LoadingStates = {
  updates: boolean;
  pushNotification: boolean;
  location: boolean;
  fonts: boolean;
};

const PUSH_TOKEN_KEY = '@PushToken';

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { getLocation, currentLocation } = useLocationStore();
  const { expoPushToken } = usePushNotifications();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    updates: false,
    pushNotification: false,
    location: false,
    fonts: false,
  });

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
    SoraBold: require("@/public/fonts/Sora-Bold.otf"),
    SoraMedium: require("@/public/fonts/Sora-Medium.otf"),    
    SoraSemiBold: require("@/public/fonts/Sora-SemiBold.otf"),   
  });

  const prepareApp = useCallback(async () => {
    try {
      if (!__DEV__) {
        setLoadingStates(prev => ({ ...prev, updates: true }));
        try {
          const updateCheck = await Promise.race([
            Updates.checkForUpdateAsync(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Update check timed out')), 5000))
          ]);

          if (updateCheck && typeof updateCheck === 'object' && 'isAvailable' in updateCheck) {
            if (updateCheck.isAvailable) {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            }
          } else {
            console.log("Update check returned an unexpected result");
          }
        } catch (error) {
          console.error("Error checking for updates:", error);
        } finally {
          setLoadingStates(prev => ({ ...prev, updates: false }));
        }
      }

      if (expoPushToken?.data) {
        setLoadingStates(prev => ({ ...prev, pushNotification: true }));
        const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        if (storedToken !== expoPushToken.data) {
          await sendPushToken({ pushToken: expoPushToken.data });
          await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
        }
        setLoadingStates(prev => ({ ...prev, pushNotification: false }));
      }

      if (currentLocation == null) {
        setLoadingStates(prev => ({ ...prev, location: true }));
        await getLocation();
        setLoadingStates(prev => ({ ...prev, location: false }));
      }
    } catch (error) {
      console.error("Error preparing app:", error);
    }
  }, [expoPushToken, currentLocation, getLocation, sendPushToken]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    setLoadingStates(prev => ({ ...prev, fonts: !fontsLoaded }));
  }, [fontsLoaded]);

  useEffect(() => {
    if (!authState.loading && currentLocation !== null && fontsLoaded) {
      setAppIsReady(true);
    }
  }, [authState.loading, currentLocation, fontsLoaded]);

  if (!appIsReady) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (authState.authenticated === false) {
    return <Redirect href="/Login" />;
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

export default Layout;