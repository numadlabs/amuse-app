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
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import FloatingRestaurantCard from "../atom/cards/FloatingRestCard";
import useLocationStore from "@/lib/store/userLocation";
import SvgMarker from "../atom/svgMarker";
import Color from "@/constants/Color";
import { mapStyle, SERVER_SETTING } from "@/constants/serverSettings";
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const mapLatitudeDelta = 0.1;
const mapLongitudeDelta = 0.1;

const MAP_STATE_KEY = 'RESTAURANT_MAP_STATE';

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
  const { currentLocation, isLoading: locationLoading, getLocation } = useLocationStore();
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [scrollViewHidden, setScrollViewHidden] = useState(true);
  const currentTime = moment().format("HH:mm:ss");
  const [cardIndexToScroll, setCardIndexToScroll] = useState<number | null>(null);
  const [mapState, setMapState] = useState(null);

  let mapAnimation = new Animated.Value(0);

  const [isScrollViewDragging, setIsScrollViewDragging] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const loadMapState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(MAP_STATE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setMapState(parsedState);
          setInitialRegion(parsedState.region);
        } else {
          setInitialRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: mapLatitudeDelta,
            longitudeDelta: mapLongitudeDelta,
          });
        }
      } catch (error) {
        console.error('Error loading map state:', error);
      }
    };
    loadMapState();
  }, [currentLocation]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.getMapBoundaries().then(async (bounds) => {
          const stateToSave = {
            region: {
              latitude: (bounds.northEast.latitude + bounds.southWest.latitude) / 2,
              longitude: (bounds.northEast.longitude + bounds.southWest.longitude) / 2,
              latitudeDelta: bounds.northEast.latitude - bounds.southWest.latitude,
              longitudeDelta: bounds.northEast.longitude - bounds.southWest.longitude,
            },
          };
          try {
            await AsyncStorage.setItem(MAP_STATE_KEY, JSON.stringify(stateToSave));
          } catch (error) {
            console.error('Error saving map state:', error);
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!scrollViewHidden && cardIndexToScroll !== null) {
      const timeoutId = setTimeout(() => {
        scrollToCardIndex(cardIndexToScroll);
        setCardIndexToScroll(null);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [scrollViewHidden, cardIndexToScroll]);

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,

      });
    },
    enabled: !locationLoading,
  });

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

  const memoizedMapView = useMemo(() => (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion || {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: mapLatitudeDelta,
        longitudeDelta: mapLongitudeDelta,
      }}
      customMapStyle={mapStyle}
      scrollEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}
    >
      <Marker
        coordinate={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Image source={require("@/public/images/locationPin.png")} />
      </Marker>
      {restaurantsData?.data?.restaurants.map((restaurant, index) => (
        <Marker
          key={`marker-${index}`}
          coordinate={{
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          }}
          onPress={() => handleMarkerPress(restaurant)}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <View style={styles.markerContainer}>
            {activeMarker?.id === restaurant.id ? (
              <SvgMarker
                key={restaurant.id as string}
                imageUrl={
                  `${SERVER_SETTING.CDN_LINK}${restaurant?.logo}` as string
                }
              />
            ) : (
              <View style={styles.inactiveMarker} />
            )}
          </View>
        </Marker>
      ))}
    </MapView>
  ), [initialRegion, currentLocation, restaurantsData, activeMarker]);

  return (
    <View style={styles.container}>
      {memoizedMapView}
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
  markerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveMarker: {
    width: 8,
    height: 8,
    backgroundColor: Color.base.White,
    borderRadius: 4,
  },
});