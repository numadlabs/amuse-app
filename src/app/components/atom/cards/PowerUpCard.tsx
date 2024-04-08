import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { RestaurantType } from '@/app/lib/types'
import PowerUpLogo from '../../icons/PowerUpLogo'
import Color from '@/app/constants/Color'
import PowerUpStripes from '../../icons/PowerUpStripes'


interface PowerUpCardProp {
  title: string,
  date: string,
  onPress: () => void
}
const PowerUpCard: React.FC<PowerUpCardProp> = ({ title, date, onPress }) => {
  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={onPress}>
        <View style={styles.stripesContainer}>
          <PowerUpStripes />
        </View>
        <View style={{padding:12}}>
        <PowerUpLogo />
        <View style={{ gap: 8, marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 14, color: Color.Gray.gray600, }}>{title}</Text>
        </View>

        </View>
      
      </TouchableOpacity>

    </View>
  )
}

export default PowerUpCard

const styles = StyleSheet.create({
  container: {
    height: 164,
    ...Platform.select({
      ios: {
        shadowColor: Color.Gray.gray500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 12
      },
      android: {
        elevation: 12,
      },
    }),
    width: 164,
    backgroundColor: Color.base.White,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: Color.Gray.gray50,
    borderWidth:1
  },
  stripesContainer: {
    position: 'absolute',
    right: 0,
    
 
  }
})