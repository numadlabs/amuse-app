import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Color from "../../constants/Color";
import * as Progress from "react-native-progress";
import { router } from "expo-router";

const QuickInfo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.textContainer}>
          <Text style={styles.topTitle}>Boost your rewards.</Text>
          <Text style={styles.bottomTitle}>More data, more Bitcoin.</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("(boost)/Email")}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
        <Progress.Bar
          color={Color.Gray.gray600}
          progress={0.25}
          height={8}
          borderRadius={32}
          width={281}
          useNativeDriver
          unfilledColor={Color.Gray.gray50}
          borderColor="transparent"
        />
        <Text style={styles.progressPerc}>25%</Text>
      </View>
    </View>
  );
};

export default QuickInfo;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  textContainer: {
    gap: 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Color.Gray.gray600,
  },
  bottomTitle: {
    fontSize: 12,
    color: Color.Gray.gray400,
  },
  button: {
    borderRadius: 48,
    backgroundColor: Color.base.Black,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 13,
    fontWeight: "bold",
  },
  progressPerc: {
    fontSize: 10,
    color: Color.Gray.gray600,
    fontWeight: "bold",
    marginLeft: 8, 
  },
});
