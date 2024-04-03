import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ArrowDown2 } from 'iconsax-react-native'
import Color from '@/app/constants/Color'
import PrefixPopup from '../../(feedback)/PreFixPopup'
import { useQuery, useQueryClient } from 'react-query'
import Animated, { useSharedValue } from 'react-native-reanimated'


interface PreFixProps {
  onClose: () => void
}
const PrefixCard: React.FC<PreFixProps> = ({ onClose }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const height = useSharedValue(200)

  const cards = [
    {
      prefix: "+976",
      name: "Mongolia"
    },
    {
      prefix: "+971",
      name: "UAE"
    },
  ]

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
    console.log(cards)
  };

  const handlePrefixSelection = (selectedPrefix) => {
    // Do something with the selected prefix, e.g., pass it to a parent component
    console.log("Selected prefix:", selectedPrefix);
    // Close the popup
    togglePopup();
  };


  return (
    <>
      <TouchableOpacity onPress={togglePopup}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontWeight: '400', fontSize: 16, lineHeight: 20 }}>
            {cards[0].prefix}
          </Text>
          <ArrowDown2 size={16} color={Color.Gray.gray600} />
        </View>
      </TouchableOpacity>

      <View style={{ position:'absolute' }}>
        <PrefixPopup
          isVisible={isPopupVisible}
          cards={cards}
          onClose={() => setPopupVisible(false)}
          onSelect={handlePrefixSelection}
        />
      </View>

    </>
  )
}

export default PrefixCard

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal'
  }
})