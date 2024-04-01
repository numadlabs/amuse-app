import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RestaurantListView from "../components/sections/RestaurantListView";
import RestaurantMapView from "../components/sections/RestaurantMapView";
import Color from "../constants/Color";
import { SearchNormal1, Setting4 } from "iconsax-react-native";
import Animated, { withSpring, useSharedValue, ReduceMotion } from 'react-native-reanimated';
import { StatusBar } from "expo-status-bar";

const Acards = () => {
  const [showMapView, setShowMapView] = useState(true);
  const toggleX = useSharedValue(0);

  const toggleView = (view) => {
    toggleX.value = withSpring(view ? 0 : 1, {
      mass: 1.5,
      damping: 80,
      stiffness: 398,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 20,
      reduceMotion: ReduceMotion.System,
    });
    setShowMapView(view);

  };


  return (
    <>
      <View style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <SearchNormal1 color={Color.Gray.gray600} />
              <TextInput placeholder="Search..." style={styles.searchInput} />
            </View>
            <TouchableOpacity onPress={() => { }}>
              <Setting4 color={Color.Gray.gray600} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 16 }}>
            <Animated.View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, !showMapView && styles.activeButton]}
                onPress={() => toggleView(false)}
              >
                <Text style={[styles.buttonText, !showMapView && styles.activeText]}>List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, showMapView && styles.activeButton]}
                onPress={() => toggleView(true)}
              >
                <Text style={[styles.buttonText, showMapView && styles.activeText]}>Map</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {showMapView ? <RestaurantMapView /> : <RestaurantListView />}
       
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: Color.base.White,
    borderBottomLeftRadius: 48,

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginRight: 10,
  },
  searchInput: {
    width: "70%",
    color: Color.Gray.gray600,
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Color.Gray.gray50,
    paddingVertical: 4,
    borderRadius: 48,
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: "center",
    width: '48%'
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: 'bold',
    color: Color.Gray.gray600,
  },
  activeButton: {
    backgroundColor: Color.base.White,
    borderRadius: 48,
  },
  activeText: {
    color: Color.base.Black,
  },
  });

export default Acards;
