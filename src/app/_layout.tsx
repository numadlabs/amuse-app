import React, { useCallback } from 'react';
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/ToasterConfig";
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
            <Stack.Screen name="SplashScreenAnimated" />
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
        </View>
      </AuthProvider>
    </QueryClientProvider>
  );
}