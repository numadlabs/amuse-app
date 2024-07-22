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

const throttle = (func, delay) => {
  let throttling = false;

  return (...args) => {
    console.log("throttle function called");
    if (!throttling) {
      console.log("Function execution allowed");
      throttling = true;
      func(...args);
      setTimeout(() => {
        throttling = false;
      }, delay);
    } else {
      console.log("throttle Function execution blocked");
    }
  };
};

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

  const throttledCenter = useMemo(() => {
    return throttle((marker) => {
      console.log("🚀 ~ returnthrottle ~ cardIndex:", marker.name);
      if (marker !== null) {
        const region = {
          latitude: marker.latitude,
          longitude: marker.longitude,
          latitudeDelta: mapLatitudeDelta,
          longitudeDelta: mapLongitudeDelta,
        };
        mapRef.current.animateToRegion(region, 150);
      }
    }, 250);
  }, []);

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
            <Gps size={24} color={Color.Gray.gray600} style={{ zIndex: 10 }} />
          </TouchableOpacity>
        </View> */}

        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          // title="Your Location"
          >
            <Image source={require("@/public/images/locationPin.png")} />
          </Marker>
        )}
        {restaurantsData?.data?.restaurants.map((restaurant, index) => {
          return (
            <Marker
              key={`marker-${index}`}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              onPress={() => handleMarkerPress(restaurant)}
            >
              {activeMarker?.id === restaurant.id ? (
                <SvgMarker
                  key={restaurant.id as string}
                  imageUrl={
                    `${SERVER_SETTING.CDN_LINK}${restaurant?.logo}` as string
                  }
                />
              ) : (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    padding: 4,
                    backgroundColor: Color.base.White,
                    borderRadius: 48,
                  }}
                />
              )}
            </Marker>
          );
        })}
      </MapView>
      {/* {!scrollViewHidden && ( */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={400}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 10,
          right: SPACING_FOR_CARD_INSET,
        }}
        onMomentumScrollEnd={() => setIsScrollViewDragging(false)}
        onScrollBeginDrag={() => setIsScrollViewDragging(true)}
        // onScrollEndDrag={() => setIsScrollViewDragging(false)}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: mapAnimation } } }],
          { useNativeDriver: true, listener: handleScrollViewScroll }
        )}
        decelerationRate={0.1}
      >
        {!scrollViewHidden &&
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
      {/* )} */}

      {/* <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#212121",
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    paddingVertical: 10,
    marginBottom: 36,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },

  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    // shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  signIn: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: "bold",
  },
  gpsButton: {
    backgroundColor: Color.base.White,
    padding: 12,
    borderRadius: 48,
    zIndex: 10,
    width: 48,
    height: 48,
    alignSelf: "flex-end",
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: Color.Gray.gray500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  locationToggleContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  locationToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  locationToggleText: {
    color: "#333",
  },
});
