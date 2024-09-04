import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/ToasterConfig";
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useMutation } from "@tanstack/react-query";
import { registerDeviceNotification } from "@/lib/service/mutationHelper";
import ErrorBoundary from './ErrorBoundary';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const PUSH_TOKEN_KEY = '@PushToken';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
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

  const checkConnection = useCallback(async () => {
    const netInfoState = await NetInfo.fetch();
    setIsConnected(netInfoState.isConnected);
  }, []);

  const OfflineScreen = () => (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>
        No internet connection. Please check your internet settings and try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={checkConnection}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    async function prepareApp() {
      try {
        // Check for updates
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }

        // Handle push notifications
        if (expoPushToken?.data) {
          const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
          if (storedToken !== expoPushToken.data) {
            await sendPushToken({ pushToken: expoPushToken.data });
            await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
          }
        }

        // Check internet connectivity
        await checkConnection();

        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });

        // Simulate a delay to show splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));

        setAppIsReady(true);

        return () => {
          unsubscribe();
        };
      } catch (e) {
        console.warn(e);
      }
    }

    prepareApp();
  }, [expoPushToken, sendPushToken, checkConnection]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return null; // This will keep the splash screen visible
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            {isConnected === false ? (
              <ErrorBoundary>
                <OfflineScreen />
              </ErrorBoundary>
            ) : (
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="restaurants/[id]"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="(modals)/MyQrModal"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen name="PrivacyPolicy" />
                <Stack.Screen name="profileSection/UpdateScreen" />
                <Stack.Screen name="MyAcards" />
                <Stack.Screen name="Wallet" />
                <Stack.Screen name="TermsAndCondo" />
                <Stack.Screen name="Faq" />
                <Stack.Screen name="Tier" />
                <Stack.Screen name="PerkScreen" />
                <Stack.Screen
                  name="PerkMarket"
                  options={{ presentation: "modal" }} />
                <Stack.Screen
                  name="PowerUp"
                  options={{ presentation: "modal" }} />
                <Stack.Screen
                  name="FollowingPerk"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="PerkBuy"
                  options={{ presentation: "modal" }} />
              </Stack>
            )}
            <Toast config={toastConfig} />
          </View>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  offlineText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});