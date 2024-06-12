import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import Button from "../components/ui/Button";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export enum KeyBoardTypes {
  default = "default",
  email = "email-address",
  numeric = "numeric",
  phone = "phone-pad",
  url = "url",
  number = "number-pad",
  unset = "unset",
}

const SplitOTP = () => {
  const { phoneNumber, prefix } = useLocalSearchParams();
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const [text, onChangeText] = useState("");
  let inputRef = useRef(null);
  const onPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  console.log(phoneNumber, prefix);

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

  const navigation = useNavigation();

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const handleNavigation = () => {
    if(text){
      router.navigate({
        pathname: "/forgotPassword/NewPassword",
        params: {
          phoneNumber: phoneNumber,
          prefix: prefix,
        },
      });
    }
  };

  const otpContent = useMemo(
    () => (
      <View style={styles.containerStyle}>
        {Array.from({ length: 4 }).map((_, i) => (
          <LinearGradient
            colors={
              isFocused
                ? [Color.Brand.main.start, Color.Brand.main.end]
                : [Color.Gray.gray500, Color.Gray.gray500]
            }
            start={[0, 1]}
            end={[1, 0]}
            style={{
              marginTop: 10,
              padding: 1,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: Color.Gray.gray500,
                borderRadius: 16,
              }}
            >
              <Text
                key={i}
                onPress={onPress}
                style={[
                  styles.textStyle,
                  text[i] ? styles.filledStyle : {},
                  text[i]
                    ? { borderColor: Color.Gray.gray300 }
                    : { borderColor: Color.Gray.gray300 },
                ]}
              >
                {text[i]}
              </Text>
            </View>
          </LinearGradient>
        ))}
      </View>
    ),
    [text, isFocused]
  );

  return (
    <>
      <Steps activeStep={2} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <View style={styles.container}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={{
                  width: "100%",
                  borderRadius: 32,
                  marginTop: 16,
                  borderWidth: 1,
                  borderColor: Color.Gray.gray400,
                  paddingBottom: 32,
                  paddingTop: 24,
                  paddingHorizontal: 16,
                }}
              >
                <View style={styles.textContainer}>
                  <View>
                    <Text style={styles.topText}>Verification code</Text>
                  </View>
                  <View>
                    <Text style={styles.bottomText}>
                      We will send an SMS verification code.
                    </Text>
                  </View>
                </View>
                <SafeAreaView style={styles.safeAreaStyle}>
                  <TextInput
                    maxLength={4}
                    ref={inputRef}
                    style={styles.input}
                    onChangeText={(text) => onChangeText(text)}
                    value={text}
                    keyboardType={KeyBoardTypes.number}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  {otpContent}
                </SafeAreaView>
              </LinearGradient>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={100}
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
                  variant={text ? "primary" : 'disabled'}
                  textStyle={text ? "primary" : 'disabled'}
                  size="default"
                  onPress={handleNavigation}
                >
                  Continue
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    height: "100%",
    paddingHorizontal: 16,
  },
  container: {
    borderRadius: 32,
    marginTop: 16,
  },
  input: {
    height: 0,
    width: 0,
    color: Color.base.White,
  },
  inputFocused: {
    borderColor: Color.base.White,
  },
  containerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  textStyle: {
    height: 48,
    width: 48,
    borderWidth: 1,
    borderRadius: 16,
    fontSize: 16,
    textAlign: "center",
    padding: 12,
    color: Color.base.White,
  },
  filledStyle: {
    overflow: "hidden",
  },
  titleStyle: {
    fontSize: 24,
    marginVertical: 14,
  },
  safeAreaStyle: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  topText: {
    color: Color.base.White,
    fontWeight: "bold",
    fontSize: 24,
  },
  bottomText: {
    color: Color.Gray.gray100,
    fontSize: 12,
    lineHeight: 16,
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
});

export default SplitOTP;
