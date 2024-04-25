import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { RestaurantType } from '@/app/lib/types'
import PowerUpLogo from '../../icons/PowerUpLogo'
import Color from '@/app/constants/Color'
import PowerUpStripes from '../../icons/PowerUpStripes'
import PerkGradient from '../../icons/PerkGradient'
import Button from '../../ui/Button'
import { LinearGradient } from 'expo-linear-gradient'


interface PowerUpCardProp {
  title: string,
  onPress: () => void
}
const PowerUpCard: React.FC<PowerUpCardProp> = ({ title, onPress }) => {
  return (
    <LinearGradient
      colors={[Color.Brand.card.start, Color.Brand.card.end]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <PerkGradient />
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: Color.base.White, }}>{title}</Text>
      </View>

      <Button variant='primary' style={{ width: '26%' }} onPress={onPress}>
        <Text
          style={{
            color: "white",
            fontSize: 11,
            lineHeight: 16,
            fontWeight: "bold",
          }}
        >
          Use
        </Text>
      </Button>
    </LinearGradient>
  )
}

export default PowerUpCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
  stripesContainer: {
    position: 'absolute',
    right: 0,


  }
})