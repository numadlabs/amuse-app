import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Color from "@/app/constants/Color";

const ProgressBar = ({ progress, width, height, isActive }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      {isActive === true ? (
        <LinearGradient
          colors={[Color.Brand.main.start, Color.Brand.main.end]}
          start={[1, 1]}
          end={[1, 0]}
          style={[styles.progressBar, { width: `${progress * 100}%`, height }]}
        />
      ) : (
        <View style={[styles.progressBar, { width: '100%', height }]} />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: Color.Gray.gray400
  },
  progressBar: {
    borderRadius: 5,
  },
});

export default ProgressBar;
