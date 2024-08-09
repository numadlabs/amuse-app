import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Color from "@/constants/Color";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSignUpStore } from "@/lib/store/signUpStore";
import { checkOtp } from "@/lib/service/mutationHelper";
import { useMutation } from "@tanstack/react-query";
import SplitOTPInput from "@/components/ui/OtpInput";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CAPTION_1_REGULAR, H5 } from "@/constants/typography";

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
  const [loading, setLoading] = useState(false);
  const [text, onChangeText] = useState("");
  const [error, setError] = useState("");
  const { verificationCode, setVerificationCode, email } = useSignUpStore();

  const { mutateAsync: checkOtpMutation } = useMutation({
    mutationFn: checkOtp,
  });

  const handleNavigation = async () => {
    try {
      setLoading(true);
      const code = Number(text);
      if (text) {
        await checkOtpMutation({
          email: email,
          verificationCode: code,
        });
        setVerificationCode(isNaN(code) ? 0 : code);

        router.back();
        router.navigate({
          pathname: "/signUp/Password",
        });
        setLoading(false);
      }
    } catch (error) {
      setError("Invalid code");
      console.log("OTP check failed:", error);
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  const handleCodeFilled = (code) => {
    onChangeText(code);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={styles.gradientContainer}
            >
              <View style={styles.textContainer}>
                <View>
                  <Text style={styles.topText}>Verification code</Text>
                </View>
                <View>
                  <Text style={styles.bottomText}>
                    We will send an email verification code.
                  </Text>
                </View>
                <View style={{ marginTop: 12 }}>
                  <SplitOTPInput
                    codeLength={4}
                    onCodeFilled={handleCodeFilled}
                  />
                </View>
                {error && (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={{ color: Color.System.systemError }}>
                      {error}
                    </Text>
                  </Animated.View>
                )}
              </View>
            </LinearGradient>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              variant={text && text.length === 4 ? "primary" : "disabled"}
              textStyle={text && text.length === 4 ? "primary" : "disabled"}
              size="default"
              onPress={handleNavigation}
            >
              {loading ? <ActivityIndicator /> : "Continue"}
            </Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  gradientContainer: {
    width: "100%",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    paddingBottom: 32,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  topText: {
    color: Color.base.White,
    ...H5,
  },
  bottomText: {
    color: Color.Gray.gray100,
    ...CAPTION_1_REGULAR,
  },
  buttonWrapper: {
    marginBottom: 80,
    paddingHorizontal: 16,
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

  topPosition: {
    justifyContent: "flex-start",
    marginBottom: "auto",
  },
});

export default SplitOTP;
