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
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "@/lib/store/passwordStore";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendOtp } from "@/lib/service/mutationHelper";
import { router } from "expo-router";

function ForgotPassword() {
  const { email, setEmail } = usePasswordStore();
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [loading, setLoading] = useState(false);

  const [focusedInput, setFocusedInput] = useState<
    "Phone number" | "Password" | null
  >(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const offset = useSharedValue(300);

  const togglePrefix = () => {
    setIsOpen(!isOpen);
    offset.value = withSpring(isOpen ? 220 : 230, {
      damping: 20,
      mass: 0.5,
    });
  };

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtp,
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
    if (isOpen) {
      togglePrefix();
    }
  };

  const inputContainerRef = React.useRef(null);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <Header title="Forgot password?" />
      <Steps activeStep={1} />
      <KeyboardAvoidingView style={{ flex: 1 }}>
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
                      focusedInput === "Phone number"
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
                        autoCapitalize="none"
                        placeholder={"Enter your email"}
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("Phone number")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          height: 40,
                          fontSize: 16,
                          fontWeight: "400",
                          lineHeight: 20,
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
                  variant={email ? "primary" : "disabled"}
                  textStyle={email ? "primary" : "disabled"}
                  size="default"
                  onPress={handleNavigation}
                >
                  {loading ? <ActivityIndicator /> : "Send code"}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

export default ForgotPassword;
