import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { useAuth } from "./context/AuthContext";
import { useQuery } from "react-query";
import { getUserCard } from "./lib/service/queryHelper";
import useLocationStore from "./lib/store/userLocation";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import OwnedAcards from "./components/atom/cards/OwnedAcards";
import { useRouter } from "expo-router";
import { RestaurantType } from "./lib/types";
import { SearchNormal1 } from "iconsax-react-native";

const MyAcards = () => {
  const { authState } = useAuth();
  const { currentLocation } = useLocationStore();
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["userCards"],
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });

  console.log(cards?.data?.cards)

  const router = useRouter();
  const handleNavigation = (restaurant: RestaurantType) => {
    console.log("logo",restaurant.logo)
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
      },
    });
  };
  return (
    <SafeAreaView style={{ backgroundColor: Color.base.White }}>
      <Header title="My memberships" />
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <SearchNormal1 color={Color.Gray.gray600} />
          <TextInput placeholder="Search Acards" style={styles.searchInput} />
        </View>
      </View>
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
    height: 'auto'

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
    fontSize: 16,
    color: Color.Gray.gray600,
  },
});
