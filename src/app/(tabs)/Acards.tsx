import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../constants/Color";
import RestaurantMapView from "../components/sections/RestaurantMapView";

const Acards = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.base.White }}>
      <View style={styles.container}>
        <RestaurantMapView />
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
});
