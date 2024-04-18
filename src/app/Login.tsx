import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { ActivityIndicator, Image, Pressable } from "react-native";

import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Divider from "./components/atom/Divider";
import Button from "./components/ui/Button";
import { useAuth } from "./context/AuthContext";
import { baseUrl } from "./lib/axios";
import Color from "./constants/Color";
import PrefixCard from "./components/atom/cards/PrefixCard";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { height } from "./lib/utils";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { ArrowDown2 } from "iconsax-react-native";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("Phone number");
  const [passwordPlaceholder, setPasswordPlaceholder] =
    useState<string>("Password");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { onLogin } = useAuth();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await onLogin(prefix, phoneNumber, password);
      if (response.success) {
        router.push("/(tabs)");
      } else {
        console.log("Login failed:", response.data);
        setError(
          "Invalid credentials. Please check your phone number and password and try again."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const data = [
    {
      name: "UAE",
      prefix: "971"
    },
    {
      name: "Mongolia",
      prefix: "976"
    },
    {
      name: "United States",
      prefix: "1"
    },
    {
      name: "United Kingdom",
      prefix: "44"
    },
    {
      name: "Canada",
      prefix: "1"
    },
    {
      name: "Australia",
      prefix: "61"
    },
    {
      name: "Germany",
      prefix: "49"
    },
    {
      name: "France",
      prefix: "33"
    },
    {
      name: "Japan",
      prefix: "81"
    },
  ];

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();

  };

  const onFocusPhone = () => {
    setPhonePlaceholder("");
  };

  const onBlurPhone = () => {
    setPhonePlaceholder("Phone number");
  };

  const onFocusPassword = () => {
    setPasswordPlaceholder("");
  };

  const onBlurPassword = () => {
    setPasswordPlaceholder("Password");
  };
  const offset = useSharedValue(300)
  const togglePrefix = () => {
    setIsOpen(!isOpen);
    offset.value = withSpring(isOpen ? height / 3 : height / 3 + 10, {
      damping: 20,
      mass: 0.5
    });
  };
  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }]
  }))

  const handlePrefixSelection = (selectedPrefix) => {
    setPrefix(selectedPrefix)
    togglePrefix()
    console.log(selectedPrefix)
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <GestureHandlerRootView style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 24,
            backgroundColor: Color.Gray.gray600,
            position: "relative",
          }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 32,
              width: "100%",
              backgroundColor: Color.Gray.gray500,
              borderColor: Color.Gray.gray400,
              marginTop: 96,
              borderWidth: 1,
              ...Platform.select({
                ios: {
                  shadowColor: Color.Gray.gray500,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 12
                },
                android: {
                  elevation: 12,
                },
              }),
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
              <Image source={require('@/public/images/LogoWhite.png')} style={{ width: 96, height: 96 }} />
            </View>

            <Text
              style={{
                fontSize: 24,
                color: Color.base.White,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 24
              }}
            >
              Welcome
            </Text>

            <View style={{ gap: 12 }}>
              <View style={{
                flexDirection: 'row',
                borderColor: Color.Gray.gray300,
                borderWidth: 1,
                borderRadius: 16,
                alignItems: 'center',
                paddingHorizontal: 16
              }}>
                {/* <TextInput
                  value={prefix}
                  placeholder='+976'
                  defaultValue='+'
                  placeholderTextColor={Color.Gray.gray200}
                  keyboardType='phone-pad'
                  onChangeText={setPrefix}
                  style={{
                    height: 40,
                    paddingHorizontal: 10,
                  }} /> */}

                <AnimatedPressable
                  entering={FadeIn}
                  exiting={FadeOut}
                  onPress={togglePrefix}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16, lineHeight: 20, color: Color.Gray.gray50 }}>
                      +{!prefix ? data[0].prefix : prefix}
                    </Text>
                    <ArrowDown2 color={Color.Gray.gray50} />
                  </View>
                </AnimatedPressable>


                <TextInput
                  inputMode="tel"
                  placeholder={phonePlaceholder}
                  placeholderTextColor={Color.Gray.gray100}
                  onFocus={onFocusPhone}
                  onBlur={onBlurPhone}
                  style={{
                    height: 40,
                    fontSize: 16,
                    fontWeight: '400',
                    lineHeight: 20,
                    paddingLeft: 10,
                    color: Color.base.White
                  }}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 40,
                  borderColor: Color.Gray.gray300,
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              >
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder={passwordPlaceholder}
                  placeholderTextColor={Color.Gray.gray100}
                  onFocus={onFocusPassword}
                  onBlur={onBlurPassword}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '400',
                    lineHeight: 20,
                    color: Color.base.White
                  }}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color={Color.Gray.gray50}
                  />
                </TouchableOpacity>
              </View>
              {error && (
                <Text
                  style={{ color: "red", marginTop: 10, textAlign: "center" }}
                >
                  {error}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 24, gap: 12 }}>
              <Button variant="primary" onPress={handleLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    Log in
                  </Text>
                )}
              </Button>
              <Button
                style={{ zIndex: 0 }}
                variant="text"
                onPress={() => router.push("/forgotpassword/ForgotPassword")}
              >
                <Text
                  style={{ color: Color.base.White, fontSize: 14, fontWeight: "bold", marginTop: 12 }}
                >
                  Forgot password?
                </Text>
              </Button>
              <Divider />
              <Button
                variant="tertiary"
                onPress={() => router.push("/signUp/PhoneNumber")}
              >
                <Text
                  style={{ color: Color.base.White, fontSize: 16, fontWeight: "bold" }}
                >
                  Sign up
                </Text>
              </Button>
            </View>
            {isOpen && (
              <Animated.View style={[translateY, { position: 'absolute', zIndex: 100, top: -196, width: '80%', backgroundColor: Color.Gray.gray400, borderRadius: 16, overflow: 'hidden', left: 0 }]}>
                <ScrollView style={{}}>
                  {data.map((prefix, index) => (
                    <TouchableOpacity key={index} onPress={() => handlePrefixSelection(prefix.prefix)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, backgroundColor: Color.Gray.gray400, }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '400',
                          lineHeight: 20,
                          color: Color.base.White
                        }}>{prefix.name}</Text>
                        <Text style={{
                            fontSize:16,
                            fontWeight:'400',
                            lineHeight:20,
                            color: Color.Gray.gray50
                        }}>+{prefix.prefix}</Text>
                      </View>
                      <View style={{ height: 1, width: '100%', backgroundColor: Color.Gray.gray300 }} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </View>
        </View>
        <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 48, gap: 0, flexDirection: 'column' }}>
          <Text style={{ textAlign: 'center', fontSize: 14, color: Color.Gray.gray100, fontWeight: '400', marginBottom: 0 }}>
            By continuing, I agree with Amuse-Bouche's {"\n"}
          </Text>
          <TouchableOpacity onPress={() => router.navigate('/TermsAndCondo')}>
            <Text style={{ color: Color.base.White, fontSize: 14, fontWeight: '500' }}>
              Terms and Conditions.
            </Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
}

export default Login;
