import React from 'react';
import { Stack, router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import Color from '../constants/Color';
import { ArrowLeft } from 'iconsax-react-native';

const _layout = () => {
  return (
    <>
      {/* Stack navigator with custom screen options */}
      <Stack
        screenOptions={{
          // Custom headerLeft with a back button
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <View>
                <ArrowLeft color={Color.Gray.gray50} />
              </View>
            </TouchableOpacity>
          ),
          // Empty header title
          headerTitle: '',
          // Custom header style
          headerStyle: { backgroundColor: Color.Gray.gray600 }
        }}
      >
        {/* Defining different screens in the stack */}
        <Stack.Screen name='Email'/>
        <Stack.Screen name='Area'/>
        <Stack.Screen name='Otp' options={{presentation: 'modal'}}/>
        <Stack.Screen name='Birthday'/>
        {/* Success screen with header hidden */}
        <Stack.Screen options={{ headerShown: false }} name='Success'/>
      </Stack>
    </>
  );
};

export default _layout;
