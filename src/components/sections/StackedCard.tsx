import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Color from "../../constants/Color";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserCard } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { RestaurantType } from "@/lib/types";
import APassCard from "../atom/cards/APassCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import { LinearGradient } from "expo-linear-gradient";

import SearchGradient from "../icons/SearchGradient";
import { BUTTON_40, CAPTION_1_REGULAR } from "@/constants/typography";

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
        translateY: withSpring(cardPositions.value, {
          damping: 15,
        }),
      },
    ],
    originY: 10,
    zIndex: 999,
    top: cardPositions.value,
    marginBottom: -230,
  }));

  const latestCards = cards?.data?.cards.slice(0, 5);

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.restaurantId}`,
    });
  };

  return (
    <>
      {cards?.data?.cards.length === 0 ? (
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          start={{ x: 1, y: 0 }}
          end={{ x: 2, y: 1 }}
          style={{
            borderRadius: 32,
            marginBottom: 120,
          }}
        >
          <View style={styles.container}>
            <SearchGradient />
            <Text
              style={{
                textAlign: "center",
                color: Color.Gray.gray50,
                ...CAPTION_1_REGULAR,
              }}
            >
              Discover restaurants, add a membership card, and start earning
              rewards every time you check-in at a participating restaurant!
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/Acards")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Explore</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        <Animated.View style={{ flex: 1, paddingBottom: 240 }}>
          {latestCards?.map((card, index) => (
            <Animated.View
              key={index}
              style={[
                animatedCardStyle,
                {
                  zIndex: latestCards.length - index,
                  shadowColor: Color.Gray.gray600,
                  overflow: "hidden",
                  shadowOpacity: 1,
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowRadius: 32,
                  elevation: 12,
                },
              ]}
            >
              <APassCard
                name={card.name}
                nftImage={card.nftImageUrl}
                image={card.logo}
                onPress={() => handleNavigation(card)}
                category={card.categoryName}
                hasBonus={card.hasBonus}
                visitCount={card.visitCount}
                target={
                  card?.target - card?.current === 0
                    ? 0
                    : card?.target - card?.current
                }
                isLoading={isLoading}
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
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 48,
    marginTop: 24,
  },
  buttonText: {
    color: Color.base.White,
    ...BUTTON_40,
  },
});
