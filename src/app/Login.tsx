import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { ZodError } from "zod";
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Divider from "@/components/atom/Divider";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import Color from "@/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import LoginSchema from "@/validators/LoginSchema";
import { BODY_1_REGULAR, BODY_2_REGULAR, BUTTON_48, H5 } from "@/constants/typography";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { height } from "@/lib/utils";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<"Email" | "Password" | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const bottomTabHeight = useSharedValue(0);
  const { onLogin } = useAuth();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: bottomTabHeight.value,
    };
  });

  useEffect(() => {
    checkWelcomeMessageStatus();
  }, []);

  const checkWelcomeMessageStatus = async () => {
    try {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcomeMessage');
      if (hasSeenWelcome !== 'true') {
        setShowWelcomeMessage(true);
        bottomTabHeight.value = withTiming(height / 1.1, {
          duration: 800,
          easing: Easing.out(Easing.exp),
        });
      }
    } catch (error) {
      console.error('Error checking welcome message status:', error);
    }
  };

  const dismissWelcomeMessage = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcomeMessage', 'true');
      bottomTabHeight.value = withTiming(0, {
        duration: 500,
        easing: Easing.in(Easing.exp),
      });
      setTimeout(() => setShowWelcomeMessage(false), 500);
    } catch (error) {
      console.error('Error saving welcome message status:', error);
    }
  };

  const toggleBalanceBottomSheet = dismissWelcomeMessage;

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await onLogin(email, password);
      if (result.success) {
        router.replace("/(tabs)");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 24,
            }}
          >
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={{
                width: "100%",
                marginTop: 48,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: Color.Gray.gray400,
              }}
            >
              <View
                style={{
                  padding: 20,
                  width: "100%",
                  ...Platform.select({
                    ios: {
                      shadowColor: Color.Gray.gray500,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 12,
                    },
                    android: {
                      elevation: 12,
                    },
                  }),
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <Image
                    source={require("@/public/images/LogoDark.png")}
                    style={{ width: 96, height: 96 }}
                  />
                </View>

                <Text
                  style={{
                    ...H5,
                    color: Color.base.White,
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  Welcomee
                </Text>

                <View style={{ gap: 12 }}>
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
                        placeholder={"Email"}
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("Email")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          height: 40,
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                        }}
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text)
                          setError("")
                        }}
                      />
                    </View>
                  </LinearGradient>
                  {error && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1, }}>
                      <Text
                        style={{
                          color: Color.System.systemError,
                          paddingHorizontal: 16,
                        }}
                      >
                        {error}
                      </Text>
                    </Animated.View>
                  )}
                  <LinearGradient
                    colors={
                      focusedInput === "Password"
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
                        secureTextEntry={!showPassword}
                        placeholder={"Password"}
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("Password")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          flex: 1,
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                        }}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={toggleShowPassword}>
                        <Ionicons
                          name={
                            showPassword ? "eye-outline" : "eye-off-outline"
                          }
                          size={24}
                          color={Color.Gray.gray50}
                        />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <Button
                    variant="primary"
                    style={{ marginTop: 12 }}
                    onPress={handleLogin}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          ...BUTTON_48,
                        }}
                      >
                        Log in
                      </Text>
                    )}
                  </Button>
                  <Button
                    style={{ zIndex: 0 }}
                    variant="text"
                    onPress={() => router.push("/forgotPassword/Email")}
                  >
                    <Text
                      style={{
                        color: Color.base.White,
                        ...BUTTON_48,
                        marginTop: 12,
                      }}
                    >
                      Forgot password?
                    </Text>
                  </Button>
                  <Divider />
                  <Button
                    variant="tertiary"
                    onPress={() => router.push("/signUp/Email")}
                  >
                    <Text
                      style={{
                        color: Color.base.White,
                        ...BUTTON_48,
                      }}
                    >
                      Sign up
                    </Text>
                  </Button>
                </View>
              </View>
            </LinearGradient>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              marginTop: 24,
              gap: 0,
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                ...BODY_2_REGULAR,
                color: Color.Gray.gray100,
                marginBottom: 0,
              }}
            >
              By continuing, I agree with Amuse-Bouche's
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/TermsAndCondo")}>
              <Text
                style={{
                  color: Color.base.White,
                  ...BODY_2_REGULAR,
                }}
              >
                Terms and Conditions.
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showWelcomeMessage && (
          <Modal transparent={true}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={toggleBalanceBottomSheet}
              />

              <Animated.View
                style={[
                  {
                    backgroundColor: Color.Gray.gray600,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 20,
                    zIndex: 1000,
                    marginTop: 25,
                    flexGrow: 1
                  },
                  animatedStyles,
                ]}
              >
                <View style={{ flex: 1, justifyContent: 'space-between', }}>
                  <ScrollView style={{ marginBottom: 20 }}>
                    <Text style={{ color: Color.base.White, ...BODY_2_REGULAR, fontSize: 24, lineHeight: 32, fontWeight: 'bold', textAlign: 'left' }}>
                      Welcome to {"\n"}Amuse Bouche!
                    </Text>

                    <Text style={styles.paragraph}>
                      We’re thrilled to have you join our Pilot Program, and we greatly
                      appreciate your participation. This program allows us to refine Amuse
                      Bouche’s features, ensuring it becomes the best experience possible
                      for our entire community, including you!
                    </Text>

                    <Text style={styles.paragraph}>
                      Here at Amuse Bouche, we value transparency with our users. So,
                      please note that while using the Amuse Bouche Application, certain
                      user data will be collected. To enable account creation and continued
                      user access, it is necessary that user email data is collected.
                      Additionally, user experience is unique to each location, which
                      requires user location data to also be collected.
                    </Text>

                    <Text style={styles.paragraph}>
                      Aside from user email and location data collection, the rest is up to
                      you! You can opt to allow the collection of data such as your birthday
                      and profile picture. Opting-in allows us here at Amuse Bouche to
                      continue to improve the Application so we can provide a more
                      seamless and tailored user experience for you.
                    </Text>

                    <Text style={styles.paragraph}>
                      Your privacy is important, and what data you choose to disclose is
                      totally up to you! To change your data collection preferences, you can
                      go to the privacy section of the settings menu and view the data
                      collection options.
                    </Text>

                    <Text style={styles.paragraph}>
                      Disclaimer: The Amuse Bouche Application is solely a platform for
                      third-parties to engage with users. Any offerings of rewards or
                      securities accessible through the Application are provided by third-
                      parties. Hash2 Labs LLC, the developer of the Application, is not liable
                      for any offers, rewards or any associated claims, damages or losses.
                    </Text>

                    <Text style={styles.paragraph}>
                      One final note, to ensure security and smooth operations during the
                      Pilot Program, some features will be limited. Specifically, you won’t be
                      able to withdraw or transfer any bitcoin earned until the Pilot Program
                      ends. We’ll notify all users via email and app notification as soon as
                      the Pilot Program is completed.
                    </Text>

                    <Text style={[styles.paragraph, { marginTop: 44 }]}>
                      We are excited to have you as a part of our growing community!
                    </Text>
                    
                  </ScrollView>
                  <Button variant="primary" onPress={dismissWelcomeMessage}>
                    <Text style={{ color: Color.base.White, ...BUTTON_48 }}>I understand</Text>
                  </Button>
                </View>
              </Animated.View>
            </Animated.View>
          </Modal>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  paragraph: {
    lineHeight: 18,
    fontSize: 14,
    marginTop: 24,
    color: Color.Gray.gray100, // Assuming this is close to Color.Gray.gray100
    marginBottom: 5, // Adding some space between paragraphs
  },
})

export default Login;