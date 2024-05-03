import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
import HomeRestListCard from "../components/atom/cards/HomeRestListCard";
import { InfoCircle } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { height } from "../lib/utils";

const Page = () => {
  const router = useRouter();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pressed = useSharedValue(false);
  const [featured, setIsFeatured] = useState([]);
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

  const toggleBottomSheet = () => {
    setIsOpen(!isOpen);
  };
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

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

  const bottomSheetAnimation = useSharedValue(0);

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    const translateY = bottomSheetAnimation.value * 500;
    return { transform: [{ translateY }] };
  });

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
    });
  };

  const restaurantsArray = restaurantsData?.data?.restaurants || [];
  const filteredRestaurantsArray = restaurantsArray.filter(
    (restaurant) => !restaurant.isOwned
  );
  const featuredRestaurants = filteredRestaurantsArray.slice(0, 2);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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

          <View style={{ alignItems: "center", width: "100%" }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
                {user?.email &&
                user?.dateOfBirth &&
                user?.nickname &&
                user?.location ? (
                  <QuickInfo user={user} />
                ) : (
                  <QuickInfo user={user} />
                )}
                {restaurantsArray
                  .filter((restaurant) => restaurant.isOwned === false)
                  .slice(0, 3)
                  .map((restaurant) => (
                    <TouchableOpacity
                      onPress={() => handleNavigation(restaurant)}
                    >
                      <HomeRestListCard
                        isClaimLoading={true}
                        marker={restaurant}
                        key={restaurant.id as string}
                        onPress={() => handleNavigation(restaurant)}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 32,
            marginBottom: 12,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: Color.Gray.gray100,
            }}
          >
            Memberships
          </Text>
          <TouchableOpacity onPress={toggleBottomSheet}>
            <InfoCircle size={18} color={Color.Gray.gray100} />
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <StackedCard key={refreshPage.toString()} />
        </View>
        {cards?.data?.cards.length === 0 ? (
          ""
        ) : (
          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 120 }}
          >
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
      {isOpen && (
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: height / 2,
              backgroundColor: Color.Gray.gray500,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: "hidden",
              zIndex: 1000, // Increase the z-index value
              left: 0,
            },
            bottomSheetAnimatedStyle, // Apply animated style
          ]}
        >
          <Text>kasdbfjkas</Text>
        </Animated.View>
      )}
    </GestureHandlerRootView>
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
