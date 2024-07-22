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
  ActivityIndicator,
} from "react-native";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import Button from "../components/ui/Button";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "../lib/store/passwordStore";
import { useMutation } from "@tanstack/react-query";
import { checkPasswordOtp } from "../lib/service/mutationHelper";
import Header from "../components/layout/Header";
import SplitOTPInput from "../components/ui/OtpInput";

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
  const {
    phoneNumber,
    prefix,
    verificationCode,
    setVerificationCode
  } = usePasswordStore()
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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


  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };


  const { mutateAsync: checkOtpMutation } = useMutation({
    mutationFn: checkPasswordOtp,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log(data);
    },
  });

  const handleNavigation = async () => {
    try {
      setLoading(true);
      const code = Number(text);
      setVerificationCode(isNaN(code) ? 0 : code);

      if (text && text.length === 4) {
        await checkOtpMutation({
          prefix: prefix,
          telNumber: phoneNumber,
          telVerificationCode: code,
        });
        setLoading(false);
        router.navigate({
          pathname: "/forgotPassword/NewPassword",
        });
      } else {
        setError("Please enter a valid 4-digit code");
        setLoading(false);
      }
    } catch (error) {
      setError("Invalid code");
      setLoading(false);
      console.log("OTP check failed:", error);
    }
  };

  const handleCodeFilled = (code) => {
    onChangeText(code);
  };




  return (
    <>
      <Header title='Forgot password?' />
      <Steps activeStep={2} />
      <KeyboardAvoidingView
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
                  <View style={{ marginTop: 12 }}>
                    <SplitOTPInput codeLength={4} onCodeFilled={handleCodeFilled} />
                  </View>
                </View>




              </LinearGradient>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={90}
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
                  variant={text && text.length === 4 ? "primary" : 'disabled'}
                  textStyle={text && text.length === 4 ? "primary" : 'disabled'}
                  size="default"
                  onPress={handleNavigation}
                >
                  {loading ? <ActivityIndicator /> : "Continue"}
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
    height: 20,
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
    justifyContent: 'center',
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
  },
  bottomPosition: {
    justifyContent: "flex-end",

    ...Platform.select({
      ios: {
        marginBottom: 50,
      },
      android: {
        marginBottom: 20,
      },
    }),
  },
  topPosition: {
    justifyContent: "flex-start",
    ...Platform.select({
      ios: {
        marginBottom: 50,
      },
      android: {
        marginBottom: 20,
      },
    }),
  },
});

export default SplitOTP;
