import React from 'react';
import Header from '../components/layout/Header'

import { Stack } from 'expo-router';
import { Modal } from 'react-native-paper';

export default function SuLayout() {
  return (
    <>
      <Header title='Sign up' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='PhoneNumber' />
        <Stack.Screen name='Otp' options={{presentation: "modal"}}/>
        <Stack.Screen name='Password' />
        <Stack.Screen name='NickName' />
      </Stack>
    </>
  );
}
