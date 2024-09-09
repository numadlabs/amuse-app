import React from "react";
import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "@/constants/Color";

export default function SuLayout() {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: Color.Gray.gray600}}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Email" />
        <Stack.Screen name="Otp" options={{ presentation: "modal" }} />
        <Stack.Screen name="Password" />
        <Stack.Screen name="NickName" />
      </Stack>
      </SafeAreaView>
    </>
  );
}
