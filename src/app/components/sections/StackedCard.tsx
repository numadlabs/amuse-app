import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Color from "../../constants/Color";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserCard } from "@/app/lib/service/queryHelper";
import useLocationStore from "@/app/lib/store/userLocation";
import { RestaurantType } from "@/app/lib/types";
import APassCard from "../atom/cards/APassCard";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { userKeys } from "@/app/lib/service/keysHelper";
import { LinearGradient } from "expo-linear-gradient";

import SearchGradient from "../icons/SearchGradient";

const StackedCard = () => {
  const cardPositions = useSharedValue(-400);
  const { currentLocation } = useLocationStore();
  const router = useRouter();
  const { data: cards = [], isLoading } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });


  useEffect(() => {
    if (cards && cards.data && cards.data.cards) {
      cardPositions.value = cards.data.cards.length * 1;
    }
  }, [cards, cardPositions]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(cardPositions.value, {
          duration: 400,
        }),
      },
    ],
    zIndex: 999,
    top: cardPositions.value,
    marginBottom: -190
  }));

  const latestCards = cards?.data?.cards.slice(0, 5);


  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.restaurantId}`,
      params: {
       
      },
    });
  };

  console.log(cards)


  return (
    <>
      {cards?.data?.cards.length === 0 ? (
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          start={{ x: 1, y: 0 }}
          end={{ x: 2, y: 1 }}
          style={{
            borderRadius: 32,
            marginBottom: 120
          }}
        >
          <View style={styles.container1}>
            <SearchGradient />
            <Text style={{ textAlign: "center", color: Color.Gray.gray50, fontSize: 12, lineHeight: 16 }}>
              Discover restaurants, add an membership card, and start earning
              rewards every time you check-in at a participating restaurant!
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/SplashScreen")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Explore</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        <Animated.View style={{ flex: 1, overflow: 'hidden', paddingBottom: 230 }}>
          {latestCards?.map((card, index) => (
            <Animated.View
              key={index}
              style={[
                animatedCardStyle,
                {
                  zIndex: latestCards.length - index,
                },
              ]}
            >
              <APassCard
                name={card.name}
                image={card.logo}
                onPress={() => handleNavigation(card)}
                category={card.category}
                hasBonus={card.hasBonus}
                visitCount={card.visitCount}
              />
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </>
  );
};

export default StackedCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray50,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    minHeight: 380,
    maxHeight: 600,
  },
  container1: {
    height: 232,
    paddingHorizontal: 32,
    borderRadius: 32,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: Color.Gray.gray200,
  },
  aCardContainer: {
    backgroundColor: Color.Gray.gray50,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: "-80%",
    borderColor: Color.Gray.gray400,
    overflow: "hidden",
  },
  aCardContainer1: {
    backgroundColor: Color.Gray.gray50,
    padding: 20,
    borderRadius: 32,
    alignItems: "center",
    elevation: 3,
    width: "100%",
    marginBottom: "-90%",
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  blurContainer: {
    width: "100%",
    flex: 1,
    padding: 20,
  },
  titleText: {
    color: Color.base.White,
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 33, 0.32)",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Color.Gray.gray400,
    borderRadius: 48,
    marginTop: 24,
  },
  buttonText: {
    color: Color.base.White,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 32,
  },
});
