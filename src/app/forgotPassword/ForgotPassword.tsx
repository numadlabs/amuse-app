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
} from "react-native";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { router, useNavigation } from "expo-router";
import FpLayout from "./_layout";
import Steps from "@/app/components/atom/Steps";
import { ArrowDown2 } from "iconsax-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { height } from "../lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "../lib/store/passwordStore";

const data = [
  {
    name: "UAE",
    prefix: "971",
  },
  {
    name: "Mongolia",
    prefix: "976",
  },
  {
    name: "United States",
    prefix: "1",
  },
  {
    name: "United Kingdom",
    prefix: "44",
  },
  {
    name: "Canada",
    prefix: "1",
  },
  {
    name: "Australia",
    prefix: "61",
  },
  {
    name: "Germany",
    prefix: "49",
  },
  {
    name: "France",
    prefix: "33",
  },
  {
    name: "Japan",
    prefix: "81",
  },
];

function ForgotPassword() {
  const { phoneNumber, setPhoneNumber } = usePasswordStore();
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("Phone number");
  const [prefix, setPrefix] = useState<string>(data[0].prefix);
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

  const handlePrefixSelection = (selectedPrefix) => {
    setPrefix(selectedPrefix);
    togglePrefix();
    console.log(selectedPrefix);
  };

  const handleNavigation = () => {
    if (phoneNumber) {
      router.push({
        pathname: "/forgotPassword/VerificationCode",
        params: {
          prefix: prefix,
          phoneNumber: phoneNumber,
        },
      });
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
      <Steps activeStep={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                      onFocus={() => setFocusedInput("Phone number")}
                      onBlur={() => setFocusedInput(null)}
                      style={{
                        height: 40,
                        fontSize: 16,
                        fontWeight: "400",
                        lineHeight: 20,
                        paddingLeft: 6,
                        color: Color.base.White,
                        width: '100%',
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
                  Send code
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
                    top: -196,
                    width: "80%",
                    backgroundColor: Color.Gray.gray400,
                    borderRadius: 16,
                    overflow: "hidden",
                    left: 0,
                  },
                ]}
              >
                <ScrollView style={{}}>
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
