import React from 'react'
import { Stack, router } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import Color from '../constants/Color'
import { ArrowLeft } from 'iconsax-react-native'

const _layout = () => {
  return (
    <>
   <Stack
    screenOptions={{headerLeft: () => (
          <TouchableOpacity onPress={router.back}>
            <View>
              <ArrowLeft color={Color.Gray.gray50} />
            </View>
          </TouchableOpacity>
        ), headerTitle: '', headerStyle: {backgroundColor: Color.Gray.gray600}}}>
    <Stack.Screen name='Email'/>
    <Stack.Screen name='Area'/>
    <Stack.Screen name='Birthday'/>
    <Stack.Screen options={{headerShown:false}} name='Success'/>
   </Stack>
   </>
  )
}

export default _layout