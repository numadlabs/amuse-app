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

const Email = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { onRegister } = useAuth();
  const { email, setEmail } = useBoostInfoStore();

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

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  return (
    <>
      <Steps activeStep={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.base.White }}>
            <View style={styles.body}>
              <View style={styles.textContainer}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.topText}>Email</Text>
                  <Text style={styles.bottomText}>
                  Restaurants will use this to get in touch for things like priority reservations. Spam is so 20th century.
                  </Text>
                </View>
                <TextInput
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={email} // Set the value of the input to the email from the Zustand store
                  onChangeText={handleEmailChange} // Call the handleEmailChange function when the text changes
                  autoCapitalize="none"
                  placeholder="Email"
                  style={
                    isFocused
                      ? {
                          borderColor: Color.Gray.gray600,
                          height: 48,
                          borderWidth: 1,
                          borderRadius: 16,
                          paddingHorizontal: 16,
                          marginTop: 10,
                        }
                      : {
                          height: 48,
                          borderWidth: 1,
                          borderColor: Color.Gray.gray100,
                          borderRadius: 16,
                          paddingHorizontal: 16,
                          marginTop: 10,
                        }
                  }
                />
              </View>
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
                onPress={() => router.push("(boost)/Area")}
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

export default Email;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
    borderRadius: 32,
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
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
    color: Color.Gray.gray500,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray400,
    fontSize: 12,
    textAlign: "center",
  },
});
