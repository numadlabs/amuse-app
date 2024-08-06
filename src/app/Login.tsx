import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Image } from "react-native";

import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import Divider from "@/components/atom/Divider";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import Color from "@/constants/Color";
import { LinearGradient } from "expo-linear-gradient";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<"Email" | "Password" | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogin } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await onLogin(email, password);
      if (response.success) {
        router.replace("/(tabs)");
      } else {
        console.log("Login failed:", response.data);
        setError("Email and/or password do not match our records");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login Error. Please try again later.");
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
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
                    fontSize: 24,
                    color: Color.base.White,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  Welcome
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
                          fontSize: 16,
                          fontWeight: "400",
                          lineHeight: 20,
                          color: Color.base.White,
                          width: "100%",
                        }}
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </LinearGradient>
                  {error && email.length < 7 && (
                    <Text
                      style={{
                        color: Color.System.systemError,
                        paddingHorizontal: 16,
                      }}
                    >
                      {"Please enter valid email"}
                    </Text>
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
                          fontSize: 16,
                          fontWeight: "400",
                          lineHeight: 20,
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
                  {password.length < 8 && null && (
                    <Text
                      style={{
                        color: Color.System.systemError,
                        paddingHorizontal: 16,
                      }}
                    >
                      {"Please enter valid password"}
                    </Text>
                  )}

                  {error && (
                    <Text
                      style={{
                        color: Color.System.systemError,
                        paddingHorizontal: 16,
                      }}
                    >
                      {error}
                    </Text>
                  )}
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
                          fontSize: 16,
                          fontWeight: "bold",
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
                        fontSize: 14,
                        fontWeight: "bold",
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
                        fontSize: 16,
                        fontWeight: "bold",
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
                fontSize: 14,
                color: Color.Gray.gray100,
                fontWeight: "400",
                marginBottom: 0,
              }}
            >
              By continuing, I agree with Amuse-Bouche's
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/TermsAndCondo")}>
              <Text
                style={{
                  color: Color.base.White,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Terms and Conditions.
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Login;
