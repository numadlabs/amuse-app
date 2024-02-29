import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { EmojiHappy, Scroll } from 'iconsax-react-native'
import Color from '../../constants/Color'
import { useAuth } from '@/app/context/AuthContext'

const mockCards = [
  {
    id: 1,
    name: 'sushitrash',
    image: require('../../../public/images/Image1.png'), // Use require for local images
    added: false,
  },
  {
    id: 2,
    name: 'kekkai genkai',
    image: require('../../../public/images/Image2.png'), // Adjust image paths accordingly
    added: true,
  },
  {
    id: 3,
    name: 'nuas bros remedies',
    image: require('../../../public/images/Image1.png'),
    added: true,
  },
];

const StackedCard = () => {
  const { authState } = useAuth();
  
  return (
    <View style={styles.cardsContainer}>
      {mockCards.length === 0 ? (
        <View style={styles.container1}>
          <View style={{ justifyContent: 'center' }}>
            <EmojiHappy size={48} color={Color.Gray.gray400} />
          </View>
          <Text>Collect A-cards to start earning.</Text>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add A-cards</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {mockCards.map((card) => (
            <View style={{ width: '100%' }} key={card.id}>
              <View style={styles.aCardContainer}>
                <Text style={styles.titleText}>{card.name}</Text>
                <Image source={card.image} style={styles.cardImage} />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

export default StackedCard

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: Color.Gray.gray50,
    height: '100%',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingHorizontal: 42
  },
  cardsContainer: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: Color.Gray.gray50,
    height: '100%',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    overflow: 'hidden'
  },
  container1: {
    marginTop: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%'
  },
  cardContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'red'
  },
  aCardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Color.Gray.gray300
  },
  titleText: {
    color: Color.Gray.gray400,
    fontSize: 16
  },
  cardImage: {
    width: 300, // Adjust width and height as per your design
    height: 300,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 48,
    marginTop: 24
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 13,
    fontWeight: 'bold'
  }
})
