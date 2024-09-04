import React, { useCallback, useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/ToasterConfig";
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ErrorBoundary from './ErrorBoundary';
import NetInfo from "@react-native-community/netinfo";



// Create QueryClient outside of the component to avoid recreating it on each render
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

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
    SoraBold: require("@/public/fonts/Sora-Bold.otf"),
    SoraMedium: require("@/public/fonts/Sora-Medium.otf"),
    SoraSemiBold: require("@/public/fonts/Sora-SemiBold.otf"),
  });


  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkInternetConnection = useCallback(async () => {
    const netInfo = await NetInfo.fetch();
    setIsConnected(netInfo.isConnected);
  }, []);

  useEffect(() => {
    checkInternetConnection();
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [checkInternetConnection]);

  if (isConnected === false) {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No internet connection</Text>
        <TouchableOpacity style={styles.retryButton} onPress={checkInternetConnection}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <StatusBar style="light" />
          <ErrorBoundary>
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
            <Toast config={toastConfig} />
          </ErrorBoundary>
        </View>
      </AuthProvider>
    </QueryClientProvider>
  );
}


const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  offlineText: {
    fontSize: 18,
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