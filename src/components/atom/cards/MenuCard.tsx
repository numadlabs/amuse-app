import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Color from '@/constants/Color'
import { BODY_1_BOLD, BODY_2_MEDIUM, CAPTION_1_MEDIUM, CAPTION_1_REGULAR, CAPTION_2_REGULAR } from '@/constants/typography';
import { Add, Minus } from 'iconsax-react-native';

interface MenuItem {
  name: string;
  image: number;
  price: string;
  description: string;
  onPress: () => void;
  onAdd: () => void;
  onMinus: () => void;
}

const MenuCard: React.FC<MenuItem> = ({ name, image, price, description, onPress, onAdd, onMinus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggleQuantityControl = () => {
    const toValue = isExpanded ? 0 : 1;
    
    if (!isExpanded) {
      // When expanding, add first item
      onAdd();
    } else {
      // When collapsing, remove all items
      onMinus();
      setQuantity(1); // Reset quantity
    }
    
    setIsExpanded(!isExpanded);
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    onAdd();
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      onMinus();
    } else {
      toggleQuantityControl(); // Collapse and remove item
    }
  };

  const handleCardPress = () => {
    if (!isExpanded) {
      onPress();
    }
  };

  const quantityControlScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity
      style={styles.menuItemContainer}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <Image
        source={image}
        style={styles.menuItemImage}
        resizeMode="cover"
      />

      <View style={styles.mainContent}>
        <View style={styles.textContent}>
          <Text style={styles.menuItemName}>{name}</Text>
          <Text style={styles.menuItemDescription} numberOfLines={1}>
            {description}
          </Text>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.menuItemPrice}>{price} USD</Text>

          <View style={styles.quantityControlContainer}>
            {isExpanded ? (
              <Animated.View
                style={[
                  styles.quantityControl,
                  { transform: [{ scale: quantityControlScale }] }
                ]}
              >
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={styles.quantityButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Minus size={16} color={Color.base.White} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={styles.quantityButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Add size={16} color={Color.base.White} />
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <TouchableOpacity
                onPress={toggleQuantityControl}
                style={styles.addButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Add size={16} color={Color.base.White} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCard

const styles = StyleSheet.create({
  menuItemContainer: {
    backgroundColor: Color.Gray.gray500,
    borderRadius: 24,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 12,
    gap: 16,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContent: {
    gap: 4,
    paddingRight: 8,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  menuItemName: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    fontSize: 14,
    lineHeight: 18,
  },
  menuItemDescription: {
    ...CAPTION_2_REGULAR,
    color: '#9CA3AF',
  },
  menuItemPrice: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    marginTop: 24,
  },
  quantityControlContainer: {
    alignSelf: 'center',
  },
  addButton: {
    borderRadius: 24,
    backgroundColor: Color.Gray.gray400,
    justifyContent: 'center',
    padding: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.Gray.gray500,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    marginTop: 24,
    padding: 8,
  },
  quantityButton: {
    borderRadius: 20,
    backgroundColor: Color.Gray.gray500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    width: 24,
    textAlign: 'center',
    ...CAPTION_1_MEDIUM,
    color: Color.base.White,
    marginHorizontal: 8,
  },
})