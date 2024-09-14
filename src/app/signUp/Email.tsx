import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Button from "@/components/ui/Button";
import Color from "@/constants/Color";
import Steps from "@/components/atom/Steps";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { sendOtp } from "@/lib/service/mutationHelper";
import { router } from "expo-router";
import { useSignUpStore } from "@/lib/store/signUpStore";
import { checkEmail } from "@/lib/service/mutationHelper";
import { emailSchema } from "@/validators/SignUpSchema";
import { ZodError } from "zod";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H5 } from "@/constants/typography";

function Email() {
  const { email, setEmail, reset } = useSignUpStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // const handleNavigation = async () => {
  //   try {
  //     if (email && !isButtonDisabled) {
  //       setLoading(true);
  //       setIsButtonDisabled(true);
  //       emailSchema.parse(email);
  //       await checkEmailMutation({
  //         email: email,
  //       })
  //         .then((response) => {
  //           if (response.success === false) {
  //             setError("This email is already registered.");
  //             throw new Error("Email already registered");
  //           } else {
  //             return sendOtpMutation({
  //               email: email,
  //             });
  //           }
  //         })
  //         .then((otpResponse) => {
  //           if (otpResponse) {
              // router.push({
              //   pathname: "/signUp/Otp",
              // });
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           setError("This email is already registered.");
  //           reset();
  //         })
  //         .finally(() => {
  //           setLoading(false);
  //           setIsButtonDisabled(false);
  //         });
  //     }
  //   } catch (error) {
  //     if (error instanceof ZodError) {
  //       const formattedErrors = error.issues.map((issue) => {
  //         return `${issue.message}`;
  //       });
  //       setError(formattedErrors.join("\n"));
  //       setLoading(false);
  //       setIsButtonDisabled(false);
  //       setTimeout(() => {
  //         setError("");
  //       }, 4000);
  //     }
  //   }
  // };

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
      
      if (response === false) {
        await sendOtpMutation({ email });
        router.push({
          pathname: "/signUp/Otp",
        });
      } else if (response === true) {
        setError("Email is already signed up");
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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { mutateAsync: checkEmailMutation } = useMutation({
    mutationFn: checkEmail,
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtp,
    onError: (error) => {
      console.log(error);
      setLoading(false);
      setIsButtonDisabled(true);
      setError("Error sending OTP. Please try again.");
    },
  });
  return (
    <>
      <Header title="Sign up" />
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
                      isFocused
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
                        style={{
                          height: 40,
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                        }}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setError("");
                        }}
                      />
                    </View>
                  </LinearGradient>
                  {error && (
                    <Animated.View
                      entering={FadeIn}
                      exiting={FadeOut}
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: Color.System.systemError,
                          ...CAPTION_1_REGULAR,
                        }}
                      >
                        {error}
                      </Text>
                    </Animated.View>
                  )}
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
    color: Color.base.White,
    ...H5,
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    ...CAPTION_1_REGULAR,
    textAlign: "center",
  },
});

export default Email;
