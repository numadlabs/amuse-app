import React, { useCallback, useEffect, useState } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import Footer from "../components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "../components/icons/Logo";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import useLocationStore from "../lib/store/userLocation";

const Layout = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation, currentLocation } = useLocationStore();


  useEffect(() => {
    async function prepareApp() {
      SplashScreen.preventAutoHideAsync();
      if (currentLocation == null) {
        getLocation();
      } else if (!authState.loading) {
        await SplashScreen.hideAsync()
        setAppIsReady(true);
      }
    }
    prepareApp();
  }, [currentLocation, authState.loading]);
  if (!appIsReady) {
    return null; 
  }

  if (authState.authenticated === false) {
    return <Redirect href={"/Login"} />;
  }

  return (
    <Tabs tabBar={(props) => <Footer {...props} navigation={navigation} />}>
      <Tabs.Screen
        name="index"
        options={{
          headerStyle: { shadowOpacity: 0 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                router.push("/profileSection/Profile")
              }
            >
              <View style={{ paddingHorizontal: 20 }}>
                <User color={Color.Gray.gray600} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/Notification")}>
              <View style={{ paddingHorizontal: 20 }}>
                <Notification color={Color.Gray.gray600} />
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
