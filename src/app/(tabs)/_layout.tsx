import React, { useEffect, useState } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import Footer from "../components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "../components/icons/Logo";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import useLocationStore from "../lib/store/userLocation";
import { LinearGradient } from "expo-linear-gradient";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreenWithLoadingBar from "../SplashScreenAnimated";
import * as Manifests from 'expo-manifests';
import { io } from "socket.io-client";
import { SERVER_SETTING } from "../constants/serverSettings";
import { useFonts } from "expo-font";
import { usePushNotifications } from "../hooks/usePushNotification";
import { useMutation } from "@tanstack/react-query";
import { registerDeviceNotification } from "../lib/service/mutationHelper";

const Layout = ({ navigation }) => {

  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation, currentLocation } = useLocationStore();
  const [notification, setNotification] = useState("");
  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("@/public/fonts/Sora-Regular.ttf"),
    "Sora-Bold": require("@/public/fonts/Sora-Regular.ttf"),
  });
  const { expoPushToken, notification: pushNotification } = usePushNotifications();

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification
  })

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (!__DEV__) { // Only check for updates in production mode
          const updateAvailable = await Updates.checkForUpdateAsync();

          if (updateAvailable.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          } else {
            console.log("No update available");
          }
        } else {
          console.log("Running in development mode");
        }




        // Get notification data
        const data = JSON.stringify(pushNotification, undefined, 2)

        if (expoPushToken?.data) {
          console.log("Sending push token");
          
          sendPushToken({
            pushToken: expoPushToken?.data
          })
        }


        // Get current location
        if (currentLocation == null) {
          await getLocation();
        }

        // Check for and handle stored notification
        const storedCard = await AsyncStorage.getItem("restaurantCard");
        if (storedCard) {
          setNotification(storedCard);
          await AsyncStorage.removeItem("restaurantCard");
        }
      } catch (error) {
        console.error("Error preparing app:", error);
      } finally {
        if (!authState.loading && currentLocation !== null && fontsLoaded) {
          setAppIsReady(true);
        }
      }
    };

    // Call prepareApp function on component mount
    prepareApp();
  }, [currentLocation, authState.loading, fontsLoaded]);

  // Show loading screen if app is not ready
  if (!appIsReady) {
    return <SplashScreenWithLoadingBar />;
  }

  // Redirect to login if user is not authenticated
  if (authState.authenticated === false) {
    return <Redirect href={"/Login"} />;
  }

  // Render main app content with Tabs
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
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/Notification")}>
              <View style={{ paddingHorizontal: 20 }}>
                <Notification color={Color.base.White} />
                <View style={{ position: 'absolute', right: 22 }}>
                  {notification ? (
                    <LinearGradient
                      colors={[Color.Brand.main.start, Color.Brand.main.end]}
                      style={{ width: 8, height: 8, borderRadius: 8 }}
                    />
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ),
          headerTitle: () => <Logo />,
        }}
      />
      <Tabs.Screen name="Acards" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default Layout;