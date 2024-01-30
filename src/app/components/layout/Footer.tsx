import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Home2, Map1, ScanBarcode } from 'iconsax-react-native'

function BottomTab() {
  return (
    
      <View className={'flex justify-between mx-auto flex-row w-[375px]  h-20 relative'}>
        <View className='flex justify-center items-center pb-4 pl-12 pt-1 gap-y-1'>
          <Home2 size={24} color='#212121' />
          <Text className='text-baseBlack'>Home</Text>
        </View>

        <TouchableOpacity>
          <View>
            <View className='relative mx-auto bottom-[40px] p-4 w-[64px] h-[64px] flex items-center rounded-full bg-baseBlack'>
              <ScanBarcode size={32} color='#FFFFFF' />
            </View>
          </View>
        </TouchableOpacity>

        <View className='flex justify-center items-center pb-4 pr-12 pt-1 gap-y-1'>
          <Map1 />
          <Text>Map</Text>
        </View>
      </View>
  
  )
}

export default BottomTab