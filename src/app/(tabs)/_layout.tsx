import React, { useCallback, useEffect, useState } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import Footer from "../components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "../components/icons/Logo";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import useLocationStore from "../lib/store/userLocation";

SplashScreen.preventAutoHideAsync();

const Layout = ({ navigation }) => {
  const { authState, onLogout } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation, currentLocation } = useLocationStore();

  const handleSplashScreen = async () => {
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (currentLocation == null) {
      getLocation();
    } else if (!authState.loading) {
      handleSplashScreen();
    }
  }, [currentLocation, authState.loading]);

  if (authState.authenticated == false) {
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
                // onLogout()
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
