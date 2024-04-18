import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Steps from "../components/atom/Steps";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import { useSignUpStore } from "../lib/store/signUpStore";
const NickName = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const { password, phoneNumber, prefix } = useLocalSearchParams();
  const { nickname, setNickname } = useSignUpStore();
  const [isFocused, setIsFocused] = useState(false);

  const { onRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await onRegister(
        nickname,
        prefix as string,
        phoneNumber as string,
        password as string
      );
      console.log(phoneNumber, password, nickname, prefix);
      if (response.data) {
        console.log("Register successful:", response.data);
        router.push("/(tabs)");
      } else {
        console.log("Register failed:", response.data);
      }
    } catch (error) {
      console.error("Error during register:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <Steps activeStep={3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              <View style={styles.textContainer}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.topText}>Nickname</Text>
                  <Text style={styles.bottomText}>
                    This will be shared with others. We want exclusive {"\n"}
                    invites to feel special.
                  </Text>
                </View>
                <TextInput
                  value={nickname}
                  onChangeText={setNickname}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholderTextColor={Color.Gray.gray100}
                  placeholder="Nickname"
                  style={
                    isFocused
                      ? {
                          borderColor: Color.Gray.gray100,
                          height: 48,
                          borderWidth: 1,
                          borderRadius: 16,
                          paddingHorizontal: 16,
                          marginTop: 10,
                          fontSize: 16,
                          color: Color.base.White
                        }
                      : {
                          height: 48,
                          borderWidth: 1,
                          borderColor: Color.Gray.gray300,
                          borderRadius: 16,
                          paddingHorizontal: 16,
                          marginTop: 10,
                          fontSize: 16,
                          color: Color.base.White
                        }
                  }
                />
              </View>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={110}
              behavior={Platform.OS === "ios" ? "height" : "padding"}
            >
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
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Finish
                    </Text>
                  )}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default NickName;

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
    backgroundColor: Color.Gray.gray500,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
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
    color: Color.base.White,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
});
