import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'; 
import { Add, ArrowLeft, Minus } from 'iconsax-react-native';
import Color from '@/constants/Color';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';

interface MenuModalParams extends Record<string, string> {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75; 

export default function MenuModal() {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const params = useLocalSearchParams<MenuModalParams>();
  const router = useRouter(); 

  const imageSource = params.image ? JSON.parse(params.image) : null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.container1}>
          <TouchableOpacity onPress={() => router.back()} style={styles.icon}>
            <ArrowLeft size={24} color={Color.Gray.gray50} />
          </TouchableOpacity>
        </View>
        
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {imageSource && (
            <View style={styles.imageContainer}>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
          
          <View style={styles.content}>
            <View style={styles.headerSection}>
              {params.category && (
                <Text style={styles.category}>{params.category.toUpperCase()}</Text>
              )}
              {params.name && <Text style={styles.name}>{params.name}</Text>}
            </View>

            <View style={styles.priceSection}>
              {params.price && (
                <Text style={styles.price}>{params.price}</Text>
              )}
            </View>

            {params.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{params.description}</Text>
              </View>
            )}
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
              <Minus size={24} color={Color.Gray.gray50} ></Minus>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
              <Add size={24} color={Color.Gray.gray50}></Add>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.orderButtonContainer}>
          <Button
            variant="primary"
            textStyle="primary"
            size="default"
            style={styles.orderButton}
          >
            Order
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  container1: {
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.Gray.gray600,
  },
  imageContainer: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    position: 'relative',
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: Color.Gray.gray500,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 0, 
  },
  headerSection: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Color.Gray.gray50,
    marginBottom: 8,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  priceSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: Color.base.White,
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Color.Gray.gray300,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Color.Gray.gray50,
    marginBottom: 8,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: Color.Gray.gray200,
    textAlign: 'center',
  },
  icon: {
    position: "absolute",
    left: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButton: {
    width: "100%",
  },
  quantityContainer: {
    backgroundColor: Color.Gray.gray500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    backgroundColor: Color.Gray.gray500,
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: Color.Gray.gray50,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 16, 
    color: Color.Gray.gray50,
  },
  category: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center', 
    color: Color.Gray.gray50,
  },
});
