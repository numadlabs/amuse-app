import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { EmojiHappy } from 'iconsax-react-native'
import Color from '../../constants/Color'
import { router } from 'expo-router'


const StackedCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={{ justifyContent: 'center' }}>
          <EmojiHappy size={48} color={Color.Gray.gray400} />
        </View>
        <Text>Collect A-cards to start earning.</Text>
        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add A-cards</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default StackedCard

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: Color.Gray.gray50,
    height: '100%',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingHorizontal: 42
  },
  container1: {
    marginTop: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  titleText: {
    color: Color.Gray.gray400,
    fontSize: 16
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 48,
    marginTop: 24
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 13,
    fontWeight: 'bold'
  }
})