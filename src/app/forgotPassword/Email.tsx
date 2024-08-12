import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Button from "@/components/ui/Button";
import Color from "@/constants/Color";
import Steps from "@/components/atom/Steps";
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "@/lib/store/passwordStore";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkEmail, sendOtp } from "@/lib/service/mutationHelper";
import { router } from "expo-router";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H5 } from "@/constants/typography";

function ForgotPassword() {
  const { email, setEmail } = usePasswordStore();
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<"Email" | "Password" | null>(
    null,
  );

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtp,
  });

  const { mutateAsync: checkEmailMutation } = useMutation({
    mutationFn: checkEmail,
    onError: (error) => {
      console.log(error);
    },
  });

  const handleNavigation = async () => {
    try {
      if (email) {
        setLoading(true);

        await sendOtpMutation({
          email: email,
        });
        setLoading(false);
        router.push({
          pathname: "/forgotPassword/VerificationCode",
        });
      }
    } catch (error) {
      console.log("Error sending OTP");
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const inputContainerRef = React.useRef(null);

  return (
    <>
      <Header title="Forgot password?" />
      <Steps activeStep={1} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={{
                  width: "100%",
                  borderRadius: 32,
                  marginTop: 16,
                  borderWidth: 1,
                  borderColor: Color.Gray.gray400,
                  paddingBottom: 16,
                  paddingTop: 24,
                  paddingHorizontal: 16,
                }}
              >
                <View style={styles.textContainer}>
                  <View style={{ gap: 8 }}>
                    <Text style={styles.topText}>Email</Text>
                    <Text style={styles.bottomText}>
                      We will send an email verification code.
                    </Text>
                  </View>
                  <LinearGradient
                    colors={
                      focusedInput === "Email"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      marginTop: 10,
                      borderRadius: 16,
                      padding: 1,
                    }}
                  >
                    <View
                      ref={inputContainerRef}
                      style={{
                        alignItems: "center",
                        gap: 12,
                        alignContent: "center",
                        flexDirection: "row",
                        height: 48,
                        paddingHorizontal: 16,
                        width: "100%",
                        backgroundColor: Color.Gray.gray500,
                        borderRadius: 16,
                      }}
                    >
                      <TextInput
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder={"Enter your email"}
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("Email")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          height: 40,
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                        }}
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>

            <View style={[styles.buttonContainer, styles.bottomPosition]}>
              <Button
                variant={email ? "primary" : "disabled"}
                textStyle={email ? "primary" : "disabled"}
                size="default"
                onPress={handleNavigation}
              >
                {loading ? <ActivityIndicator /> : "Send code"}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  textContainer: {
    gap: 24,
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    paddingHorizontal: 20,
  },
  bottomPosition: {
    justifyContent: "flex-end",
  },

  topText: {
    ...H5,
    color: Color.base.White,
    textAlign: "center",
  },
  bottomText: {
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray100,
    textAlign: "center",
  },
});

export default ForgotPassword;
