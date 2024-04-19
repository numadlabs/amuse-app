import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import PrimaryButton from "../components/atom/button/PrimaryButton";
import Button from "../components/ui/Button";
import { router, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useBoostInfoStore from "../lib/store/boostInfoStore";
import { LinearGradient } from "expo-linear-gradient";

const Area = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { area, setArea } = useBoostInfoStore();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setButtonPosition("top")
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setButtonPosition("bottom")
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleAreaChange = (text: string) => {
    setArea(text);
  };

  return (
    <>
      <Steps activeStep={2} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
            <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={{
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: Color.Gray.gray400,
                  borderRadius: 32,
                }}
              >
              <View style={styles.textContainer}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.topText}>Area</Text>
                  <Text style={styles.bottomText}>
                  Restaurants love locals. Get rewarded extra for {"\n"} staying close to home.
                  </Text>
                </View>
                <TextInput
                  value={area} // Set the value of the input to the area from the Zustand store
                  onChangeText={handleAreaChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Area (ex. Dubai Marina)"
                  style={
                    isFocused
                      ? {
                          borderColor: Color.Gray.gray300,
                          height: 48,
                          borderWidth: 1,
                          borderRadius: 16,
                          paddingHorizontal: 16,
                          marginTop: 10,
                          color: Color.base.White
                        }
                      : {
                          height: 48,
                          borderWidth: 1,
                          borderColor: Color.Gray.gray300,
                          borderRadius: 16,
                          paddingHorizontal: 16,
                          marginTop: 10,
                          color: Color.base.White
                        }
                  }
                />
              </View>
              </LinearGradient>
            </View>
            <View
              style={[
                styles.buttonContainer,
                buttonPosition === "bottom"
                  ? styles.bottomPosition
                  : styles.topPosition,
              ]}
            >
              <Button
                variant="primary"
                textStyle="primary"
                size="default"
                onPress={() => router.push("(boost)/Birthday")}
              >
                Continue
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Area;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
    borderRadius: 32,
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomPosition: {
    justifyContent: "flex-end",
  },
  topPosition: {
    justifyContent: "flex-start",
    marginTop: "auto",
  },
  topText: {
    color: Color.base.White,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    fontSize: 12,
    textAlign: "center",
  },
});
