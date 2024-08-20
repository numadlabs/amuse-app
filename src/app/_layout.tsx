import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/ToasterConfig";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import useLocationStore from "@/lib/store/userLocation";
import * as Updates from "expo-updates";
import { Redirect } from "expo-router";
import SplashScreenAnimated from "./SplashScreenAnimated";
import { SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "Index",
};

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
            options={{ presentation: "modal", gestureEnabled: true }}
          />

          {/* <Stack.Screen
            name="(modals)/QrModal"
            options={{ presentation: "modal" }}
          /> */}
          <Stack.Screen
            name="(modals)/MyQrModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen name="PrivacyPolicy" />
          <Stack.Screen name="/profileSection/UpdateScreen" />

          <Stack.Screen name="MyAcards" />
          <Stack.Screen name="Wallet" />
          <Stack.Screen name="TermsAndCondo" />
          <Stack.Screen name="SplashScreenAnimated" />
          <Stack.Screen name="Faq" />
          <Stack.Screen name="Tier" />
          <Stack.Screen name="PerkScreen" />
          <Stack.Screen name="PerkMarket" options={{ presentation: "modal" }} />
          <Stack.Screen name="PowerUp" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="FollowingPerk"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="PerkBuy" options={{ presentation: "modal" }} />
        </Stack>
        <Toast config={toastConfig} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
