import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import Color from '@/constants/Color';
import { BODY_1_BOLD, CAPTION_1_REGULAR } from '@/constants/typography';
import { useMenuStore } from '@/lib/store/menuStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import Button from '@/components/ui/Button';
import LinearGradient from 'react-native-linear-gradient';

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
      style={styles.container}
    >
      <LinearGradient
        colors={['#242E35EE', '#242E35FF']}
        style={styles.gradient}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>
          <View style={styles.mainContent}>
            <View style={styles.leftSection}>
              <Text style={styles.total}>${getTotalPrice().toFixed(2)} USD</Text>
              <Text style={styles.itemCount}>{getTotalQuantity()} items</Text>
            </View>
            <Button 
              style={styles.CartButton} 
              variant='primary' 
              textStyle="primary" 
              onPress={() => router.push('/Cart')}
            >
              <Text>Go to Cart</Text>
            </Button>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
  },
  gradient: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Color.Gray.gray400
  },
  content: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 8,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    borderRadius: 48,
    height: '100%',
  },
  leftSection: {
    flexDirection: 'column',
    gap: 8,
  },
  itemCount: {
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray50,
  },
  total: {
    ...BODY_1_BOLD,
    color: Color.base.White,
  },
  CartButton: {
    // Your existing button styles
  },
});

export default CartSummary;