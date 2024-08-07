import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Import } from 'iconsax-react-native'


interface TransactionCardProps {
  amount: number,
  type: string,
  createdAt: string
}
const TransactionCard: React.FC<TransactionCardProps> = ({amount, type, createdAt}) => {
  return (
    <View>
      <Import/>
      <Text style={{fontWeight: 'bold', fontSize: 16, lineHeight: 24}}>{type}</Text>
      <Text>{amount} ALYS</Text>
      <Text>{createdAt}</Text>
      <Text>TransactionCard</Text>
    </View>
  )

}

export default TransactionCard


const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
  }
})