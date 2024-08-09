import Color from "@/constants/Color";
import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function BoostSteps({ activeStep }) {
  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={[styles.step, activeStep === 1 && styles.stepActive]}>
          {activeStep === 1 && (
            <LinearGradient
              colors={[Color.Brand.main.start, Color.Brand.main.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          )}
        </View>
        <View style={[styles.step, activeStep === 2 && styles.stepActive]}>
          {activeStep === 2 && (
            <LinearGradient
              colors={[Color.Brand.main.start, Color.Brand.main.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
    height: 24,
    alignItems: "center",
    backgroundColor: Color.Gray.gray600,
  },
  stepContainer: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Color.Gray.gray400,
  },
  step: {
    width: 96,
    height: 8,
  },
  stepActive: {
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
});

export default BoostSteps;
