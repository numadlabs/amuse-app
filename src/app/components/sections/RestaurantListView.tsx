import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import RestListCard from "@/atom/cards/RestListCard";
import Color from "@/app/constants/Color";
import { ArrowRight2, ArrowLeft2 } from "iconsax-react-native";
import Pagination from "@/atom/Pagination";
import { restaurantKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import {  RestaurantType } from "@/app/lib/types";
import moment from "moment";


const RestaurantListView = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const currentTime = moment().format('HH:mm');
  

  const { data: restaurantsData, isLoading, isError } = useQuery({
    queryKey: restaurantKeys.all,
    queryFn: () =>
      getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: 7
      }),
  });

 
 

  if (isLoading) {
    return <ActivityIndicator size="large" color={Color.Gray.gray100} />;
  }

  if (isError) {
    return <Text style={styles.errorText}>Error fetching data</Text>;
  }

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        cardId: restaurant.cardId,
      },
    });
  };


  console.log("Card id: ", restaurantsData);
  

  const chunkArray = (arr: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const numSteppers = Math.ceil(restaurantsData?.data?.restaurants.length / 5);
  const restaurantChunks = chunkArray(restaurantsData?.data?.restaurants || [], 5);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {restaurantChunks[currentStep - 1]?.map((item) => (
            <TouchableOpacity
              key={`card-touch-${item.id}`}
              onPress={() => handleNavigation(item)}
            >
              <RestListCard
                key={`card-${item.id}`}
                marker={item}
                onPress={() => handleNavigation(item)}
              />
            </TouchableOpacity>
          ))}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              disabled={currentStep === 1}
              onPress={() => setCurrentStep((prev) => prev - 1)}
              style={[
                styles.navButton,
                { backgroundColor: currentStep === 1 ? Color.Gray.gray200 : Color.Gray.gray500 },
              ]}
            >
              <ArrowLeft2 color={currentStep === 1 ? Color.Gray.gray200 : Color.Gray.gray50} size={20} />
            </TouchableOpacity>
            {Array.from({ length: numSteppers }, (_, i) => i + 1).map((step) => (
              <Pagination
                key={step}
                step={step}
                currentStep={currentStep}
                handleNavigation={(step) => setCurrentStep(step)}
              />
            ))}
            <TouchableOpacity
              disabled={currentStep === numSteppers}
              onPress={() => setCurrentStep((prev) => prev + 1)}
              style={[
                styles.navButton,
                { backgroundColor: currentStep === numSteppers ? Color.Gray.gray200 : Color.Gray.gray500 },
              ]}
            >
              <ArrowRight2 color={currentStep === numSteppers ? Color.Gray.gray200 : Color.Gray.gray50} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 250,
  },
  navigationContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 32,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default RestaurantListView;
