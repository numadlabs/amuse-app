import { restaurantKeys, userKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ResListCard from "../atom/cards/RestListCard";
import { RestaurantType } from "@/app/lib/types";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { getAcard } from "@/app/lib/service/mutationHelper";

interface RestaurantListViewProps {}

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
    onSuccess: (data, variables) => {},
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
        id: restaurant.id,
        cardId: restaurant.cardId,
      },
    });
  };

  return (
    <View style={{ flex: 1, height: "100%", paddingBottom: 100 }}>
    <ScrollView>
      {restaurantsData?.data?.restaurants &&
        restaurantsData.data.restaurants.map((item, index) => (
          <>
            <TouchableOpacity
              key={`card-${item.id}`}
              onPress={() => handleNavigation(item)}
              style={{ paddingHorizontal: 16 }}
            >
              <ResListCard
                key={index}
                marker={item}
                onPress={() => {
                  const aCardId = item.cardId;
                  handleGetAcard(index, item.cardId);
                }}
                isClaimLoading={isClaimLoading}
              />
            </TouchableOpacity>
          </>
        ))}
      {/* {restaurants && restaurants.length > 0 ? (
        restaurants.map((item, index) => (
          <>
            <TouchableOpacity key={`card-${item.id}`} onPress={() => handleNavigation(item)}>
              <ResListCard
                key={index}
                marker={item}
                onPress={() => handleGetAcard(index, item.cardId)}
                isClaimLoading={cardLoadingStates[index] || false}
              />
            </TouchableOpacity>
          </>
        ))
      ) : (
        <Text>Loading...</Text>
      )} */}
    </ScrollView>
    </View>
  );
};

export default RestaurantListView;
