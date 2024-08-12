import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RestaurantListView from "@/components/sections/RestaurantListView";
import RestaurantMapView from "@/components/sections/RestaurantMapView";
import Color from "@/constants/Color";
import Animated, {
  withSpring,
  useSharedValue,
  ReduceMotion,
} from "react-native-reanimated";
import { BUTTON_40 } from "@/constants/typography";

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
          {/* <View style={styles.header}>
            <View style={styles.searchBar}>
              <SearchNormal1 color={Color.Gray.gray600} />
              <TextInput placeholder="Search@." style={styles.searchInput} />
            </View>
            <TouchableOpacity onPress={() => { }}>
              <Setting4 color={Color.Gray.gray600} />
            </TouchableOpacity>
          </View> */}
          <View style={{ padding: 16 }}>
            <Animated.View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  showMapView && styles.activeButton,
                ]}
                onPress={() => toggleView(true)}
              >
                <Text
                  style={[styles.buttonText, !showMapView && styles.activeText]}
                >
                  Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !showMapView && styles.activeButton,
                ]}
                onPress={() => toggleView(false)}
              >
                <Text
                  style={[styles.buttonText, showMapView && styles.activeText]}
                >
                  List
                </Text>
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
    backgroundColor: Color.Gray.gray600,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Color.Gray.gray500,
    paddingVertical: 4,
    borderRadius: 48,
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    ...BUTTON_40,
    color: Color.base.White,
  },
  activeButton: {
    backgroundColor: Color.Gray.gray400,
    borderRadius: 48,
  },
  activeText: {
    color: Color.base.White,
  },
});

export default Acards;
