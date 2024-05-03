import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Location, TicketExpired, User, WalletAdd } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Popup from "../components/(feedback)/Popup";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import Close from "../components/icons/Close";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAcard } from "../lib/service/mutationHelper";
import { restaurantKeys, userKeys } from "../lib/service/keysHelper";
import Toast from "react-native-toast-message";
import { GetRestaurantsResponseType } from "../lib/types/apiResponseType";
import {
  getPerksByRestaurant,
  getRestaurantById,
  getRestaurantId,
  getRestaurants,
  getUserPowerUps,
} from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import APassCard from "../components/atom/cards/APassCard";
import Owned from "../components/sections/membership/Owned";
import UnOwned from "../components/sections/membership/UnOwned";
import Animated, { SlideInDown } from "react-native-reanimated";

const Restaurant = () => {
  const { cardId, id } = useLocalSearchParams();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { authState } = useAuth();
  const [perkId, setPerkId] = useState<string>("")
  const { currentLocation } = useLocationStore();
  const queryClient = useQueryClient();

  const { data: restaurantsData, isLoading } = useQuery({
    queryKey: restaurantKeys.detail(id as string),
    queryFn: () => {
      return getRestaurantId(id);
    },
    enabled: !!currentLocation && !!id,
  });

  const showToast = () => {
    Toast.show({
      type: "perkToast",
      text1: "Added membership card",
    });
  };

  const { mutateAsync: createGetAcardMutation, } = useMutation({
    mutationFn: getAcard,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => { },
  });
  const handleGetAcard = async (acardId: string) => {
    console.log("🚀 ~ RestaurantMapView ~ aCardId:", acardId);
    setIsClaimLoading(true);
    if (authState.userId) {
      const data = await createGetAcardMutation({
        userId: authState.userId,
        cardId: acardId,
      });
      if (data.data.success) {
        setIsClaimLoading(false);
        setPerkId(data.data.data.userCard.cardId);
        queryClient.invalidateQueries({
          queryKey: restaurantKeys.all,
        });
        showToast();
      }
    }
  };




  const { data: userCardId = [] } = useQuery({
    queryKey: userKeys.perks,
    queryFn: () => {
      return getPerksByRestaurant(id);
    },
    enabled: !!currentLocation,
  });

  const { data: perks = [] } = useQuery({
    queryKey: userKeys.perks,
    queryFn: () => {
      return getUserPowerUps(userCardId);
    },
    enabled: !!currentLocation,
  });

  console.log(perks)
  return (
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            router.back();
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <APassCard
          name={restaurantsData?.name}
          image={restaurantsData?.logo}
          onPress={() => ""}
          category={restaurantsData?.category}
          hasBonus={false}
          visitCount={restaurantsData?.visitCount === null ? 0 : restaurantsData?.visitCount}
        />
        {
          isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
              <ActivityIndicator />
            </View>

          ) : (
            <>
              {restaurantsData?.isOwned ? (
                <Animated.View entering={SlideInDown.springify().damping(20).delay(200)}>
                  <Owned cardId={perkId} perks={perks} isLoading={isLoading} />
                </Animated.View>
              ) : (
                <Animated.View entering={SlideInDown.springify().damping(20).delay(200)}>
                  <UnOwned
                    restaurant={restaurantsData}
                    isClaimLoading={isClaimLoading}
                    onPress={() => handleGetAcard(cardId as string)} />
                </Animated.View>
              )}
            </>
          )
        }
      </ScrollView>
      {restaurantsData?.isOwned ? (null) : (
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              handleGetAcard(cardId as string);
            }}
            size="small"
            variant="primary"
            style={{
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: 'center',
                alignItems: "center",
                gap: 12,
                top: 2,
              }}
            >
              <WalletAdd color={Color.base.White} />
              <Text
                style={{
                  color: Color.base.White,
                  fontSize: 15,
                  fontWeight: "bold",
                  top: 2,
                }}
              >
                {isClaimLoading
                  ? <ActivityIndicator />
                  : restaurantsData?.visitCount === null
                    ? "Add a membership card"
                    : "Owned"}
              </Text>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    gap: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray200,
    flexDirection: "row",
  },
  closeButton: {
    marginTop: 12,
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
