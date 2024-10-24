import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../ui/Button';

interface CartButtonProps {
  quantity: number;
  onAddToCart: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ quantity, onAddToCart }) => {
  return (
    <View style={styles.container}>
      <Button
        variant={quantity === 0 ? "disabled" : "primary"}
        textStyle={quantity === 0 ? "disabled" : "primary"}
        disabled={quantity === 0}
        onPress={onAddToCart}
        style={styles.button}
      >
        Add to Cart
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});

export default CartButton;