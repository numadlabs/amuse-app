import React, { useCallback, useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/ToasterConfig";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from "expo-updates";
import * as Network from 'expo-network';
import NoInternet from './NoInternet';
import * as Sentry from '@sentry/react-native';
import { SERVER_SETTING } from '@/constants/serverSettings';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ErrorBoundary from './ErrorBoundary';


// Initialize Sentry
Sentry.init({
  dsn: SERVER_SETTING.SENTRY_DSN_LINK,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Keep SplashScreen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Main Layout Component
const Layout = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const checkInternetConnection = useCallback(async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
    return networkState.isConnected;
  }, []);


  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
    SoraBold: require("@/public/fonts/Sora-Bold.otf"),
    SoraMedium: require("@/public/fonts/Sora-Medium.otf"),
    SoraSemiBold: require("@/public/fonts/Sora-SemiBold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    const intervalId = setInterval(checkInternetConnection, 5000); 
    return () => clearInterval(intervalId);
  }, [checkInternetConnection]);



  if (!isConnected) {
    return <NoInternet onPress={Updates.reloadAsync}/>;
  }

  return (
    <>

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>


            <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "transparent",
                  },
                }}
              >
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
                <Stack.Screen name="BugReport" />
                <Stack.Screen name="Faq" />
                <Stack.Screen name="Tier" />
                <Stack.Screen name="PerkScreen" />
                <Stack.Screen name="NoInternet" />
                <Stack.Screen
                  name="PerkMarket"
                  options={{ presentation: "modal" }} />
                <Stack.Screen
                  name="AlreadyCheckedIn"
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
              <Toast config={toastConfig} />
            </View>

          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sentry.wrap(Layout);