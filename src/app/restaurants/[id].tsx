import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Location, TicketExpired, User, WalletAdd } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import Popup from "../components/(feedback)/Popup";
import Tick from "../components/icons/Tick";
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
  getRestaurantById,
  getRestaurantId,
  getRestaurants,
} from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import APassCard from "../components/atom/cards/APassCard";

const Restaurant = () => {
  const { cardId, id } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [visitCount, setVisitCount] = useState(0);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { authState } = useAuth();
  const { currentLocation } = useLocationStore();
  const queryClient = useQueryClient();

  const { data: restaurantsData } = useQuery({
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

  const { mutateAsync: createGetAcardMutation } = useMutation({
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
        queryClient.invalidateQueries({
          queryKey: [
            restaurantKeys.detail(id as string),
            restaurantKeys.all,
            userKeys.cards,
          ],
        });
        setIsClaimLoading(false);
        const owned = data.data.userCard;
        console.log(owned);
        router.back()
        showToast();
      }
    }
  };

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    router.back();
  };

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
          name={restaurantsData.name}
          image={restaurantsData.logo}
          onPress={() => ""}
          category={restaurantsData.category}
          hasBonus={false}
          visitCount={0}
        />
        <View style={styles.attrContainer}>
          <View style={{ gap: 32 }}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: Color.base.White,
                }}
              >
                Rewards
              </Text>
              <View>
                <View style={styles.attribute}>
                  <Tick size={8} color={Color.Gray.gray100} />
                  <Text style={styles.attributeText}>
                    {restaurantsData?.benefits}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: Color.base.White,
                }}
              >
                Locations
              </Text>
              <View>
                <View style={styles.attribute}>
                  <Location color={Color.Gray.gray100} />
                  <Text style={styles.attributeLocText}>
                    {restaurantsData?.location}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Color.base.White,
              }}
            >
              How it works
            </Text>
            <Text style={{ marginBottom: 100, color: Color.Gray.gray50 }}>
              Open your app to the homepage, scan the QR code from your waiter
              or hostess, and earn rewards for checking in. Activate power-ups
              for extra rewards.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            handleGetAcard(cardId as string);
          }}
          size="small"
          variant="primary"
          style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'center', }}>
          <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', gap: 12, top: 2 }}>
            <WalletAdd color={Color.base.White} />
            <Text
              style={{
                color: Color.base.White,
                fontSize: 15,
                fontWeight: "bold",
                top: 2
              }}
            >
              {isClaimLoading
                ? "Loading"
                : restaurantsData?.visitCount === null
                  ? "Add a membership card"
                  : "Owned"}
            </Text>
          </View>

        </Button>
        <Popup title="" isVisible={isPopupVisible} onClose={closePopup} />
      </View>
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
  button1: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    padding: 12,
    gap: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray600,
    flexDirection: "row",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 80,
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
  textImageContainer: {
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 33, 0.32)",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray50,
    fontSize: 16,
    width: "90%",
  },
  attributeLocText: {
    color: Color.Gray.gray50,
    fontSize: 16,
    width: "90%",
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});
