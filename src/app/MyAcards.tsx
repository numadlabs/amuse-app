import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import OwnedAcards from "@/components/atom/cards/OwnedAcards";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { getUserCard } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { RestaurantType } from "@/lib/types";
import { userKeys } from "@/lib/service/keysHelper";
import { SafeAreaView } from "react-native-safe-area-context";

const MyAcards = () => {
  const { currentLocation } = useLocationStore();
  const { data: cards = [], isLoading } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard();
    },
    enabled: !!currentLocation,
  });

  const router = useRouter();
  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.restaurantId}`,
    });
  };
  return (
    <SafeAreaView style={{ backgroundColor: Color.Gray.gray600 }}>
      <Header title="My memberships" />

      <ScrollView style={styles.container}>
        {cards &&
          cards?.data?.cards.map((card, index) => (
            <OwnedAcards
              key={card.id}
              marker={card}
              onPress={() => handleNavigation(card)}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAcards;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 100,
    marginTop: 16,
    height: "90%",
  },
  searchBarContainer: {
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderBottomStartRadius: 32,
    borderBottomEndRadius: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    color: Color.Gray.gray600,
  },
});
