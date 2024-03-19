import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ArrowDown2 } from 'iconsax-react-native'
import Color from '@/app/constants/Color'
import PrefixPopup from '../../(feedback)/PreFixPopup'
import { useQuery, useQueryClient } from 'react-query'
import { getPrefixAndCountry } from '@/app/lib/service/queryHelper'

const PrefixCard = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const queryClient = useQueryClient()

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["countryPrefix"],
    queryFn: () => {
      return getPrefixAndCountry();
    }
  });

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
    console.log(cards)
  };

  return (
    <TouchableOpacity onPress={togglePopup}>
      <View style={styles.container}>
        <Text style={styles.text}>+971</Text>
        <ArrowDown2 color={Color.Gray.gray600} />
      </View>
      {isPopupVisible && (
        <View>
          {cards.map((card, index) => (
            <PrefixPopup
              key={index}
              isVisible={isPopupVisible}
              onClose={togglePopup}
              countries={cards}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default PrefixCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal'
  }
})