import React from 'react'
import { View, Text } from 'react-native'

function Divider() {
    return (
        <View className='flex-row justify-between items-center'>
            <View className='border border-gray50'></View>
            <Text className='text-gray400'>or</Text>
            <View className='border border-gray50'></View>
        </View>
    )
}

export default Divider