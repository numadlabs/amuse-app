import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import * as Location from "expo-location";
import { useQuery } from "react-query";
import { restaurantKeys } from "./lib/service/keysHelper";
import { getRestaurants } from "./lib/service/queryHelper";
import { baseUrl } from "./lib/axios";

export default function RestaurantMapView() {
  const navigation = useNavigation();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const [location, setLocation] = useState({
    latitude: 47.91173006997436,
    longitude: 106.92606443607056,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
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
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const { data } = useQuery({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getRestaurants({
        page: 1,
        limit: 10,
        distance: 5000,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    // onError(error):{
    //   console.log(error)
    // }

    enabled: !!currentLocation,
  });
  // console.log(baseUrl);
  console.log("🚀 ~ RestaurantMapView ~ data:", data.data.restaurants);
  // console.log(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search or move the map"
        fetchDetails={true}
        onPress={(data, details) => {
          const point = details?.geometry?.location;
          console.log("🚀 ~ RestaurantMapView ~ point:", point);
          if (!point) return;
          setLocation({
            ...location,
            latitude: point.lat,
            longitude: point.lng,
          });
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
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        // showsUserLocation={true}
        region={location}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          />
        )}
        {data.data.restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.name}
            description={restaurant.description}
          />
        ))}
      </MapView>
      <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
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
});
