import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRestaurantById } from './lib/service/queryHelper'
import APassCard from './components/atom/cards/APassCard'
import Button from './components/ui/Button'
import { restaurantKeys, userKeys } from './lib/service/keysHelper'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { height, width } from './lib/utils'
import PowerUpCard from './components/atom/cards/PowerUpCard'
import { LinearGradient } from 'expo-linear-gradient'
import Color from './constants/Color'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PerkScreen = () => {
  const { restaurantId, btcAmount, powerUp } = useLocalSearchParams()

  const queryClient = useQueryClient()

  const { data: card = [], isLoading } = useQuery({
    queryKey: [restaurantKeys.detail],
    queryFn: () => {
      return getRestaurantById(restaurantId as string);
    },
  });

  const handleNavigation = async () => {
    router.back()
    queryClient.invalidateQueries({ queryKey: userKeys.info });

    // Store card information using AsyncStorage
    try {
      await AsyncStorage.setItem('restaurantCard', JSON.stringify(card));
      console.log('Card information stored successfully.');
    } catch (error) {
      console.log('Error storing card information:', error);
    }
  }

  return (
    <Animated.View entering={SlideInDown.springify().damping(20)} style={styles.container}>
      {isLoading && (
        <View style={{ flex:1,justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>

      )
      }

      {!isLoading && card && (
        <>
          <APassCard
            name={card.name}
            image={card.logo}
            onPress={() => ""}
            category={card.category}
            hasBonus={card.hasBonus}
            visitCount={card.visitCount}
          />

          <Animated.View style={{ gap: 16, marginBottom: 50 }}
            entering={SlideInDown.springify().damping(20).delay(200)}>
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, justifyContent: 'center', height: height / 6, gap: 12, alignContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Color.Gray.gray400, }}>
              <Text style={{ fontWeight: '700', fontSize: 24, lineHeight: 32, color: Color.base.White }}>
                +$1 of BTC
              </Text>
              <Text style={{ fontWeight: '400', fontSize: 14, lineHeight: 18, color: Color.Gray.gray50 }}>
                Check-in successful.
              </Text>
            </LinearGradient>
            {powerUp ?
             <View style={{height:height/8}}>

          
              <PowerUpCard title={powerUp as string} onPress={() => router.navigate('/PowerUp')} />
              </View>
            : <View style={{height:height/8}}/>}
          </Animated.View>
          <Button variant='primary' size='default' textStyle='primary' onPress={handleNavigation} style={{ bottom: 30 }}>
            <Text>
              Confirm
            </Text>
          </Button>
        </>
      )}
    </Animated.View>
  )
}

export default PerkScreen

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    paddingHorizontal: 16,
    flex: 1,
    gap: 16
  },
  cardContainer: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: "100%",
    bottom: 30,
  },
})
