import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Color from '../../constants/Color'
import BalanceStripes from '../icons/BalanceStripes'

const Balance = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>0.00 BTC</Text>
        </View>
        <View style={styles.balanceStripesContainer}>
          <BalanceStripes />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
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
  },
  balanceLabel: {
    fontSize: 12,
    color: Color.Gray.gray400
  },
  balanceAmount: {
    fontSize: 28,
    color: Color.Gray.gray600
  },
  balanceStripesContainer: {
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
  }
})

export default Balance
