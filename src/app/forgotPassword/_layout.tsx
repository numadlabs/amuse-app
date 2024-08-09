import React from "react";
import { Stack } from "expo-router";

export default function FpLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Email" />
        <Stack.Screen name="VerificationCode" />
        <Stack.Screen name="NewPassword" />
        <Stack.Screen name="Success" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
