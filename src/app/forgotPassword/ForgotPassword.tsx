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
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { router, useNavigation } from "expo-router";
import Steps from "@/app/components/atom/Steps";
import { ArrowDown2 } from "iconsax-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { height, width } from "../lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "../lib/store/passwordStore";
import data from 'prefix.json'
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../lib/service/mutationHelper";
import Header from "../components/layout/Header";

function ForgotPassword() {
  const { phoneNumber, setPhoneNumber, prefix, setPrefix } = usePasswordStore();
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false)
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("Phone number");
  const [focusedInput, setFocusedInput] = useState<
    "Phone number" | "Password" | null
  >(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const offset = useSharedValue(300);

  const togglePrefix = () => {
    setIsOpen(!isOpen);
    offset.value = withSpring(isOpen ? height / 3 : height / 3 + 10, {
      damping: 20,
      mass: 0.5,
    });
  };

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));


  const {
    mutateAsync: sendPasswordOtp,
  } = useMutation({
    mutationFn: updatePassword,
    onError: (error) => {
    },
    onSuccess: (data, variables) => {
      try {
      } catch (error) {
        console.error("Send OTP failed:", error);
      }
    },
  });

  const handlePrefixSelection = (selectedPrefix) => {
  
    setPrefix(selectedPrefix);
    togglePrefix();
    console.log(selectedPrefix);
  };

  const handleNavigation = async () => {
    try {

      if (phoneNumber && prefix) {
        setLoading(true)
        await sendPasswordOtp({
          prefix: prefix,
          telNumber: phoneNumber,
        })
        setLoading(false)

        router.push({
          pathname: "/forgotPassword/VerificationCode",
        });
      }
    } catch (error) {
      console.log("Error sending OTP")
    }

  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    if (isOpen) {
      togglePrefix()
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
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
      <Header title='Forgot password?' />
      <Steps activeStep={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
                    <Text style={styles.topText}>Phone Number</Text>
                    <Text style={styles.bottomText}>
                      We will send an SMS verification code.
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

                      <AnimatedPressable
                        entering={FadeIn}
                        exiting={FadeOut}
                        onPress={togglePrefix}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              lineHeight: 20,
                              color: Color.Gray.gray50,
                            }}
                          >
                            +{prefix}
                          </Text>
                          <ArrowDown2 color={Color.Gray.gray50} />
                        </View>
                      </AnimatedPressable>

                      <TextInput
                        inputMode="tel"
                        placeholder={phonePlaceholder}
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput('Phone number')}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          height: 40,
                          fontSize: 16,
                          fontWeight: "400",
                          lineHeight: 20,
                          color: Color.base.White,
                          width: '100%'
                        }}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
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
                  variant={phoneNumber ? "primary" : 'disabled'}
                  textStyle={phoneNumber ? "primary" : 'disabled'}
                  size="default"
                  onPress={handleNavigation}
                >
                  {loading ? <ActivityIndicator/> : "Send code"}
                </Button>
              </View>
            </KeyboardAvoidingView>
            {isOpen && (
              <Animated.View
                style={[
                  translateY,
                  {
                    position: "absolute",
                    zIndex: 100,
                    bottom: height / 2.3,
                    width: "65%",
                    backgroundColor: Color.Gray.gray400,
                    borderRadius: 16,
                    overflow: "hidden",
                    left: width / 11,
                  },
                ]}
              >
                <ScrollView>
                  {data.map((prefix, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePrefixSelection(prefix.prefix)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingHorizontal: 16,
                          paddingVertical: 15,
                          backgroundColor: Color.Gray.gray400,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "400",
                            lineHeight: 20,
                            color: Color.base.White,
                          }}
                        >
                          {prefix.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "400",
                            lineHeight: 20,
                            color: Color.Gray.gray50,
                          }}
                        >
                          +{prefix.prefix}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: Color.Gray.gray300,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            )}
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

export default ForgotPassword;
