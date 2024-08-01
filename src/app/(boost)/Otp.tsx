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
import Color from "../constants/Color";
import Button from "../components/ui/Button";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSignUpStore } from "../lib/store/signUpStore";
import { verifyEmailOtp } from "../lib/service/mutationHelper";
import { useMutation } from "@tanstack/react-query";
import SplitOTPInput from "../components/ui/OtpInput";
import useBoostInfoStore from "../lib/store/boostInfoStore";

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
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const [text, onChangeText] = useState("");
  const [loading, setLoading] = useState()
  const [error, setError] = useState("")
  const { email } = useBoostInfoStore()
  const [otp, setOtp] = useState<number>(0)
  const inputRef = useRef(null);
  const onPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const { mutateAsync: checkOtpMutation } = useMutation({
    mutationFn: verifyEmailOtp,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log(data);
    },
  });

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

  const handleNavigation = async () => {
    try {
      const code = Number(text);
      setOtp(isNaN(code) ? 0 : code);

      if (text) {
        await checkOtpMutation({
         email: email,
         emailVerificationCode: code
        });
        router.back()
        router.navigate({
          pathname: "/(boost)/Area",
        });
      }
    } catch (error) {
      setError("Invalid code")
      console.log("OTP check failed:", error);
    }
  };

  const handleCodeFilled = (code) => {
    onChangeText(code);
  };


  return (
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
              <SplitOTPInput 
                  codeLength={4} 
                  onCodeFilled={handleCodeFilled}
                />
              </View>
              <Text style={{ color: Color.System.systemError }}>
                {error}
              </Text>
            </View>


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
    marginVertical: 16,
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
    bottom: 0,
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