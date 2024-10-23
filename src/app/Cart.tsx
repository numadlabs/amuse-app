import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Color from '@/constants/Color';
import { useMenuStore } from '@/lib/store/menuStore';
import { Minus, Add, MinusCirlce, CloseCircle } from 'iconsax-react-native';
import { BODY_1_BOLD, BODY_2_MEDIUM, BUTTON_48, CAPTION_1_REGULAR } from '@/constants/typography';
import Header from '@/components/layout/Header';

const Cart = () => {
  const { 
    selectedItems, 
    removeItem, 
    updateItemQuantity,
    getTotalPrice,
    clearItems
  } = useMenuStore();

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateItemQuantity(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateItemQuantity(itemId, currentQuantity - 1);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add some delicious items to get started</Text>
    </View>
  );

  const formatPrice = (price: string) => {
    return parseFloat(price.replace('$', '')).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Header title='Cart'/>
      {/* <Text style={styles.title}>Your Order</Text> */}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {selectedItems.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <View style={styles.itemsContainer}>
              {selectedItems.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemImageContainer}>
                    <Image source={item.image} style={styles.itemImage} />
                  </View>
                  
                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <TouchableOpacity 
                        onPress={() => handleRemoveItem(item.id)}
                        style={styles.removeButton}
                      >
                        <CloseCircle size={24} color={Color.Gray.gray50} />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.itemPrice}>
                      ${formatPrice(item.price)}
                    </Text>
                    
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        onPress={() => handleDecreaseQuantity(item.id, item.quantity || 1)}
                        style={styles.quantityButton}
                      >
                        <Minus size={20} color={Color.base.White} />
                      </TouchableOpacity>
                      
                      <Text style={styles.quantityText}>
                        {item.quantity || 1}
                      </Text>
                      
                      <TouchableOpacity 
                        onPress={() => handleIncreaseQuantity(item.id, item.quantity || 1)}
                        style={styles.quantityButton}
                      >
                        <Add size={20} color={Color.base.White} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ${getTotalPrice().toFixed(2)}
                </Text>
              </View>
              {/* Add more summary rows here (tax, delivery, etc.) if needed */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${getTotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearItems}
              >
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={() => {
                  // Handle checkout logic
                }}
              >
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    ...BODY_1_BOLD,
    color: Color.base.White,
    marginBottom: 24,
  },
  itemsContainer: {
    gap: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Color.Gray.gray400,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    flex: 1,
  },
  itemPrice: {
    ...BODY_2_MEDIUM,
    color: Color.Gray.gray50,
  },
  removeButton: {
    padding: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: Color.Gray.gray400,
    borderRadius: 8,
    padding: 8,
  },
  quantityText: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    minWidth: 24,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...BODY_2_MEDIUM,
    color: Color.Gray.gray50,
  },
  summaryValue: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Color.Gray.gray400,
  },
  totalLabel: {
    ...BODY_1_BOLD,
    color: Color.base.White,
  },
  totalValue: {
    ...BODY_1_BOLD,
    color: Color.base.White,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  clearButton: {
    flex: 1,
    backgroundColor: Color.Gray.gray400,
    borderRadius: 48,
    padding: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    ...BUTTON_48,
    color: Color.base.White,
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: Color.Gray.gray100,
    borderRadius: 48,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    ...BUTTON_48,
    color: Color.base.White,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    ...BODY_1_BOLD,
    color: Color.base.White,
    marginBottom: 8,
  },
  emptySubtext: {
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray50,
    textAlign: 'center',
  },
});

export default Cart;