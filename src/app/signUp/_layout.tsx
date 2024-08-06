import React from 'react';
import Header from '../components/layout/Header'
import { Stack } from 'expo-router';
import { Modal } from 'react-native-paper';
import { Platform, SafeAreaView, StatusBar } from 'react-native';

export default function SuLayout() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <Header title='Sign up' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Email' />
        <Stack.Screen name='Otp' options={{presentation: "modal"}}/>
        <Stack.Screen name='Password' />
        <Stack.Screen name='NickName' />
      </Stack>
    </SafeAreaView>
  );
}