import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../components/layout/Header'
import Color from '../constants/Color'

const ProfileEdit = () => {
  return (
    <>
    <Header title='Account'/>
    <View style={styles.body}>
      <Text>ProfileEdit</Text>
    </View>
    </>
  )
}

export default ProfileEdit

const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor:Color.base.White,
    paddingHorizontal:16
  }
})