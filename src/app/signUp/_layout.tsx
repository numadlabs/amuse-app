import React from 'react';
import Header from '../components/layout/Header'

import { Stack } from 'expo-router';

export default function SuLayout() {
  return (
    <>
      <Header title='Sign up' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='PhoneNumber' />
        <Stack.Screen name='Password' />
        <Stack.Screen name='NickName' />
      </Stack>
    </>
  );
}
