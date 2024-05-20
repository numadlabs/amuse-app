import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HomeRestList from "../atom/cards/HomeRestList";
import { RestaurantType } from "@/app/lib/types";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { getAcard } from "@/app/lib/service/mutationHelper";
import { width } from "@/app/lib/utils";
import RestListCard from "../atom/cards/RestListCard";
import Color from "@/app/constants/Color";
import { ArrowRight2, ArrowLeft2 } from "iconsax-react-native";
import Stepper from "../atom/Stepper";
import { restaurantKeys, userKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";

interface RestaurantListViewProps {}

const RestaurantListView: React.FC<RestaurantListViewProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [cardLoadingStates, setCardLoadingStates] = useState<boolean[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const { authState } = useAuth();

  const {
    data: restaurantsData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () =>
      getRestaurants({
        page: 1,
        limit: 10,
        distance: 10000,
        latitude: 0,
        longitude: 0,
      }),
  });

  const { mutateAsync: createGetAcardMutation } = useMutation({
    mutationFn: getAcard,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {},
  });

  const handleGetAcard = async (index: number, acardId: string) => {
    console.log("🚀 ~ RestaurantMapView ~ aCardId:", acardId);
    const newCardLoadingStates = [...cardLoadingStates];
    newCardLoadingStates[index] = true;
    setCardLoadingStates(newCardLoadingStates);

    if (authState.userId) {
      const data = await createGetAcardMutation({
        userId: authState.userId,
        cardId: acardId,
      });

      if (data.data.success) {
        newCardLoadingStates[index] = false;
        setCardLoadingStates(newCardLoadingStates);
        queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
        queryClient.invalidateQueries({
          queryKey: userKeys.cards,
        });
      }
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        cardId: restaurant.cardId,
      },
    });
  };

  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const numSteppers = Math.ceil(restaurantsData.data.restaurants.length / 5);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 250 }}>
          {restaurantsData?.data?.restaurants &&
            chunkArray(restaurantsData.data.restaurants, 5)[
              currentStep - 1
            ].map((item, index) => (
              <>
                <TouchableOpacity
                  key={`card-${item.id}`}
                  onPress={() => handleNavigation(item)}
                >
                  <RestListCard
                    key={`card-${item.id}`}
                    marker={item}
                    onPress={() => handleNavigation(item)}
                    isClaimLoading={isClaimLoading}
                  />
                </TouchableOpacity>
              </>
            ))}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              justifyContent: "center",
              marginTop: 32,
            }}
          >
            <TouchableOpacity
              disabled={currentStep === 1}
              onPress={() => setCurrentStep((prev) => prev - 1)}
              style={{
                backgroundColor: Color.Gray.gray500,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
              }}
            >
              <ArrowLeft2 color={currentStep === 1 ? Color.Gray.gray200 : Color.Gray.gray50} size={20} />
            </TouchableOpacity>
            {Array.from({ length: numSteppers }, (_, i) => i + 1).map(
              (step) => (
                <Stepper key={step} step={step} currentStep={currentStep} />
              )
            )}
            <TouchableOpacity
              disabled={currentStep === numSteppers}
              onPress={() => setCurrentStep((prev) => prev + 1)}
              style={{
                backgroundColor: Color.Gray.gray500,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
              }}
            >
              <ArrowRight2 color={Color.Gray.gray50} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantListView;
