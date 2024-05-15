import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../constants/Color";
import Balance from "../components/sections/Balance";
import QuickInfo from "../components/sections/QuickInfo";
import StackedCard from "../components/sections/StackedCard";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getUserCard } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import { RestaurantType } from "../lib/types";
import { GetRestaurantsResponseType } from "../lib/types/apiResponseType";
import { restaurantKeys, userKeys } from "../lib/service/keysHelper";
import { getRestaurants } from "../lib/service/queryHelper";
import HomeRestList from "../components/atom/cards/HomeRestList";
import { InfoCircle } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut, SlideInDown, SlideOutDown, SlideInLeft } from "react-native-reanimated";
import { height, width } from "../lib/utils";
import Button from "../components/ui/Button";


const Page = () => {
  const router = useRouter();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isQuickInfoVisible, setIsQuickInfoVisible] = useState(true)
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

  const closeBoost = () => {
    setIsQuickInfoVisible(false);
  }

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
  }
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) }],
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
      params: {
        cardId: restaurant.cardId,
      }
    });
  };

  const restaurantsArray = restaurantsData?.data?.restaurants || [];

  const filteredRestaurantsArray = restaurantsArray.filter(restaurant => !restaurant.isOwned);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={SlideOutDown}>
          {user && <Balance amount={user.balance} />}
        </Animated.View>

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
            <View style={{ alignItems: "center", gap: 8, }}>
              <Animated.ScrollView
                entering={SlideInLeft}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Animated.View entering={SlideInLeft.springify().damping(15)} style={{ flexDirection: 'row', gap: 8 }}>
                  {user?.email &&
                    user?.dateOfBirth &&
                    user?.nickname &&
                    user?.location ? (
                    ''
                  ) : (
                    isQuickInfoVisible && (
                      <QuickInfo onPress={() => setIsQuickInfoVisible(false)} user={user} />
                    )
                  )}
                  <TouchableOpacity
                    onPress={() => handleNavigation(filteredRestaurantsArray[0])}
                  >
                    <HomeRestList
                      isClaimLoading={true}
                      marker={filteredRestaurantsArray[0]}
                      key={filteredRestaurantsArray[0]?.id as string}
                      onPress={() => handleNavigation(filteredRestaurantsArray[0])}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleNavigation(filteredRestaurantsArray[1])}
                  >
                    <HomeRestList
                      isClaimLoading={true}
                      marker={filteredRestaurantsArray[1]}
                      key={filteredRestaurantsArray[1]?.id as string}
                      onPress={() => handleNavigation(filteredRestaurantsArray[1])}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleNavigation(filteredRestaurantsArray[2])}
                  >
                    <HomeRestList
                      isClaimLoading={true}
                      marker={filteredRestaurantsArray[2]}
                      key={filteredRestaurantsArray[2]?.id as string}
                      onPress={() => handleNavigation(filteredRestaurantsArray[2])}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </Animated.ScrollView>
            </View>
          )}
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
        <Modal transparent={true}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={toggleBottomSheet}
          >
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[{
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 98,
              }, animatedStyles]}
            />
            <Animated.View
              entering={SlideInDown.springify().damping(18)}
              exiting={SlideOutDown.springify()}
              style={[{
                backgroundColor: Color.Gray.gray600,
                height: height / 2,
                bottom: 0,
                width: width,
                zIndex: 99,
                position: 'absolute',
                borderTopStartRadius: 32,
                borderTopEndRadius: 32,
                gap: 24,
                padding: 16
              }, animatedStyles]}
            >
              <View style={{ paddingVertical: 8, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, lineHeight: 24, color: Color.base.White, fontWeight: 'bold', }}>Membership</Text>
              </View>
              <View style={{ alignItems: 'center', gap: 16 }}>
                <Image
                  source={require("@/public/images/membership.png")}
                  style={{ width: width / 1.8, height: 166 }}
                  resizeMode='contain'
                />
                <Text style={{ lineHeight: 18, fontSize: 14, color: Color.Gray.gray50, textAlign: 'center' }}>
                  Earn Bitcoin and other rewards simply by using our membership cards when you visit your favorite restaurants.
                </Text>
              </View>

              <Button variant="primary" textStyle="primary" onPress={toggleBottomSheet}>
                <Text>
                  Got it
                </Text>
              </Button>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16
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
