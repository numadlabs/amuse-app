import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FpLayout() {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
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
