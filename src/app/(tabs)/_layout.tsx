import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
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
  navigation: any; // Replace 'any' with the correct type from your navigation library
};

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { getLocation, currentLocation } = useLocationStore();
  const { expoPushToken } = usePushNotifications();

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const [fontsLoaded] = useFonts({
    // Add your custom fonts here
    // 'CustomFont-Regular': require('./assets/fonts/CustomFont-Regular.ttf'),
  });

  const prepareApp = useCallback(async () => {
    try {
      if (!__DEV__) {
        const updateAvailable = await Updates.checkForUpdateAsync();
        if (updateAvailable.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      }

      if (expoPushToken?.data) {
        await sendPushToken({ pushToken: expoPushToken.data });
      }

      if (currentLocation === null) {
        await getLocation();
      }
    } catch (error) {
      console.error("Error preparing app:", error);
    }
  }, [currentLocation, getLocation, sendPushToken, expoPushToken]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    if (!authState.loading && currentLocation !== null && fontsLoaded) {
      setAppIsReady(true);
    }
  }, [authState.loading, currentLocation, fontsLoaded]);

  const memoizedHeaderLeft = useMemo(() => (
    <TouchableOpacity
      onPress={() => router.push("/profileSection/Profile")}
    >
      <View style={{ paddingHorizontal: 20 }}>
        <User color={Color.base.White} />
      </View>
    </TouchableOpacity>
  ), []);

  const memoizedHeaderTitle = useMemo(() => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Logo />
    </View>
  ), []);

  const memoizedHeaderRight = useMemo(() => (
    <TouchableOpacity onPress={() => router.push("/Notification")}>
      <View style={{ paddingHorizontal: 20 }}>
        <Notification color={Color.base.White} />
      </View>
    </TouchableOpacity>
  ), []);

  if (!appIsReady) {
    return <SplashScreenAnimated />;
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
          headerLeft: () => memoizedHeaderLeft,
          headerTitle: () => memoizedHeaderTitle,
          headerRight: () => memoizedHeaderRight,
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen name="Acards" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default Layout;