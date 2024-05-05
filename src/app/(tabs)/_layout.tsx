import React, { useEffect, useState } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import Footer from "../components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "../components/icons/Logo";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import useLocationStore from "../lib/store/userLocation";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Layout = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const { getLocation, currentLocation } = useLocationStore();
  const [notification, setNotification] = useState("")

  useEffect(() => {
    async function prepareApp() {
      SplashScreen.preventAutoHideAsync();
      if (currentLocation == null) {
        getLocation();
      } else if (!authState.loading) {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }
    prepareApp();

    const checkNotification = async () => {
      const storedCard = await AsyncStorage.getItem("restaurantCard");
      if (storedCard) {
        setNotification(storedCard);
       
        await AsyncStorage.removeItem("restaurantCard");
      }
    };

    // Call the function to check for the notification
    checkNotification();

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
                  ) : (
                    ""
                  )}

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
