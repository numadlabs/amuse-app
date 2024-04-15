import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Flash } from "iconsax-react-native";
import Color from "../../constants/Color";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserCard } from "@/app/lib/service/queryHelper";
import useLocationStore from "@/app/lib/store/userLocation";
import { RestaurantType } from "@/app/lib/types";
import APassCard from "../atom/cards/APassCard";

import { userKeys } from "@/app/lib/service/keysHelper";

const StackedCard = () => {
  const { currentLocation } = useLocationStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
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
      const totalCardHeight = cards.data.cards.reduce(
        (totalHeight, card, index) => {
          const marginBottom = index !== 0 ? -80 : 0;
          const cardHeight = 350 + marginBottom;
          return totalHeight + cardHeight;
        },
        0
      );

      const adjustedTotalHeight = totalCardHeight * (1 - 0.8);
      setScrollViewHeight(adjustedTotalHeight);
    }
  }, [cards]);

  const latestCards = cards?.data?.cards.slice(0, 4);

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/Acards/${restaurant.id}`,
      params: {
        name: restaurant.name,
        location: restaurant.location,
        about: restaurant.description,
        category: restaurant.category,
        isOwned: restaurant.isOwned,
        logo: restaurant.logo,
        taps: restaurant.visitCount,
        artistInfo: restaurant.artistInfo,
        benefits: restaurant.benefits,
        membership: restaurant.expiryInfo,
        instruction: restaurant.instruction,
      },
    });
  };

  return (
    <>
      {cards?.data?.cards.length === 0 ? (
        <View style={styles.container1}>
          <View>
            <Flash size={48} color={Color.Gray.gray400} />
          </View>
          <Text style={{ textAlign: "center" }}>
            Discover restaurants, add an membership card, and start earning
            rewards every time you check-in at a participating restaurant!
          </Text>
          <TouchableOpacity onPress={() => router.navigate("/Acards")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Explore</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ height: 400, overflow: "hidden" }}>
          {cards?.data?.cards &&
            latestCards.map((card, index) => (
              <APassCard
                name={card.name}
                image={card.logo}
                onPress={() => handleNavigation(card)}
                category={card.category}
                hasBonus={card.hasBonus}
              />
            ))}
        </View>
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
    backgroundColor: Color.Gray.gray50,
    height: 380,
    paddingHorizontal: 16,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
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
    backgroundColor: Color.Gray.gray600,
    borderRadius: 48,
    marginTop: 24,
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 32,
  },
});
