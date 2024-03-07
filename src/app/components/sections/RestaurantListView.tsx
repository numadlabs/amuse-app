import { restaurantKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import ListCard from "../atom/cards/FloatingRestCard";

interface RestaurantListViewProps {
  // Add any additional props as needed
}

const RestaurantListView: React.FC<RestaurantListViewProps> = (props) => {
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
      }), // Update with actual parameters
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }

  return (
    <View style={{ flex: 1, height: "100%" }}>
      {restaurantsData?.data?.restaurants && (
        <FlatList
          data={restaurantsData.data.restaurants}
          keyExtractor={(item) => item.id.toString()} // Ensure each list item has a unique key
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                // Handle press event if needed
                console.log("Card pressed for:", item.name);
              }}
            >
              <ListCard
                marker={item}
                onPress={() => {
                  // Handle press event if needed
                  console.log("Card pressed for:", item.name);
                }}
                isClaimLoading={false} // Adjust as needed
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default RestaurantListView;
