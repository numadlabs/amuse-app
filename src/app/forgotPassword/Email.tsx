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
import { checkEmail, sendOtp } from "@/lib/service/mutationHelper";
import { router } from "expo-router";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H5 } from "@/constants/typography";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

function ForgotPassword() {
  const { email, setEmail } = usePasswordStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<"Email" | "Password" | null>(
    null
  );

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtp,
  });

  const { mutateAsync: checkEmailMutation } = useMutation({
    mutationFn: checkEmail,
  });

  const handleNavigation = async () => {
    if (!email) {
      setError("Please enter an email address.");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear any previous errors

      const response = await checkEmailMutation({ email });
      console.log("API Response:", response); // For debugging
      
      if (response === true) {
        await sendOtpMutation({ email });
        router.push({
          pathname: "/forgotPassword/VerificationCode",
        });
      } else if (response === false) {
        setError("Email not found. Please check and try again.");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error in forgot password flow:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Forgot password?" />
      <Steps activeStep={1} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={styles.cardContainer}
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
                    style={styles.inputGradient}
                  >
                    <View style={styles.inputContainer}>
                      <TextInput
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder={"Enter your email"}
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("Email")}
                        onBlur={() => setFocusedInput(null)}
                        style={styles.input}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setError("");
                        }}
                      />
                    </View>
                  </LinearGradient>
                  {error !== "" && (
                    <Animated.View 
                      entering={FadeIn}
                      exiting={FadeOut}
                      style={styles.errorContainer}
                    >
                      <Text style={styles.errorText}>{error}</Text>
                    </Animated.View>
                  )}
                </View>
              </LinearGradient>
            </View>

            <View style={[styles.buttonContainer, styles.bottomPosition]}>
              <Button
                variant={email && !loading ? "primary" : "disabled"}
                textStyle={email && !loading ? "primary" : "disabled"}
                size="default"
                onPress={handleNavigation}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={Color.base.White} /> : "Send code"}
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
  cardContainer: {
    width: "100%",
    borderRadius: 32,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    paddingBottom: 16,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  textContainer: {
    gap: 24,
  },
  inputGradient: {
    marginTop: 10,
    borderRadius: 16,
    padding: 1,
  },
  inputContainer: {
    alignItems: "center",
    gap: 12,
    alignContent: "center",
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
  },
  input: {
    height: 40,
    ...BODY_1_REGULAR,
    color: Color.base.White,
    width: "100%",
  },
  errorContainer: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Color.System.systemError,
    ...CAPTION_1_REGULAR,
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