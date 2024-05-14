import { restaurantKeys, userKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HomeRestList from "../atom/cards/HomeRestList";
import { RestaurantType } from "@/app/lib/types";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { getAcard } from "@/app/lib/service/mutationHelper";
import { width } from "@/app/lib/utils";
import RestListCard from "../atom/cards/RestListCard";

interface RestaurantListViewProps { }

const RestaurantListView: React.FC<RestaurantListViewProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [cardLoadingStates, setCardLoadingStates] = useState<boolean[]>([]);
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
    onSuccess: (data, variables) => { },
  });
  // if (data.data.success) {
  //   queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
  //   setIsClaimLoading(false);
  // }

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

  console.log(restaurantsData?.data?.restaurants)

  return (
    <View style={{ paddingHorizontal: 16}}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 200 }}>
        {restaurantsData?.data?.restaurants &&
          restaurantsData.data.restaurants.map((item, index) => (
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
          </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantListView;
