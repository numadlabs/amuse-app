import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../../constants/Color";
import { router } from "expo-router";
import Button from "../ui/Button";
import ProgressBar from "./ProgressBar";
import { width } from "@/app/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import CloseSm from "../icons/CloseSm";

const QuickInfo = ({ user, onPress }) => {
  const [progress, setProgress] = useState(0);

  console.log(user);

  useEffect(() => {
    if (user) {
      const totalFields = 4;
      const filledFields = [
        user?.nickname,
        user?.email,
        user?.location,
        user?.dateOfBirth,
      ].filter((field) => field !== null).length;
      const newProgress = filledFields / totalFields;
      setProgress(newProgress);
    }
  }, [user]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push("(boost)/Email")}>
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 24,
          borderRadius: 20,
        }}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onPress}>
          <CloseSm />
        </TouchableOpacity>
        <View style={styles.container1}>
          <View style={styles.textContainer}>
            <Text style={styles.topTitle}>Earn 1.2x more reward</Text>
            <Text style={styles.bottomTitle}>By completing your profile.</Text>
          </View>
        </View>
        <View style={styles.container2}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <ProgressBar progress={progress} width={"85%"} height={8} />
            <Text
              style={{
                color: Color.base.White,
                fontSize: 12,
                lineHeight: 16,
                fontWeight: "700",
              }}
            >{`${progress * 100}%`}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default QuickInfo;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    height: "90%",
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width / 1.24,
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
  closeButton: {
    zIndex:99,
    height: 32,
    width: 32,
    backgroundColor: Color.Gray.gray400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    position: "absolute",
    right: 12,
    top: 12,
  },
});
