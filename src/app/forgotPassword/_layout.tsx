import React from 'react';
import Header from '@/app/components/layout/Header';
import Steps from '@/app/components/atom/Steps';
import { Slot, Stack } from 'expo-router';

export default function FpLayout() {
  return (
    <>
      <Header title='Forgot password?' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ForgotPassword' />
        <Stack.Screen name='VerificationCode' />
        <Stack.Screen name='NewPassword' />
        <Stack.Screen name='Success' />
      </Stack>
    </>
  );
}
