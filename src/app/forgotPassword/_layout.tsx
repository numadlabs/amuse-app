import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "@/constants/Color";

export default function FpLayout() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Email" />
          <Stack.Screen name="VerificationCode" />
          <Stack.Screen name="NewPassword" />
          <Stack.Screen name="Success" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </>
  );
}
