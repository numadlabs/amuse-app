import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Color from '../../constants/Color'
import BalanceStripes from '../icons/BalanceStripes'

const Balance = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <Image style={{ width: 28, height: 28 }} source={require('@/public/images/Bitcoin.png')} />
            <Text style={styles.balanceAmount}>0.0000</Text>
          </View>

        </View>
        <View style={styles.balanceStripesContainer}>
          <BalanceStripes />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.base.White,
    shadowColor: Color.Gray.gray400,

    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 16,

    marginTop: 32
  },
  container1: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: 'hidden',
    borderRadius: 16,
  },
  balanceInfo: {
    flex: 1,
    gap:4
  },
  balanceLabel: {
    fontSize: 12,
    color: Color.Gray.gray400,
    fontWeight:'bold'
  },
  balanceAmount: {
    fontSize: 28,
    lineHeight: 36,
    color: Color.Gray.gray600
  },
  balanceStripesContainer: {
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
  }
})

export default Balance
