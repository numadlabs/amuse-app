  import React, { useState } from 'react';
  import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
  import { useLocalSearchParams, Stack, useRouter } from 'expo-router'; 
  import { Add, ArrowLeft, Minus } from 'iconsax-react-native';
  import Color from '@/constants/Color';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import Button from '@/components/ui/Button';
  import { useMenuStore } from '@/lib/store/menuStore';
  import Animated, { FadeIn } from 'react-native-reanimated';
  import { BODY_1_BOLD, BODY_2_MEDIUM, BODY_2_REGULAR, BUTTON_48, CAPTION_1_REGULAR, H6 } from '@/constants/typography';
  import { LinearGradient } from 'expo-linear-gradient';

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
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);
    const params = useLocalSearchParams<MenuModalParams>();
    const router = useRouter();
    const { addItem } = useMenuStore();

    const imageSource = params.image ? JSON.parse(params.image) : null;

    const handleIncrease = () => setQuantity(prev => prev + 1);
    
    const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const handleAddToCart = () => {
      addItem({
        id: params.id,
        name: params.name,
        image: imageSource,
        price: params.price,
        description: params.description,
        quantity: quantity
      });

      setShowAddedFeedback(true);
      setTimeout(() => {
        setShowAddedFeedback(false);
        router.back();
      }, 1500);
    };

    const calculateTotal = () => {
      const basePrice = parseFloat(params.price?.replace('$', '') || '0');
      return (basePrice * quantity).toFixed(2);
    };

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Color.Gray.gray50} />
            </TouchableOpacity>
          </View>
          
          {showAddedFeedback && (
            <Animated.View 
              entering={FadeIn.duration(200)}
              style={styles.feedbackContainer}
            >
              <Text style={styles.feedbackText}>Added to cart!</Text>
            </Animated.View>
          )}
          
          <ScrollView 
            bounces={false} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {imageSource && (
              <View style={styles.imageWrapper}>
              <View style={styles.blurredImageContainer}>
                <Image
                  source={imageSource}
                  style={styles.blurredImage}
                  blurRadius={200}
                />
              <LinearGradient
                colors={[Color.Gray.gray600, 'rgba(37, 38, 43, 0)', 'rgba(37, 38, 43, 0)', Color.Gray.gray600,]}
                start={{ x: 0.5, y: 0 }}
                style={styles.gradientOverlay}
              />


              <LinearGradient
                colors={[Color.Gray.gray600, 'rgba(37, 38, 43, 0)', 'rgba(37, 38, 43, 0)', Color.Gray.gray600,]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientOverlay}
              />
                
              </View>
              <Image
                source={imageSource}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </View>
            )}
            
            <View style={styles.content}>
              <View style={styles.headerSection}>
                {params.category && (
                  <Text style={styles.category}>
                    {params.category.toUpperCase()}
                  </Text>
                )}
                {params.name && (
                  <Text style={styles.name}>{params.name}</Text>
                )}
              </View>

              <View style={styles.priceSection}>
                {params.price && (
                  <Text style={styles.price}>{params.price}</Text>
                )}
                <Text style={styles.totalPrice}>
                  Total: ${calculateTotal()}
                </Text>
              </View>

              {params.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.description}>{params.description}</Text>
                </View>
              )}

              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  onPress={handleDecrease} 
                  style={[
                    styles.quantityButton,
                    quantity === 1 && styles.quantityButtonDisabled
                  ]}
                >
                  <Minus size={24} color={Color.Gray.gray50} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={handleIncrease} 
                  style={styles.quantityButton}
                >
                  <Add size={24} color={Color.Gray.gray50} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.orderButtonContainer}>
            <Button
              variant="primary"
              textStyle="primary"
              size="default"
              style={styles.orderButton}  
              onPress={handleAddToCart}
            >
              Add to Cart - ${calculateTotal()}
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
    header: {
      height: 56,
      paddingHorizontal: 16,
      paddingVertical: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: "transparent",
      zIndex: 2,
    },
    backButton: {
      position: "absolute",
      left: 16,
      padding: 8,
    },
    feedbackContainer: {
      position: 'absolute',
      top: 80,
      left: 20,
      right: 20,
      backgroundColor: Color.Gray.gray100,
      padding: 16,
      borderRadius: 8,
      zIndex: 1000,
      alignItems: 'center',
    },
    feedbackText: {
      ...BODY_2_MEDIUM,
      color: Color.base.White,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    imageWrapper: {
      alignSelf: 'center',
      width: SCREEN_WIDTH * 0.65,
      height: SCREEN_WIDTH * 0.65,
      marginVertical: 40,
      position: 'relative',
    },
    blurredImageContainer: {
      position: 'absolute',
      width: '140%',
      height: '140%',
      top: '-20%',
      left: '-20%',
      overflow: 'hidden',
    },
    blurredImage: {
      width: '120%',
      height: '120%',
      opacity: 1,
      borderRadius: 16,
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    mainImage: {
      width: '100%',
      height: '100%',
      borderRadius: 16,
      position: 'relative',
      zIndex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
      backgroundColor: "transparent",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    headerSection: {
      marginBottom: 16,
    },
    category: {
      ...CAPTION_1_REGULAR,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 8,
      textAlign: 'center',
      color: Color.Gray.gray50,
    },
    name: {
      ...H6,
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
      ...BODY_1_BOLD,
      color: Color.base.White,
    },
    totalPrice: {
      ...BODY_2_MEDIUM,
      color: Color.Gray.gray200,
      marginTop: 4,
    },
    descriptionContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: Color.Gray.gray300,
    },
    descriptionTitle: {
      ...BODY_1_BOLD,
      color: Color.Gray.gray50,
      marginBottom: 8,
      letterSpacing: 0.2,
      textAlign: 'center',
    },
    description: {
      ...BODY_2_REGULAR,
      lineHeight: 22,
      color: Color.Gray.gray200,
      textAlign: 'center',
    },
    quantityContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 24,
      gap: 16,
    },
    quantityButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Color.Gray.gray50,
      backgroundColor: "transparent",
    },
    quantityButtonDisabled: {
      opacity: 0.5,
    },
    quantityText: {
      ...BODY_1_BOLD,
      color: Color.Gray.gray50,
    },
    orderButtonContainer: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
      zIndex: 2,
    },
    orderButton: {
      width: "100%",
    },
  });