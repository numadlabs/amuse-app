import React, { useEffect, useState } from "react";
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

const Layout = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation } = useLocationStore();
  const { expoPushToken } = usePushNotifications();

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
    SoraBold: require("@/public/fonts/Sora-Bold.otf"),
    SoraMedium: require("@/public/fonts/Sora-Medium.otf"),    
    SoraSemiBold: require("@/public/fonts/Sora-SemiBold.otf"),   
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Start loading fonts and fetching location concurrently
        const fontPromise = new Promise<void>((resolve) => {
          if (fontsLoaded) resolve();
        });
        const locationPromise = getLocation();

        // Wait for fonts to load and location to be fetched
        await Promise.all([fontPromise, locationPromise]);

        // Set app as ready
        setAppIsReady(true);

        // Perform non-critical tasks after initial render
        setTimeout(() => {
          checkForUpdates();
          handlePushNotification();
        }, 0);
      } catch (error) {
        console.error("Error preparing app:", error);
      }
    };

    prepareApp();
  }, [fontsLoaded, getLocation]);

  const checkForUpdates = async () => {
    if (!__DEV__) {
      try {
        const updateAvailable = await Updates.checkForUpdateAsync();
        if (updateAvailable.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }
  };

  const handlePushNotification = () => {
    if (expoPushToken?.data) {
      sendPushToken({ pushToken: expoPushToken.data }).catch(error => {
        console.error("Error sending push token:", error);
      });
    }
  };

  if (!appIsReady || authState.loading) {
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/profileSection/Profile")}>
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