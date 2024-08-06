import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { WalletAdd } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import APassCard from "../components/atom/cards/APassCard";
import Close from "../components/icons/Close";
import Owned from "../components/sections/membership/Owned";
import UnOwned from "../components/sections/membership/UnOwned";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import { restaurantKeys, userKeys } from "../lib/service/keysHelper";
import { getAcard } from "../lib/service/mutationHelper";
import { getPerksByRestaurant, getRestaurantId } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import { height, width } from "../lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";

const Restaurant = () => {
  const { cardId, id } = useLocalSearchParams();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { authState } = useAuth();
  const [bottomSheet, setBottomSheet] = useState(false);
  const queryClient = useQueryClient();
  const { currentLocation } = useLocationStore();
  const [perkId, setPerkId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const currentTime = moment().format('HH:mm');


  const { data: restaurantsData, isLoading } = useQuery({
    queryKey: restaurantKeys.detail(id as string),
    queryFn: () => getRestaurantId(id, currentTime),
    enabled: !!currentLocation && !!id,
  });

  const { data: perks } = useQuery({
    queryKey: restaurantKeys.perks(id as string),
    queryFn: () => getPerksByRestaurant(id),
    enabled: !!currentLocation && !!id,
  })

  const toggleBottomSheet = () => {
    setBottomSheet(!bottomSheet);
  };
  console.log("data: ", restaurantsData);
  

  

  const pressed = useSharedValue(false);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) }],
  }));

  const { mutateAsync: createGetAcardMutation } = useMutation({
    mutationFn: getAcard,
    onError: (error) => console.log(error),
    onSuccess: (data) => {
      if (data.data.success) {
        setPerkId(data.data.data.userCard.cardId);
        queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
        queryClient.invalidateQueries({ queryKey: userKeys.cards });
        setIsClaimLoading(false);
      }
    },
  });



  const handleGetAcard = async (id: string) => {
    setIsClaimLoading(true);
    if (authState.userId) {
      await createGetAcardMutation({ userId: authState.userId, cardId: restaurantsData?.cardId });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => router.back()}>
          <Close />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <APassCard
          name={restaurantsData?.name}
          image={restaurantsData?.logo}
          onPress={() => ""}
          nftImage={restaurantsData?.nftImageUrl}
          category={restaurantsData?.categoryName}
          hasBonus={false}
          visitCount={restaurantsData?.visitCount || 0}
          target={perks?.followingBonus?.target}
        />

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", marginTop: 40 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {restaurantsData?.isOwned ? (
              <Animated.View style={{ paddingBottom: 100 }} entering={SlideInDown.springify().damping(20).delay(200)} >
                <Owned
                  // userCardId={perks?.userBonuses?.[0]?.userCardId}
                  // followingPerk={perks?.followingBonus?.name}
                  onPress={toggleBottomSheet}
                  cardId={perkId}
                  // perks={perks?.userBonuses}
                  isLoading={isLoading}
                  data={restaurantsData}
                  marker={restaurantsData?.isOwned}
                />
              </Animated.View>
            ) : (
              <Animated.View entering={SlideInDown.springify().damping(20).delay(200)}>
                <UnOwned
                  restaurant={restaurantsData}
                  isClaimLoading={isClaimLoading}
                  onPress={() => handleGetAcard(cardId as string)}
                />
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
      {restaurantsData?.isOwned ? null : (
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              setLoading(true);
              handleGetAcard(cardId as string);
              setLoading(false);
            }}
            size="small"
            variant="tertiary"
            style={{ alignItems: "center", justifyContent: "center", height: 48 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, top: 2 }}>
              <WalletAdd color={Color.base.White} />
              <Text style={{ color: Color.base.White, fontSize: 15, fontWeight: "bold", top: 2 }}>
                {isClaimLoading ? <ActivityIndicator /> : "Add membership card"}
              </Text>
            </View>
          </Button>
        </View>
      )}
      {bottomSheet && (
        <Modal transparent={true}>
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleBottomSheet}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[
                {
                  position: "absolute",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 98,
                },
                animatedStyles,
              ]}
            />
            <Animated.View
              entering={SlideInDown.springify().damping(18)}
              exiting={SlideOutDown.springify()}
              style={[
                {
                  backgroundColor: Color.Gray.gray600,
                  height: height / 3, //to do 2.8 prev version(original height)
                  bottom: 0,
                  width: width,
                  zIndex: 99,
                  position: "absolute",
                  borderTopStartRadius: 32,
                  borderTopEndRadius: 32,
                  gap: 24,
                  padding: 16,
                },
                animatedStyles,
              ]}
            >
              <View style={{ paddingVertical: 8, justifyContent: "center", alignItems: "center", flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, lineHeight: 24, color: Color.base.White, fontWeight: "bold" }}>Perk</Text>
                <TouchableOpacity onPress={toggleBottomSheet}>
                  <View style={{ backgroundColor: Color.Gray.gray400, borderRadius: 48, padding: 8, width: 32, alignContent: 'center', alignItems: 'center', justifyContent: 'center', aspectRatio: 1, position: "absolute", left: 115, top: -18 }}>
                    <Close />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", gap: 16}}>
                <Image source={require("@/public/images/perk.png")} style={{ width: width / 1.2, height: 58 }} resizeMode="contain" />
                <Text style={{ lineHeight: 18, fontSize: 14, color: Color.Gray.gray50, textAlign: "center" }}>
                  Earn perks after every 3 check-ins. Keep visiting your favorite spots and multiply your rewards!
                </Text>
              </View>
              <Button variant="primary" textStyle="primary" onPress={toggleBottomSheet}>
                <Text>Got it</Text>
              </Button>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    gap: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray200,
    flexDirection: "row",
  },
  closeButton: {
    marginTop: 4,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});
