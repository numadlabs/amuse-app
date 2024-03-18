import { View, Text } from 'react-native'
import React from 'react'

interface PrefixCardProps{
  isVisible: boolean;
  onClose: () => void;
}
const PrefixCard:React.FC<PrefixCardProps> = ({isVisible, onClose}) => {
  return (
    <View>
      <Text>PrefixCard</Text>
    </View>
  )
}

export default PrefixCard