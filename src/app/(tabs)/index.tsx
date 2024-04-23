import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../constants/Color";
import Balance from "../components/sections/Balance";
import QuickInfo from "../components/sections/QuickInfo";
import StackedCard from "../components/sections/StackedCard";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getUserCard } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import { RestaurantType } from "../lib/types";
import { GetRestaurantsResponseType } from "../lib/types/apiResponseType";
import { restaurantKeys, userKeys } from "../lib/service/keysHelper";
import { getRestaurants } from "../lib/service/queryHelper";
import ResListCard from "../components/atom/cards/RestListCard";

const Page = () => {
  const router = useRouter();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const { authState } = useAuth();

  const { currentLocation } = useLocationStore();
  const { data: user, isSuccess } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => {
      return getUserById(authState.userId);
    },
    enabled: !!authState.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });

  const { data: restaurantsData } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getRestaurants({
        page: 1,
        limit: 10,
        distance: 10000,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });

  const handleNavigation = (restaurant: RestaurantType) => {
    if (restaurant.isOwned) {
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
    } else {
      router.push({
        pathname: `/restaurants/${restaurant.id}`,
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
    }
  };


  const restaurantsArray = restaurantsData?.data?.restaurants || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {user && <Balance amount={user.balance} />}
      <View style={{ marginTop: 24, gap: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: Color.Gray.gray100,
          }}
        >
          Featured
        </Text>

        {restaurantsArray?.length > 0 && (
          <View style={{ alignItems: "center" }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity onPress={() => handleNavigation(restaurantsArray[0])}>
                <ResListCard
                  isClaimLoading={true}
                  marker={restaurantsArray[0]}
                  key={restaurantsArray[0].id as string}
                  onPress={() => handleNavigation(restaurantsArray[0])}
                />
              </TouchableOpacity >
              {user?.email &&
                user?.dateOfBirth &&
                user?.nickname &&
                user?.location ? "" : (
                <QuickInfo user={user} />
              )}
              <TouchableOpacity onPress={() => handleNavigation(restaurantsArray[1])}>
                <ResListCard
                  isClaimLoading={true}
                  marker={restaurantsArray[1]}
                  key={restaurantsArray[1].id as string}
                  onPress={() => handleNavigation(restaurantsArray[1])}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation(restaurantsArray[2])}>
                <ResListCard
                  isClaimLoading={true}
                  marker={restaurantsArray[2]}
                  key={restaurantsArray[2].id as string}
                  onPress={() => handleNavigation(restaurantsArray[2])}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: Color.Gray.gray100,
          marginTop: 32,
          marginBottom: 12,
        }}
      >
        Memberships
      </Text>
      <View style={{}}>
        <StackedCard key={refreshPage.toString()} />
      </View>
      {cards?.data?.cards.length === 0 ? (
        ""
      ) : (
        <View style={{ width: "100%", alignItems: "center", marginBottom: 120 }}>
          <TouchableOpacity onPress={() => router.push("/MyAcards")}>
            <View
              style={{
                backgroundColor: Color.Gray.gray300,
                marginTop: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 32,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: Color.base.White,
                  fontSize: 16,
                }}
              >
                See all
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.base.White,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: Color.Gray.gray50,
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  closeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
    color: Color.Gray.gray600,
    fontSize: 16,
  },
});
