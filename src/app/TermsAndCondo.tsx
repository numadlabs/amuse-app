import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Header from './components/layout/Header'
import Color from './constants/Color'

const TermsAndCondo = () => {
  return (
    <>
      <Header title="Terms and Conditions" />
      <View style={styles.container}>
        <Text>TermsAndCondo</Text>
      </View>
    </>
  )
}

export default TermsAndCondo

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.base.White,
    flex: 1
  }
})