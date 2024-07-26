import { useRouter } from "expo-router";
import { ArrowDown2 } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Steps from "../components/atom/Steps";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import { useSignUpStore } from "../lib/store/signUpStore";
import { height } from "../lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import data from 'prefix.json'
import { sendRegisterOtp, checkTelNumber } from "../lib/service/mutationHelper";
import { useMutation } from "@tanstack/react-query";

const PhoneNumber = () => {
  const { prefix, setPrefix, phoneNumber, setPhoneNumber, reset } = useSignUpStore();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const { onRegister } = useAuth();

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
  };

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

  const handleNavigation = () => {
    if (phoneNumber && !isButtonDisabled) {
      setLoading(true);
      setIsButtonDisabled(true);
      checkTelNumberMutation({
        prefix: prefix,
        telNumber: phoneNumber,
      })
        .then((response) => {
          if (response && response.data.success === false) {
            setError("This phone number is already registered.");
            throw new Error("Phone number already registered");
          } else {
            return sendOtp({
              prefix: prefix,
              telNumber: phoneNumber,
            });
          }
        })
        .then((otpResponse) => {
          if (otpResponse) {
            router.push({
              pathname: "/signUp/Otp",
              params: {
                prefix: prefix,
                phoneNumber: phoneNumber,
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setError("This phone number is already registered.");
          reset()
        })
        .finally(() => {
          setLoading(false);
          setIsButtonDisabled(false);
        });
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    if (isOpen) {
      togglePrefix();
    }
  };

  const { mutateAsync: checkTelNumberMutation } = useMutation({
    mutationFn: checkTelNumber,
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutateAsync: sendOtp } = useMutation({
    mutationFn: sendRegisterOtp,
    onError: (error) => {
      console.log(error);
      setLoading(false);
      setIsButtonDisabled(false);
      setError("Error sending OTP. Please try again.");
    },
    onSuccess: (data, variables) => {
      // Navigate to OTP screen on successful OTP send
    },
  });

  const handleOtp = (prefix: string, phoneNumber: string) => {
    sendOtp({
      prefix: prefix,
      telNumber: phoneNumber,
    })
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Color.Gray.gray600} />
      <SafeAreaView style={{ flex: 0, backgroundColor: Color.Gray.gray600 }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
              <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
                <Steps activeStep={1}/>
                <View style={styles.body}>
                  <LinearGradient
                    colors={[Color.Brand.card.start, Color.Brand.card.end]}
                    style={styles.gradientContainer}
                  >
                    <View style={styles.textContainer}>
                      <View style={{ gap: 8 }}>
                        <Text style={styles.topText}>Phone Number</Text>
                        <Text style={styles.bottomText}>
                          This will be kept private. No surprise DMs.
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
                        style={styles.inputGradient}
                      >
                        <View style={styles.inputContainer}>
                          <AnimatedPressable
                            entering={FadeIn}
                            exiting={FadeOut}
                            onPress={togglePrefix}
                          >
                            <View style={styles.prefixContainer}>
                              <Text style={{ color: Color.Gray.gray50 }}>
                                +{prefix}
                              </Text>
                              <ArrowDown2 color={Color.Gray.gray50} />
                            </View>
                          </AnimatedPressable>
                          <TextInput
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            keyboardType="phone-pad"
                            placeholder="XXXXXXXX"
                            placeholderTextColor={Color.Gray.gray100}
                            value={phoneNumber}
                            style={styles.input}
                            onChangeText={setPhoneNumber}
                          />
                        </View>
                      </LinearGradient>
                      {error && (
                        <Animated.View entering={FadeIn} style={styles.errorContainer}>
                          <Text style={{ color: Color.System.systemError }}>
                            {error}
                          </Text>
                        </Animated.View>
                      )}
                    </View>
                  </LinearGradient>
                </View>
                <View
                  style={[
                    styles.buttonContainer,
                    buttonPosition === "bottom"
                      ? styles.bottomPosition
                      : styles.topPosition,
                  ]}
                >
                  <Button
                    variant={!phoneNumber ? "disabled" : "primary"}
                    textStyle={!phoneNumber ? "disabled" : "primary"}
                    size="default"
                    onPress={handleNavigation}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text>Confirm</Text>
                    )}
                  </Button>
                </View>

                {isOpen && (
                  <Animated.View
                    style={[
                      translateY,
                      styles.prefixListContainer
                    ]}
                  >
                    <ScrollView>
                      {data.map((prefix, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handlePrefixSelection(prefix.prefix)}
                        >
                          <View style={styles.prefixItem}>
                            <Text style={styles.prefixName}>
                              {prefix.name}
                            </Text>
                            <Text style={styles.prefixNumber}>
                              +{prefix.prefix}
                            </Text>
                          </View>
                          <View style={styles.prefixSeparator} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </Animated.View>
                )}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  gradientContainer: {
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
    flexDirection: "column",
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
  prefixContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1000,
  },
  bottomPosition: {
    bottom: 0,
    justifyContent: "flex-end",
  },
  topPosition: {
    bottom: 80,
    justifyContent: "flex-start",
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
    textAlign: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: "normal",
    color: Color.base.White,
    width: "100%",
    height: 48,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  prefixListContainer: {
    position: "absolute",
    zIndex: 100,
    top: -196,
    width: "80%",
    backgroundColor: Color.Gray.gray400,
    borderRadius: 16,
    overflow: "hidden",
    left: 16,
    ...Platform.select({
      ios: {
        shadowColor: Color.Gray.gray500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  prefixItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: Color.Gray.gray400,
  },
  prefixName: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: Color.base.White,
  },
  prefixNumber: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: Color.Gray.gray50,
  },
  prefixSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: Color.Gray.gray300,
  },
});