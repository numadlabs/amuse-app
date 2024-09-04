import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
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
import ErrorBoundary from "../ErrorBoundary";
import { BODY_1_REGULAR, BUTTON_48 } from "@/constants/typography";

type LayoutProps = {
  navigation: any;
};

type LoadingStates = {
  updates: boolean;
  pushNotification: boolean;
  fonts: boolean;
  connection: boolean;
};

const PUSH_TOKEN_KEY = '@PushToken';

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { getLocation, isLoading, error } = useLocationStore();
  const { expoPushToken } = usePushNotifications();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    updates: false,
    pushNotification: false,
    fonts: false,
    connection: true,
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

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
    if (!isConnected) {
      throw new Error("No internet connection");
    }

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

      setAppIsReady(true);
    } catch (error) {
      console.error("Error preparing app:", error);
      throw error;
    }
  }, [isConnected, expoPushToken, sendPushToken]);

  useEffect(() => {
    const checkConnectionAndPrepare = async () => {
      setLoadingStates(prev => ({ ...prev, connection: true }));
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);
      setLoadingStates(prev => ({ ...prev, connection: false }));
      
      if (netInfo.isConnected) {
        try {
          await prepareApp();
        } catch (error) {
          console.error("Failed to prepare app:", error);
        }
      }
    };

    checkConnectionAndPrepare();
  }, [prepareApp]);

  useEffect(() => {
    setLoadingStates(prev => ({ ...prev, fonts: !fontsLoaded }));
  }, [fontsLoaded]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setAppIsReady(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRetry = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, connection: true }));
    try {
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);
      if (netInfo.isConnected) {
        await prepareApp();
      } else {
        throw new Error("No internet connection");
      }
    } catch (error) {
      console.error("Error during retry:", error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, connection: false }));
    }
  }, [prepareApp]);

  if (loadingStates.connection || loadingStates.updates || loadingStates.pushNotification || !fontsLoaded) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (!isConnected || !appIsReady) {
    return (
      <ErrorBoundary>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No internet connection. Please check your network settings and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ErrorBoundary>
    );
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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.Gray.gray600,
    padding: 20,
  },
  errorText: {
    ...BODY_1_REGULAR,
    color: Color.base.White,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Color.Gray.gray300,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    ...BUTTON_48,
    color: Color.base.White,
  },
});

export default Layout;