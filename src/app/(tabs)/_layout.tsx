

import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "@/components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "@/components/icons/Logo";
import Color from "@/constants/Color";
import { useAuth } from "@/context/AuthContext";
import useLocationStore from "@/lib/store/userLocation";
import * as Updates from "expo-updates";
import SplashScreenAnimated from "../SplashScreenAnimated";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useMutation } from "@tanstack/react-query";
import { checkAccessToken, registerDeviceNotification } from "@/lib/service/mutationHelper";
import * as Location from "expo-location";
import ErrorBoundary from "../ErrorBoundary";
import * as Network from "expo-network";
import NoInternet from "../NoInternet";

type LayoutProps = {
  navigation: any;
};

type LoadingStates = {
  internet: boolean;
  updates: boolean;
  pushNotification: boolean;
  location: boolean;
  fonts: boolean;
};

const PUSH_TOKEN_KEY = "@PushToken";

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getLocation } = useLocationStore();
  const { expoPushToken } = usePushNotifications();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    internet: false,
    updates: false,
    pushNotification: false,
    location: false,
    fonts: false,
  });
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const checkInternetConnection = useCallback(async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
    return networkState.isConnected;
  }, []);

  const handlePushNotifications = useCallback(async (): Promise<void> => {
    setLoadingStates((prev) => ({ ...prev, pushNotification: true }));
    try {
      if (expoPushToken?.data) {
        const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        if (storedToken !== expoPushToken.data) {
          await sendPushToken({ pushToken: expoPushToken.data });
          await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
        }
        console.log("Push notifications enabled");
      } else {
        console.log("Push notifications not available or permission denied");
      }
    } catch (error) {
      console.error("Error handling push notifications:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, pushNotification: false }));
    }
  }, [expoPushToken, sendPushToken]);

  const handleLocationPermission = useCallback(async (): Promise<void> => {
    setLoadingStates((prev) => ({ ...prev, location: true }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === Location.PermissionStatus.GRANTED) {
        await getLocation();
        console.log("Location permission granted and location fetched");
      } else {
        console.log("Location permission denied");
      }
    } catch (error) {
      console.error("Error handling location permission:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, location: false }));
    }
  }, [getLocation]);

  const prepareApp = useCallback(async () => {
    try {
      const isOnline = await checkInternetConnection();

      if (!isOnline) {
        console.log("No internet connection. Skipping app preparation.");
        return;
      }
      setLoadingStates((prev) => ({ ...prev, internet: false }));

      if (!__DEV__) {
        setLoadingStates((prev) => ({ ...prev, updates: true }));
        try {
          const updateCheck = await Promise.race([
            Updates.checkForUpdateAsync(),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Update check timed out")),
                5000,
              ),
            ),
          ]);

          if (
            updateCheck &&
            typeof updateCheck === "object" &&
            "isAvailable" in updateCheck
          ) {
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
          setLoadingStates((prev) => ({ ...prev, updates: false }));
        }
      }

      // Handle push notifications first
      await handlePushNotifications();

      // Then handle location permission
      await handleLocationPermission();
    } catch (error) {
      console.error("Error preparing app:", error);
    } finally {
      setAppIsReady(true);
    }
  }, [
    checkInternetConnection,
    handlePushNotifications,
    handleLocationPermission,
  ]);

  useEffect(() => {
    prepareApp();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(checkInternetConnection, 5000);
    return () => clearInterval(intervalId);
  }, [checkInternetConnection]);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkAccessToken();
      setIsAuthenticated(isValid);
      if (!isValid) {
        router.replace('/(auth)/Login');
      }
    };
    checkAuth();
  }, []);
  
  if (!appIsReady) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (isAuthenticated === false) {
    return <Redirect href="/(auth)/Login" />;
  }

  if (!isConnected) {
    return <NoInternet onPress={Updates.reloadAsync} />;
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
    </ErrorBoundary>
  );
};

export default Layout;
