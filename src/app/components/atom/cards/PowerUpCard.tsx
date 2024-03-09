import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { RestaurantType } from '@/app/lib/types'
import PowerUpLogo from '../../icons/PowerUpLogo'
import Color from '@/app/constants/Color'


interface PowerUpCardProp {
  title: string,
  date: string,
  onPress: () => void
}
const PowerUpCard: React.FC<PowerUpCardProp> = ({ title, date, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <PowerUpLogo />
        <View style={{gap:8, marginTop:20}}>
          <Text style={{ fontWeight: 'bold', fontSize: 14, color: Color.Gray.gray600,  }}>{title}</Text>
          <Text>{date}</Text>
        </View>

      </TouchableOpacity>
    </View>
  )
}

export default PowerUpCard

const styles = StyleSheet.create({
  container: {
    height:164,
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    width: 164,
    padding: 12,
    elevation: 2,
    backgroundColor: Color.base.White,
    borderRadius: 16,
  }
})