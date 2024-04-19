import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Color from "../../constants/Color";
import * as Progress from "react-native-progress";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../ui/Button";

const QuickInfo = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={{ 
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 24, 
            borderRadius: 16 }}
        >
      <View style={styles.container1}>
        <View style={styles.textContainer}>
          <Text style={styles.topTitle}>Boost your rewards</Text>
          <Text style={styles.bottomTitle}>More data, more Bitcoin.</Text>
        </View>
        <View>
          <Button
          variant="primary"
          onPress={() => router.push("(boost)/Email")}>
            <Text style={{ color: Color.base.White }}>
            Start
            </Text>
          </Button>
        </View>
      </View>
      <View style={styles.container2}> 
        <Progress.Bar
          color={Color.Gray.gray50}
          progress={0.25}
          height={8}
          borderRadius={32}
          width={281}
          useNativeDriver
          unfilledColor={Color.Gray.gray400}
          borderColor={Color.Gray.gray400}
        />
        <Text style={styles.progressPerc}>25%</Text>
      </View>
      </LinearGradient>
    </View>
  );
};

export default QuickInfo;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    height: '90%'
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  textContainer: {
    gap: 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Color.base.White,
  },
  bottomTitle: {
    fontSize: 12,
    color: Color.Gray.gray100,
  },
  button: {
    borderRadius: 48,
    backgroundColor: Color.base.Black,
    paddingVertical: 12,
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 13,
    fontWeight: "bold",
  },
  progressPerc: {
    fontSize: 10,
    color: Color.base.White,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
