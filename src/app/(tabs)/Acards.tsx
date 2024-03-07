import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RestaurantListView from "../components/sections/RestaurantListView";
import RestaurantMapView from "../components/sections/RestaurantMapView";
import Color from "../constants/Color";

const Acards = () => {
  const [showMapView, setShowMapView] = useState(true);

  const toggleView = () => {
    setShowMapView(!showMapView);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.base.White }}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title="Map View"
            onPress={() => setShowMapView(true)}
            color={showMapView ? Color.Gray.gray100 : Color.Gray.gray100}
          />
          <Button
            title="List View"
            onPress={() => setShowMapView(false)}
            color={!showMapView ? Color.Gray.gray100 : Color.Gray.gray100}
          />
        </View>
        {showMapView ? <RestaurantMapView /> : <RestaurantListView />}
      </View>
    </SafeAreaView>
  );
};
export default Acards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.base.White,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 0,
  },
});
