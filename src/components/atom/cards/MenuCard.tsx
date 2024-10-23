import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import Color from '@/constants/Color'
import { BODY_1_BOLD, BODY_2_MEDIUM, CAPTION_1_REGULAR } from '@/constants/typography';

interface MenuItem {
  name: string;
  image: number;
  price: string;
  description: string;
  onPress: () => void;
}

const MenuCard:React.FC<MenuItem> = ({name, image, price, description, onPress}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.menuItemContainer}
        onPress={onPress}
      >
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemImageContainer}>
            <Image
              source={image}
              style={styles.menuItemImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.menuItemDetails}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>{name}</Text>
              <Text style={styles.menuItemPrice}>{price}</Text>
            </View>
            <Text style={styles.menuItemDescription}>{description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default MenuCard

const styles = StyleSheet.create({
  menuItemContainer: {
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  menuItemContent: {
    flexDirection: 'row',
    gap: 16,
  },
  menuItemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Color.Gray.gray400, // Added background color for image placeholder
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  menuItemDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  menuCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    ...BODY_1_BOLD,
    color: Color.base.White,
    marginBottom: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    flex: 1,
    marginRight: 8,
  },
  menuItemPrice: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    fontWeight: '600',
  },
  menuItemDescription: {
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray50,
  },
})