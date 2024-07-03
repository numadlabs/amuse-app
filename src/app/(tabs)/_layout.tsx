import React, { useEffect, useState } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity, Platform } from "react-native";
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

const Layout = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation, currentLocation } = useLocationStore();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const prepareApp = async () => {
      try {
        console.log("checking update")
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
        // Handle specific errors here, possibly retrying or providing fallbacks
      } finally {
        console.log("before condition")
        // Ensure app readiness state is set when conditions are met
        if (!authState.loading && currentLocation !== null) {
          console.log("main trigger")
          setAppIsReady(true);
        }
      }
    };

    // Call prepareApp function on component mount
    prepareApp();
  }, [currentLocation, authState.loading]);

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
            display: "none",
            justifyContent: "space-around",
            shadowOpacity: 0,
            backgroundColor: Color.Gray.gray600,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/profileSection/Profile")}>
              <View style={{ paddingHorizontal: 20}}>
                <User color={Color.base.White} />
              </View>
            </TouchableOpacity>
          ),
          
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Logo />
            </View>
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
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen name="Acards" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default Layout;
