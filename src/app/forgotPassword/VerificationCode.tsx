import React, { useState } from "react";
import {
  StyleSheet,
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
import { checkOtp } from "@/lib/service/mutationHelper";
import { useMutation } from "@tanstack/react-query";
import SplitOTPInput from "@/components/ui/OtpInput";
import { usePasswordStore } from "@/lib/store/passwordStore";

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
  const [text, onChangeText] = useState("");
  const [error, setError] = useState("");
  const { verificationCode, setVerificationCode, email } = usePasswordStore();
  const [loading, setLoading] = useState(false);

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
          verificationCode: verificationCode,
        });
        router.back();
        router.navigate({
          pathname: "/forgotPassword/NewPassword",
        });
        setLoading(false);
      }
    } catch (error) {
      setError("Invalid code");
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
                  We will send an email verification code.
                </Text>
              </View>
              <View style={{ marginTop: 12 }}>
                <SplitOTPInput codeLength={4} onCodeFilled={handleCodeFilled} />
              </View>
              <Text style={{ color: Color.System.systemError }}>{error}</Text>
            </View>
          </LinearGradient>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
          behavior={Platform.OS === "ios" ? "height" : "padding"}
        >
          <View>
            <Button
              variant={text ? "primary" : "disabled"}
              textStyle={text ? "primary" : "disabled"}
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
  topPosition: {
    justifyContent: "flex-start",
    marginTop: "auto",
  },
});

export default SplitOTP;
