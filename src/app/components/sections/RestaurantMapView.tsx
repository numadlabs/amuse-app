import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import * as Location from "expo-location";
import { useQuery } from "react-query";
import { restaurantKeys } from "@/app/lib/service/keysHelper";
import { getRestaurants } from "@/app/lib/service/queryHelper";
import { baseUrl } from "@/app/lib/axios";
import { RestaurantType } from "@/app/lib/types";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default function RestaurantMapView() {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [scrollViewHidden, setScrollViewHidden] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const { data } = useQuery({
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

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= data?.data?.restaurants.length) {
        index = data?.data?.restaurants.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      // const regionTimeout = setTimeout(() => {
      if (mapIndex !== index) {
        mapIndex = index;
        const { longitude, latitude } = data?.data?.restaurants[index];
        setSelectedMarkerId(data?.data?.restaurants[index].id);
        const region = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        mapRef.current.animateToRegion(region, 350);
      }
      // }, 10);
      // clearTimeout(regionTimeout);
    });
  });

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    getLocation();
  }, []);

  // console.log(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);

  const handleCalloutPress = (selectedMarker: RestaurantType) => {
    // Do something with the selected marker (e.g., center the map)
    // setSelectedMarker(selectedMarker);
    if (selectedMarker) {
      setScrollViewHidden(false);
      const region = {
        latitude: selectedMarker.latitude,
        longitude: selectedMarker.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      // mapRef.current.animate
      mapRef.current.animateToRegion(region, 150);
      console.log("Callout pressed for:", selectedMarker);

      // Find the index of the selected marker
      const index = data?.data?.restaurants.findIndex(
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

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
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
      />
      {/* <Header title="Map" /> */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
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
        {data?.data?.restaurants.map((restaurant) => {
          return (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              onPress={() => handleCalloutPress(restaurant)}
            >
              {selectedMarkerId === restaurant.id ? (
                <Image source={require("@/public/images/restaurantPin.png")} />
              ) : (
                <Image
                  source={require("@/public/images/map_marker.png")}
                  style={{ width: 30, height: 30 }}
                />
              )}
              {/* <CustomCallout marker={restaurant} /> */}
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
          data?.data?.restaurants.map((marker, index) => (
            <View style={styles.card} key={index}>
              {/* <Image
              source={marker.image}
              style={styles.cardImage}
              resizeMode="cover"
            /> */}
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {marker.name}
                </Text>
                {/* <StarRating ratings={marker.rating} reviews={marker.reviews} /> */}
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>

                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[
                      styles.signIn,
                      {
                        borderColor: "#FF6347",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: "#FF6347",
                        },
                      ]}
                    >
                      Add a-card
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
