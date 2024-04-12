import { restaurantKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ResListCard from "../atom/cards/RestListCard";
import { RestaurantType } from "@/app/lib/types";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { getAcard } from "@/app/lib/service/mutationHelper";

interface RestaurantListViewProps { }

const RestaurantListView: React.FC<RestaurantListViewProps> = (props) => {
  const router = useRouter();
  const queryClient = useQueryClient();


  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [showOwned, setShowOwned] = useState(false);
  const { authState } = useAuth();
  const {
    data: restaurantsData,
    isLoading,
    isError,
    isSuccess
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
    onSuccess: () => {
      setRestaurants(restaurantsData?.data?.restaurants)
    }
  });

  const { mutateAsync: createGetAcardMutation } = useMutation({
    mutationFn: getAcard,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {

    },
  });
  // if (data.data.success) {
  //   queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
  //   setIsClaimLoading(false);
  // }

  const handleGetAcard = async (acardId: string) => {
    console.log("🚀 ~ RestaurantMapView ~ aCardId:", acardId);
    setIsClaimLoading(true);
    if (authState.userId) {
      const data = await createGetAcardMutation({
        userId: authState.userId,
        cardId: acardId,
      });
      console.log("🚀 ~ handleGetAcard ~ data:", data);
      if (data.data.success) {
        queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
        setIsClaimLoading(false);
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
        cardId: restaurant.cardId
      },
    });
  };

  return (
    <ScrollView style={{ flex: 1, height: "100%" }}>
      {/* {restaurantsData?.data?.restaurants &&
        restaurantsData.data.restaurants.map((item, index) => (
          <>
            <TouchableOpacity
              key={`card-${item.id}`}
              onPress={() => handleNavigation(item)}
            >
              <ResListCard
                key={index}
                marker={item}
                onPress={() => {
                  const aCardId = item.cardId;
                  handleGetAcard(aCardId);
                }}
                isClaimLoading={isClaimLoading}
              />
            </TouchableOpacity>
          </>
        ))} */}
      {restaurants && restaurants.length > 0 ? (
      restaurants.map((item, index) => (
        <>
          <TouchableOpacity key={`card-${item.id}`} onPress={() => handleNavigation(item)}>
            <ResListCard key={index} marker={item} onPress={() => handleGetAcard(item.cardId)} isClaimLoading={isClaimLoading} />
          </TouchableOpacity>
        </>
      ))
    ) : (
      <Text>Loading...</Text>
    )}
    </ScrollView>
  );
};

export default RestaurantListView;
