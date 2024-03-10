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
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useMutation, useQuery, useQueryClient } from "react-query";
import FloatingRestaurantCard from "../atom/cards/FloatingRestCard";
import useLocationStore from "@/app/lib/store/userLocation";
import SvgMarker from "../atom/svgMarker";
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
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  const [initialRegion, setInitialRegion] = useState(null);
  const [scrollViewHidden, setScrollViewHidden] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    if (currentLocation) {
      setInitialRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      });
    }
  }, [currentLocation]);

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

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= restaurantsData?.data?.restaurants.length) {
        index = restaurantsData?.data?.restaurants.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      // const regionTimeout = setTimeout(() => {
      if (mapIndex !== index) {
        mapIndex = index;
        const { longitude, latitude } =
          restaurantsData?.data?.restaurants[index];
        setSelectedMarkerId(restaurantsData?.data?.restaurants[index].id);
        const region = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: mapLatitudeDelta,
          longitudeDelta: mapLongitudeDelta,
        };
        mapRef.current.animateToRegion(region, 350);
      }
      // }, 10);
      // clearTimeout(regionTimeout);
    });
  });

  // console.log(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);

  const handleCalloutPress = (selectedMarker: RestaurantType) => {
    // Do something with the selected marker (e.g., center the map)
    // setSelectedMarker(selectedMarker);
    if (selectedMarker) {
      setScrollViewHidden(false);
      const region = {
        latitude: selectedMarker.latitude,
        longitude: selectedMarker.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      };
      // mapRef.current.animate
      mapRef.current.animateToRegion(region, 150);
      console.log("Callout pressed for:", selectedMarker);

      // Find the index of the selected marker
      const index = restaurantsData?.data?.restaurants.findIndex(
        (restaurant) => restaurant.id === selectedMarker.id
      );

      // Calculate the x-offset based on the index
      const x = index * CARD_WIDTH;

      // Scroll to the card in the ScrollView
      scrollViewRef.current.scrollTo({ x, animated: true });
      setSelectedMarkerId(selectedMarker.id);
    }
    // You can set the selected marker state here if needed
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
      }
    }
  };
  const router = useRouter();

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
        nftImageUrl: restaurant.nftImageUrl,
      },
    });
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
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        // showsUserLocation={true}
      >
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
        {restaurantsData?.data?.restaurants.map((restaurant) => {
          return (
            <Marker
              key={`marker-${restaurant.id}`}
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
                <SvgMarker imageUrl={restaurant.nftImageUrl as string} />
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
        {!scrollViewHidden &&
          restaurantsData?.data?.restaurants &&
          restaurantsData.data.restaurants.map((marker) => (
            <TouchableOpacity
              key={`card-${marker.id}`}
              onPress={() => handleNavigation(marker)}
            >
              <FloatingRestaurantCard
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
    marginBottom:36
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
});
