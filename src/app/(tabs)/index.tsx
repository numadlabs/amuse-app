import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import Color from "../constants/Color";
import Balance from "../components/sections/Balance";
import QuickInfo from "../components/sections/QuickInfo";
import StackedCard from "../components/sections/StackedCard";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "react-query";
import { getUserById, getUserCard } from "../lib/service/queryHelper";

import OwnedAcards from "../components/atom/cards/OwnedAcards";
import useLocationStore from "../lib/store/userLocation";
import { RestaurantType } from "../lib/types";



const Page = () => {
  const router = useRouter()
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const { authState } = useAuth()
  const { currentLocation } = useLocationStore();
  const { data: user = [], isSuccess } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: () => {
      return getUserById(authState.userId)
    },
    enabled: !!authState.userId
  })

  const { data: cards = [], } = useQuery({
    queryKey: ["userCards"],
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });

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
      },
    });
  };




  return (
    <ScrollView style={styles.container}>
      <Balance amount={user.balance} />
      <View style={{ marginTop: 24, gap: 12 }}>
        {user.email && user.dateOfBirth ? (
          <Text style={{ fontSize: 14, fontWeight: '600', color: Color.Gray.gray400 }}>
            Featured restaurants
          </Text>
        ) : ("")}

        <ScrollView horizontal={true} >
          {user.email && user.dateOfBirth ? (
            cards?.data?.cards.slice(0, 2).map((card, index) => (
              <View style={{ marginRight: 8 }}>
                <OwnedAcards marker={card} key={card.id} onPress={() => handleNavigation(card)} />
              </View>
            ))
          ) : (
            <QuickInfo />
          )}
        </ScrollView>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '600', color: Color.Gray.gray400, marginTop: 32, marginBottom: 12 }}>
        Memberships
      </Text>


      <StackedCard key={refreshPage.toString()} />

      {cards?.data?.cards.length === 0 ?
        "" :
        (
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 50 }}>
            <TouchableOpacity onPress={() => router.push('/MyAcards')}>
              <View style={{ backgroundColor: Color.Gray.gray50, marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 32 }}>
                <Text style={{ fontWeight: 'bold', color: Color.Gray.gray600, fontSize: 16, }}>
                  See all
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }

    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingHorizontal: 16
  },
});
