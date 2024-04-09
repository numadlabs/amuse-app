import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Color from '../../constants/Color'
import BalanceStripes from '../icons/BalanceStripes'




interface BalanceProps{
  amount?: number
}
const Balance: React.FC<BalanceProps> = ({amount}) => {

  const truncatedAmount = amount !== 0 ? amount?.toString().substring(0, 6) : "0.0000";

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <Image style={{ width: 28, height: 28 }} source={require('@/public/images/Bitcoin.png')} />
            <Text style={styles.balanceAmount}>{truncatedAmount}
            <Text style={{lineHeight:16,marginLeft:4, fontSize:20, fontWeight:'400', color:Color.Gray.gray400}}>
            ≈$1.00</Text></Text>
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
    color: Color.Gray.gray600,
    fontWeight:'300'
  },
  balanceStripesContainer: {
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
  }
})

export default Balance
