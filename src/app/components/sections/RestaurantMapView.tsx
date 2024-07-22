

import { restaurantKeys, userKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { RestaurantType } from "@/app/lib/types";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import FloatingRestaurantCard from "../atom/cards/FloatingRestCard";
import useLocationStore from "@/app/lib/store/userLocation";
import SvgMarker from "../atom/svgMarker";
import Color from "@/app/constants/Color";
import { mapStyle, SERVER_SETTING } from "@/app/constants/serverSettings";
import moment from "moment";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const mapLatitudeDelta = 0.1;
const mapLongitudeDelta = 0.1;

export default function RestaurantMapView() {
  const router = useRouter();

  const { currentLocation } = useLocationStore();
  const [selectedLocation, setSelectedLocation] = useState("current");
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [scrollViewHidden, setScrollViewHidden] = useState(true);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const currentTime = moment().format('HH:mm');
  const [cardIndexToScroll, setCardIndexToScroll] = useState<number | null>(
    null
  );

  let mapAnimation = new Animated.Value(0);

  const [isScrollViewDragging, setIsScrollViewDragging] = useState(false);

  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    if (selectedLocation === "current" && currentLocation) {
      setInitialRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      });
    } else if (selectedLocation === "dubai") {
      setInitialRegion({
        latitude: 25.276987,
        longitude: 55.296249,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      });
    }
  }, [currentLocation, selectedLocation]);

  const findMarkerIndex = (marker) => {
    return restaurantsData?.data?.restaurants.findIndex(
      (restaurant) => restaurant.id === marker.id
    );
  };

  const toggleLocation = () => {
    setSelectedLocation((prevLocation) =>
      prevLocation === "current" ? "dubai" : "current"
    );

    const coordinates = getLocationCoordinates();
    setInitialRegion({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: mapLatitudeDelta,
      longitudeDelta: mapLongitudeDelta,
    });
  };

  const getLocationCoordinates = () => {
    if (selectedLocation === "current") {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
    } else {
      // Return the coordinates of Dubai
      return {
        latitude: 25.276987,
        longitude: 55.296249,
      };
    }
  };

  const { data: restaurantsData } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: 7,
      });
    },
    // onError(error):{
    //   console.log(error)
    // }

    enabled: !!currentLocation,
  });

  // const handleMapAnimation = ({ value }) => {
  //   let index = Math.floor(value / CARD_WIDTH + 0.3);
  //   if (index >= restaurantsData?.data?.restaurants.length) {
  //     index = restaurantsData?.data?.restaurants.length - 1;
  //   }
  //   if (index <= 0) {
  //     index = 0;
  //   }
  //   const marker = restaurantsData?.data?.restaurants[index];
  //   // setMarkerForMapCenter(marker);
  // };

  // useEffect(() => {
  //   const listener = mapAnimation.addListener(handleMapAnimation);

  //   return () => {
  //     mapAnimation.removeListener(listener);
  //   };
  // }, [mapAnimation]); // Added mapAnimation as a dependency

  useEffect(() => {
    if (!scrollViewHidden && cardIndexToScroll !== null) {
      console.log("useEffect triggered");
      // Set a timeout to wait for 0.1 second
      const timeoutId = setTimeout(() => {
        scrollToCardIndex(cardIndexToScroll);
        setCardIndexToScroll(null);
      }, 100); // 100 milliseconds delay

      // Clear the timeout if the component unmounts or variables change
      return () => clearTimeout(timeoutId);
    }
  }, [scrollViewHidden, cardIndexToScroll]);

  const handleMarkerPress = (marker) => {
    console.log("🚀 ~ handleMarkerPress ~ marker:", marker.name);

    setActiveMarker(marker);
    const cardIndex = findMarkerIndex(marker);
    console.log("🚀 ~ handleMarkerPress ~ cardIndex:", cardIndex);
    setScrollViewHidden(false);
    if (cardIndex !== undefined) {
      scrollToCardIndex(cardIndex);
      if (cardIndexToScroll == null) {
        setCardIndexToScroll(cardIndex);
      }
    }
  };

  const scrollToCardIndex = (index) => {
    console.log("🚀 ~ scrollToCardIndex ~ index:", index);
    if (scrollViewRef.current) {
      console.log("🚀 ~ scrollToCardIndex ~ scrollViewRef.current:");
      const x = index * (CARD_WIDTH + 20);
      scrollViewRef.current.scrollTo({ x, animated: true });
    }
  };

  const handleScrollViewScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const positiveNumber = offset < 0 ? -offset : offset;

    const addedPadding = positiveNumber + width * 0.1;
    const index = Math.floor(addedPadding / (CARD_WIDTH + 20));

    // Check if the index is within the valid range of the restaurants array
    if (index >= 0 && index < restaurantsData?.data?.restaurants.length) {
      const marker = restaurantsData?.data?.restaurants[index];

      if (marker && marker.id !== activeMarker?.id) {
        console.log("cond 1", activeMarker?.id !== marker?.id);
        console.log("cond 2", isScrollViewDragging == false);

        if (
          isScrollViewDragging == false &&
          activeMarker &&
          marker?.id == activeMarker?.id
        ) {
          console.log("cond3:", isScrollViewDragging);
          setActiveMarker(marker);
          centerMapOnMarker(marker);
        } else if (isScrollViewDragging && marker) {
          console.log("cond4", isScrollViewDragging);

          setActiveMarker(marker);
          centerMapOnMarker(marker);
        }
      }
    } else {
      console.log("Index out of bounds");
    }
  };
  const centerMapOnMarker = (marker) => {
    console.log(marker.name);
    if (mapRef.current) {
      const region = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      };
      console.log("🚀 ~ centerMapOnMarker ~ region:", region);
      mapRef.current.animateToRegion(region, 150);
    }
  };

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        cardId: restaurant.cardId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 50.0755,   // Latitude for Prague
          longitude: 14.4378,  // Longitude for Prague
          latitudeDelta: 0.1,  // Adjust the delta values for desired zoom level
          longitudeDelta: 0.1,
        }} // Pass the initialRegion prop here

        customMapStyle={mapStyle}
        cacheEnabled={true}
        onPress={toggleLocation} // Add this onPress handler
      >
        {/* <View style={styles.locationToggleContainer}>
          <TouchableOpacity onPress={toggleLocation} style={styles.locationToggle}>
            <Text style={styles.locationToggleText}>
              {selectedLocation === "current" ? "Dubai" : "Current Location"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gpsButton}>
          <TouchableOpacity >
            <Gps size={24} color="#000000" />

 */}
        {restaurantsData?.data?.restaurants.map((restaurant, index) => {
          if (!restaurant.latitude || !restaurant.longitude) {
            return null;
          }
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              onPress={() => handleMarkerPress(restaurant)}
              style={{
                zIndex: restaurant.id === activeMarker?.id ? 1 : 0,
              }}
            >
              <SvgMarker
                size={48}
                isActive={restaurant.id === activeMarker?.id}
                zIndex={restaurant.id === activeMarker?.id ? 1 : 0}
              />
            </Marker>
          );
        })}
      </MapView>

      {!scrollViewHidden && (
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: mapAnimation } } }],
            { useNativeDriver: true }
          )}
          onScrollBeginDrag={() => setIsScrollViewDragging(true)}
          onScrollEndDrag={() => setIsScrollViewDragging(false)}
          onMomentumScrollEnd={handleScrollViewScroll}
        >
          {
          restaurantsData?.data?.restaurants &&
          restaurantsData.data.restaurants.map((marker, index) => (
            <TouchableOpacity
              key={`card-${marker.id}`}
              onPress={() => handleNavigation(marker)}
            >
              <FloatingRestaurantCard
                key={marker.id as string}
                marker={marker}
                isClaimLoading={isClaimLoading}
                onPress={() => handleNavigation(marker)}
              />
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: Color.Gray.gray600,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationToggleContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 40,
    right: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  locationToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationToggleText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 5,
  },
  scrollView: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: SPACING_FOR_CARD_INSET,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
})