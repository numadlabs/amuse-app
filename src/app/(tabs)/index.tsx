import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Color from '../constants/Color'

const Page = () => {
  return (
   
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
   
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Color.base.White,
  
  }
})
