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

const Layout = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation, currentLocation } = useLocationStore();
  const [notification, setNotification] = useState("");
  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (!__DEV__) {
          // Only check for updates in production mode
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
        // const data = JSON.stringify(pushNotification, undefined, 2)

        // if (expoPushToken?.data) {
        //   console.log("Sending push token");

        //   sendPushToken({
        //     pushToken: expoPushToken?.data
        //   })
        // }

        // Get current location
        if (currentLocation == null) {
          await getLocation();
        }
        //TODO notifications fetch hj bgag ynzlah
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
  }, [currentLocation, authState?.loading, fontsLoaded]);

  // Show loading screen if app is not ready
  if (!appIsReady) {
    return <SplashScreenAnimated />;
  }

  // Redirect to login if user is not authenticated
  if (authState.authenticated === false) {
    return <Redirect href={"/Login"} />;
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
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
