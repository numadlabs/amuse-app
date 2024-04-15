import { useAuth } from "@/app/context/AuthContext";
import { restaurantKeys } from "@/app/lib/service/keysHelper";
import { getAcard } from "@/app/lib/service/mutationHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { RestaurantType } from "@/app/lib/types";
import { GetRestaurantsResponseType } from "@/app/lib/types/apiResponseType";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useMutation, useQuery, useQueryClient } from "react-query";
import FloatingRestaurantCard from "../atom/cards/FloatingRestCard";
import useLocationStore from "@/app/lib/store/userLocation";
import SvgMarker from "../atom/svgMarker";
import Color from "@/app/constants/Color";
import Toast from "react-native-toast-message";
import { Gps } from "iconsax-react-native";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const mapLatitudeDelta = 0.008;
const mapLongitudeDelta = 0.008;

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.business",
    elementType: "labels.text.fill",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

export default function RestaurantMapView() {
  const { authState } = useAuth();
  const { currentLocation } = useLocationStore();
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState("current");
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const prevMarkerToScrollTo = useRef<RestaurantType | null>(null);

  const [initialRegion, setInitialRegion] = useState(null);
  const [scrollViewHidden, setScrollViewHidden] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const [markerToScrollTo, setMarkerToScrollTo] =
    useState<RestaurantType | null>(null);
  const [cardIndexToScrollTo, setCardIndexToScrollTo] = useState<number | null>(
    null
  );

  let mapAnimation = new Animated.Value(0);

  // useEffect(() => {
  //   if (currentLocation) {
  //     setInitialRegion({
  //       latitude: currentLocation.latitude,
  //       longitude: currentLocation.longitude,
  //       latitudeDelta: mapLatitudeDelta,
  //       longitudeDelta: mapLongitudeDelta,
  //     });
  //   }
  // }, [currentLocation]);
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
        distance: 10000,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    // onError(error):{
    //   console.log(error)
    // }

    enabled: !!currentLocation,
  });

  const { mutateAsync: createGetAcardMutation } = useMutation({
    mutationFn: getAcard,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {},
  });

  const handleMapAnimation = ({ value }) => {
    let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    if (index >= restaurantsData?.data?.restaurants.length) {
      index = restaurantsData?.data?.restaurants.length - 1;
    }
    if (index <= 0) {
      index = 0;
    }

    setSelectedMarkerId(restaurantsData?.data?.restaurants[index].id);
    setMarkerToScrollTo(restaurantsData?.data?.restaurants[index]);
  };

  useEffect(() => {
    const listener = mapAnimation.addListener(handleMapAnimation);

    return () => {
      mapAnimation.removeListener(listener);
    };
  }, [mapAnimation]); // Added mapAnimation as a dependency

  const handleCalloutPress = (marker: RestaurantType) => {
    // setSelectedMarker(marker);
    setScrollViewHidden(false);
    setMarkerToScrollTo(marker);

    // Find the index of the selected marker in the restaurantsData array
    const cardIndex = restaurantsData?.data?.restaurants.findIndex(
      (restaurant) => restaurant.id === marker.id
    );
    console.log("🚀 ~ handleCalloutPress ~ cardIndex:", cardIndex);

    // If the index is found, set the cardIndexToScrollTo state
    if (cardIndex !== undefined) {
      setCardIndexToScrollTo(cardIndex);
    }
  };

  useEffect(() => {
    if (markerToScrollTo && markerToScrollTo !== prevMarkerToScrollTo.current) {
      // console.log("🚀 ~ useEffect ~ markerToScrollTo:", markerToScrollTo.id);
      // if (prevMarkerToScrollTo.current) {
      //   console.log(
      //     "🚀 ~ useEffect ~ prevMarkerToScrollTo.current:",
      //     prevMarkerToScrollTo?.current?.id
      //   );
      // }
      setSelectedMarkerId(markerToScrollTo.id);
      const region = {
        latitude: markerToScrollTo.latitude,
        longitude: markerToScrollTo.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      };
      mapRef.current.animateToRegion(region, 150);
      prevMarkerToScrollTo.current = markerToScrollTo;
    }
  }, [markerToScrollTo]);

  useEffect(() => {
    if (
      cardIndexToScrollTo !== null &&
      scrollViewRef.current &&
      scrollViewHidden == false
    ) {
      setTimeout(() => {
        const x = cardIndexToScrollTo * CARD_WIDTH;
        scrollViewRef.current.scrollTo({ x, animated: true });
      }, 500); // 500 milliseconds = 0.5 seconds
    }
  }, [cardIndexToScrollTo, scrollViewHidden]);

  const showToast = () => {
    Toast.show({
      type: "perkToast",
      text1: "Added membership card",
    });
  };

  const handleGetAcard = async (acardId: string) => {
    console.log("🚀 ~ RestaurantMapView ~ aCardId:", acardId);
    setIsClaimLoading(true);
    if (authState.userId) {
      // const data
      // try {
      // const response = await getRestaurantCardById(restaurantId);

      // console.log(
      //   "🚀 ~ handleGetAcard ~ response.data.cards[0].id:",
      //   response.data.cards[0].id
      // );
      const data = await createGetAcardMutation({
        userId: authState.userId,
        cardId: acardId,
      });
      if (data.data.success) {
        queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
        setIsClaimLoading(false);
        showToast();
      }
    }
  };
  const router = useRouter();

  const handleNavigation = (restaurant: RestaurantType) => {
    if(restaurant.isOwned){
      router.push({
        pathname: `/Acards/${restaurant.id}`,
        params: {
          id: restaurant.id,
          cardId: restaurant.cardId,
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
    } else {
      router.push({
        pathname: `/restaurants/${restaurant.id}`,
        params: {
          cardId: restaurant.cardId,
          id: restaurant.id
        },
      });
    }
  };

  

  return (
    <View style={styles.container}>
      {/* <GooglePlacesAutocomplete
        placeholder="Search or move the map"
        fetchDetails={true}
        onPress={(data, details) => {
          console.log("🚀 ~ RestaurantMapView ~ data:", data);
          const point = details?.geometry?.location;
          console.log("🚀 ~ RestaurantMapView ~ point:", point);
          if (!point) return;
          // setLocation({
          //   ...location,
          //   latitude: point.lat,
          //   longitude: point.lng,
          // });
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={24} color="green" />
          </View>
        )}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            backgroundColor: "#EEE9F0",
            paddingLeft: 35,
            borderRadius: 10,
          },
          textInputContainer: {
            padding: 8,
            backgroundColor: "#fff",
          },
        }}
      /> */}
      {/* <Header title="Map" /> */}

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 25.276987,
          longitude: 55.296249,
          latitudeDelta: 0.1, // Adjust the delta values for desired zoom level
          longitudeDelta: 0.1,
        }} // Pass the initialRegion prop here
        customMapStyle={mapStyle}
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
              onPress={() => handleCalloutPress(restaurant)}
            >
              {selectedMarkerId === restaurant.id ? (
                // <Image
                //   source={require("@/public/images/restaurantPin.png")}
                //   style={{ width: 32, height: 32 }}
                // />
                <SvgMarker
                  key={restaurant.id as string}
                  imageUrl={
                    `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${restaurant.logo}` as string
                  }
                />
              ) : (
                <Image
                  source={require("@/public/images/map_marker.png")}
                  style={{ width: 32, height: 32 }}
                />
              )}
            </Marker>
          );
        })}
      </MapView>
      {!scrollViewHidden && (
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          style={styles.scrollView}
          contentInset={{
            top: 0,
            left: SPACING_FOR_CARD_INSET,
            bottom: 0,
            right: SPACING_FOR_CARD_INSET,
          }}
          contentContainerStyle={{
            paddingHorizontal:
              Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: mapAnimation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
        >
          {restaurantsData?.data?.restaurants &&
            restaurantsData.data.restaurants.map((marker, index) => (
              <TouchableOpacity
                key={`card-${marker.id}`}
                onPress={() => handleNavigation(marker)}
              >
                <FloatingRestaurantCard
                  key={marker.id as string}
                  marker={marker}
                  isClaimLoading={isClaimLoading}
                  onPress={() => {
                    const aCardId = marker.cardId;
                    handleGetAcard(aCardId);
                  }}
                />
              </TouchableOpacity>
            ))}
        </Animated.ScrollView>
      )}

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
    bottom: 0,
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
