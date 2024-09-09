import { restaurantKeys } from "@/lib/service/keysHelper";
import { getRestaurants } from "@/lib/service/queryHelper";
import { RestaurantType } from "@/lib/types";
import { GetRestaurantsResponseType } from "@/lib/types/apiResponseType";
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
  Text,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import FloatingRestaurantCard from "../atom/cards/FloatingRestCard";
import useLocationStore from "@/lib/store/userLocation";
import SvgMarker from "../atom/svgMarker";
import Color from "@/constants/Color";
import { mapStyle, SERVER_SETTING } from "@/constants/serverSettings";
import moment from "moment";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");
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
  const currentDayOfWeek = moment().isoWeekday();
  const { currentLocation, permissionStatus, getLocation } = useLocationStore();
  const [selectedLocation, setSelectedLocation] = useState("current");
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [scrollViewHidden, setScrollViewHidden] = useState(true);
  const currentTime = moment().format("HH:mm:ss");
  const [cardIndexToScroll, setCardIndexToScroll] = useState<number | null>(
    null
  );

  let mapAnimation = new Animated.Value(0);

  const [isScrollViewDragging, setIsScrollViewDragging] = useState(false);

  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (selectedLocation === "current" && currentLocation) {
      setInitialRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      });
    } else if (selectedLocation === "dubai") {
      setInitialRegion({
        latitude: 50.0755,
        longitude: 14.4378,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } else if (permissionStatus === Location.PermissionStatus.DENIED) {
      // Set location to Prague, Czechia if permission is denied
      setInitialRegion({
        latitude: 50.0755,
        longitude: 14.4378,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }, [currentLocation, selectedLocation, permissionStatus]);

  const { data: restaurantsData, isLoading: restaurantsLoading, error: restaurantsError } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,
      });
    },
    enabled: !!currentLocation,
  });

  useEffect(() => {
    if (!scrollViewHidden && cardIndexToScroll !== null) {
      const timeoutId = setTimeout(() => {
        scrollToCardIndex(cardIndexToScroll);
        setCardIndexToScroll(null);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [scrollViewHidden, cardIndexToScroll]);

  const findMarkerIndex = (marker) => {
    return restaurantsData?.data?.restaurants.findIndex(
      (restaurant) => restaurant.id === marker.id
    );
  };

  const handleMarkerPress = (marker) => {
    setActiveMarker(marker);
    const cardIndex = findMarkerIndex(marker);
    setScrollViewHidden(false);
    if (cardIndex !== undefined) {
      scrollToCardIndex(cardIndex);
      if (cardIndexToScroll == null) {
        setCardIndexToScroll(cardIndex);
      }
    }
  };

  const scrollToCardIndex = (index) => {
    if (scrollViewRef.current) {
      const x = index * (CARD_WIDTH + 20);
      scrollViewRef.current.scrollTo({ x, animated: true });
    }
  };

  const throttledCenter = useMemo(() => {
    return throttle((marker) => {
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

    if (index >= 0 && index < restaurantsData?.data?.restaurants.length) {
      const marker = restaurantsData?.data?.restaurants[index];

      if (marker && marker.id !== activeMarker?.id) {
        if (
          isScrollViewDragging == false &&
          activeMarker &&
          marker?.id == activeMarker?.id
        ) {
          setActiveMarker(marker);
          centerMapOnMarker(marker);
        } else if (isScrollViewDragging && marker) {
          setActiveMarker(marker);
          centerMapOnMarker(marker);
        }
      }
    } else {
      console.log("Index out of bounds");
    }
  };

  const centerMapOnMarker = (marker) => {
    if (mapRef.current) {
      const region = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      };
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

  if (permissionStatus === Location.PermissionStatus.DENIED) {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 50.0755,
            longitude: 14.4378,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          customMapStyle={mapStyle}
        >
          {restaurantsData?.data?.restaurants.map((restaurant, index) => {
            return (
              <Marker
                key={`marker-${index}`}
                hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion || {
          latitude: 50.0755,
          longitude: 14.4378,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        customMapStyle={mapStyle}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
          >
            <Image source={require("@/public/images/locationPin.png")} />
          </Marker>
        )}
        {restaurantsData?.data?.restaurants.map((restaurant, index) => {
          return (
            <Marker
              key={`marker-${index}`}
              hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
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
                onPress={() => handleNavigation(marker)}
              />
            </TouchableOpacity>
          ))}
      </Animated.ScrollView>
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
  scrollView: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    paddingVertical: 10,
    marginBottom: 36,
  },
  warningText: {
    color: Color.System.systemError,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    backgroundColor: Color.Gray.gray300,
  },
});