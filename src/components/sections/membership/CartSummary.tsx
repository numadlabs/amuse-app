// CartSummary.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Color from '@/constants/Color';
import { BODY_1_BOLD, BODY_2_MEDIUM, BUTTON_48 } from '@/constants/typography';
import { ShoppingCart } from 'iconsax-react-native';
import { useMenuStore } from '@/lib/store/menuStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface CartSummaryProps {
  onClose?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CartSummary: React.FC<CartSummaryProps> = ({ onClose }) => {
  const { getTotalQuantity, getTotalPrice } = useMenuStore();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View 
      entering={SlideInDown.springify().damping(15)}
      exiting={SlideOutDown.springify().damping(15)}
      style={[
        styles.container, 
        { paddingBottom: insets.bottom || 16 }
      ]}
    >
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.push('/Cart')}
          activeOpacity={0.7}
        >
          <View style={styles.leftSection}>
            <ShoppingCart size={24} color={Color.base.White} />
            <View style={styles.verticalDivider} />
            <Text style={styles.itemCount}>{getTotalQuantity()} items</Text>
          </View>
          <Text style={styles.total}>${getTotalPrice().toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  content: {
    width: '100%',
    backgroundColor: Color.Gray.gray500,
    borderRadius: 48,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: Color.Gray.gray500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: Color.Gray.gray200,
    opacity: 0.3,
  },
  itemCount: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
  },
  total: {
    ...BODY_1_BOLD,
    color: Color.base.White,
  },
});

export default CartSummary;