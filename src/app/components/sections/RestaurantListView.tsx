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
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [showOwned, setShowOwned] = useState(false);
  const { authState } = useAuth();
  const {
    data: restaurantsData,
    isLoading,
    isError,
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

  // if (data.data.success) {
  //   queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
  //   setIsClaimLoading(false);
  // }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }

  const router = useRouter();
  

  const queryClient = useQueryClient();

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
      console.log("🚀 ~ handleGetAcard ~ data:", data);
      if (data.data.success) {
        queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
        setIsClaimLoading(false);
      }
    }
  };

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        name: restaurant.name,
        location: restaurant.location,
        about: restaurant.description,
        category: restaurant.category,
        isOwned: restaurant.isOwned,
        benefits: [restaurant.benefits],
        locations: restaurant.location,
        artistInfo: restaurant.artistInfo,
        expiryInfo: restaurant.expiryInfo,
        instruction: restaurant.instruction,
        logo: restaurant.logo,
      },
    });
  };

  return (
    <ScrollView style={{ flex: 1, height: "100%" }}>
      {restaurantsData?.data?.restaurants &&
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
        ))}
    </ScrollView>
  );
};

export default RestaurantListView;
