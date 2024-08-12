import React from "react";
import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Email" />
        <Stack.Screen name="Otp" options={{ presentation: "modal" }} />
        <Stack.Screen name="Password" />
        <Stack.Screen name="NickName" />
      </Stack>
    </>
  );
}
