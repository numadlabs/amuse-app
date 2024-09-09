import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Color from "@/constants/Color";
import Balance from "@/components/sections/Balance";
import QuickInfo from "@/components/sections/QuickInfo";
import StackedCard from "@/components/sections/StackedCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getUserCard, getRestaurants } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { RestaurantType } from "@/lib/types";
import { GetRestaurantsResponseType } from "@/lib/types/apiResponseType";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import HomeRestList from "@/components/atom/cards/HomeRestList";
import { InfoCircle } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  SlideInLeft,
} from "react-native-reanimated";
import { height, width } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Close from "@/components/icons/Close";
import moment from "moment";
import { BODY_2_MEDIUM, BODY_2_REGULAR, BUTTON_40, H6 } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  const router = useRouter();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenBalance, setIsOpenBalance] = useState<boolean>(false);
  const [isQuickInfoVisible, setIsQuickInfoVisible] = useState(true);
  const pressed = useSharedValue(false);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);

  const { authState } = useAuth();
  const { currentLocation } = useLocationStore();
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();

  useEffect(() => {
    const fetchSettings = async () => {
      const profilePicture = await AsyncStorage.getItem('showProfilePicture');
      const dateOfBirth = await AsyncStorage.getItem('showDateOfBirth');
      const area = await AsyncStorage.getItem('showArea');

      setShowProfilePicture(profilePicture === 'true');
      setShowDateOfBirth(dateOfBirth === 'true');
      setShowArea(area === 'true');
    };

    fetchSettings();
  }, []);

  const { data: user } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
    enabled: !!authState.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => getUserCard(),
    enabled: !!currentLocation,
  });

  const { data: restaurantsData } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () => getRestaurants({
      page: 1,
      limit: 10,
      time: currentTime,
      dayNoOfTheWeek: currentDayOfWeek,
    }),
    enabled: !!currentLocation,
  });

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        cardId: restaurant.cardId,
      },
    });
  };

  const restaurantsArray = restaurantsData?.data?.restaurants || [];
  const filteredRestaurantsArray = restaurantsArray.filter(
    (restaurant) => !restaurant.isOwned
  );

  const toggleBottomSheet = () => setIsOpen(!isOpen);
  const toggleBalanceBottomSheet = () => setIsOpenBalance(!isOpenBalance);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={SlideOutDown}>
          {user && (
            <TouchableOpacity onPress={() => router.push('/Wallet')}>
              <Balance
                amount={user?.user?.balance}
                convertedAmount={user?.convertedBalance}
                currencyName="EUR"
                handleToggle={toggleBalanceBottomSheet}
              />
            </TouchableOpacity>
          )}
        </Animated.View>

        {(filteredRestaurantsArray.length > 0 || !user?.user?.email || !user?.user?.dateOfBirth || !user?.user?.nickname || !user?.user?.location) && (
          <View style={styles.featuredContainer}>
            <Text style={styles.featuredText}>Featured</Text>
            <View style={styles.scrollViewContainer}>
              {restaurantsArray.length > 0 && (
                <Animated.ScrollView
                  snapToAlignment="center"
                  entering={SlideInLeft}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width - 16}
                  decelerationRate="fast"
                >
                  <Animated.View
                    entering={SlideInLeft.springify().damping(15)}
                    style={styles.scrollViewContent}
                  >
                    {(!user?.user?.dateOfBirth || !user?.user?.location || !showProfilePicture) && isQuickInfoVisible && (
                      <QuickInfo
                        onPress={() => setIsQuickInfoVisible(false)}
                        user={user?.user}
                      />
                    )}

                    <FlatList
                      style={styles.flatList}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                      data={filteredRestaurantsArray}
                      horizontal
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <HomeRestList
                          isClaimLoading={true}
                          marker={item}
                          onPress={() => handleNavigation(item)}
                        />
                      )}
                    />
                  </Animated.View>
                </Animated.ScrollView>
              )}
            </View>
          </View>
        )}

        <View style={styles.membershipsContainer}>
          <Text style={styles.membershipsText}>Memberships</Text>
          <TouchableOpacity onPress={toggleBottomSheet}>
            <InfoCircle size={18} color={Color.Gray.gray100} />
          </TouchableOpacity>
        </View>

        <View style={styles.stackedCardContainer}>
          <StackedCard key={refreshPage.toString()} />
        </View>

        {cards?.data?.cards.length > 0 && (
          <View style={styles.seeAllContainer}>
            <TouchableOpacity onPress={() => router.push("/MyAcards")}>
              <View style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See all</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {isOpenBalance && (
        <Modal transparent={true}>
          <TouchableOpacity style={styles.modalBackground} onPress={toggleBalanceBottomSheet}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[styles.modalOverlay, animatedStyles]}
            />
            <Animated.View
              entering={SlideInDown.springify().damping(18)}
              exiting={SlideOutDown.springify()}
              style={[styles.modalContent, animatedStyles]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.filler} />
                <Text style={styles.modalTitle}>About your Balance</Text>
                <TouchableOpacity onPress={toggleBalanceBottomSheet}>
                  <View style={styles.closeButton}>
                    <Close />
                  </View>
                </TouchableOpacity>
              </View>
              <Image
                source={require("../../public/images/balanceInfo.png")}
                style={styles.balanceImage}
              />
              <Text style={styles.modalDescription}>
                You earned ALYS Bitcoin, which is faster and cheaper to use but
                still pegged 1:1 with mainchain Bitcoin. Use your balance to
                redeem perks at restaurants. Withdrawals to external crypto
                wallets coming soon.
              </Text>
              <Button
                variant="primary"
                textStyle="primary"
                onPress={toggleBalanceBottomSheet}
                style={styles.modalButton}
              >
                <Text>Got it</Text>
              </Button>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}

      {isOpen && (
        <Modal transparent={true}>
          <TouchableOpacity style={styles.modalBackground} onPress={toggleBottomSheet}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[styles.modalOverlay, animatedStyles]}
            />
            <Animated.View
              entering={SlideInDown.springify().damping(18)}
              exiting={SlideOutDown.springify()}
              style={[styles.modalContent, animatedStyles]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.filler} />
                <Text style={styles.modalTitle}>Membership</Text>
                <TouchableOpacity onPress={toggleBottomSheet}>
                  <View style={styles.closeButton}>
                    <Close />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.membershipInfo}>
                <Image
                  source={require("../../public/images/membership.png")}
                  style={styles.membershipImage}
                  resizeMode="contain"
                />
                <Text style={styles.membershipDescription}>
                  Earn Bitcoin and other rewards simply by using our membership
                  cards when you visit your favorite restaurants.
                </Text>
              </View>
              <Button
                variant="primary"
                textStyle="primary"
                onPress={toggleBottomSheet}
                style={styles.modalButton}
              >
                <Text>Got it</Text>
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
  },
  scrollContainer: {
    flex: 1,
  },
  featuredContainer: {
    marginTop: 16,
    gap: 12,
  },
  featuredText: {
    ...BODY_2_MEDIUM,
    color: Color.Gray.gray100,
    paddingHorizontal: 16,
  },
  scrollViewContainer: {
    alignItems: "center",
    gap: 8,
    width,
  },
  scrollViewContent: {
    flexDirection: "row",
    gap: 8,
    left: 16,
    paddingRight: 32,
  },
  flatList: {
    gap: 10,
    flex: 1,
  },
  separator: {
    width: 8,
  },
  membershipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  membershipsText: {
    ...BODY_2_MEDIUM,
    color: Color.Gray.gray100,
  },
  stackedCardContainer: {
    paddingHorizontal: 16,
  },
  seeAllContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 120,
  },
  seeAllButton: {
    backgroundColor: Color.Gray.gray300,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 32,
  },
  seeAllText: {
    color: Color.base.White,
    ...BUTTON_40,
  },
  modalBackground: {
    flex: 1,
  },
  modalOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 98,
  },
  modalContent: {
    backgroundColor: Color.Gray.gray600,
    height: height / 2.20,
    bottom: 0,
    width: width,
    zIndex: 99,
    position: "absolute",
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    gap: 24,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "100%",
  },
  filler: {
    flex: 1,
  },
  modalTitle: {
    ...H6,
    color: Color.base.White,
    textAlign: "center",
    flex: 8,
  },
  closeButton: {
    backgroundColor: Color.Gray.gray400,
    borderRadius: 48,
    padding: 8,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
  balanceImage: {
    height: 64,
    width: 204,
  },
  modalDescription: {
    ...BODY_2_REGULAR,
    textAlign: "center",
    color: Color.Gray.gray50,
  },
  modalButton: {
    width: "100%",
  },
  membershipInfo: {
    alignItems: "center",
    gap: 16,
  },
  membershipImage: {
    width: width / 1.8,
    height: 166,
  },
  membershipDescription: {
    ...BODY_2_REGULAR,
    color: Color.Gray.gray50,
    textAlign: "center",
  },
});