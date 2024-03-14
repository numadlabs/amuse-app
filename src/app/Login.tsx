import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";

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

function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("Phone number");
  const [passwordPlaceholder, setPasswordPlaceholder] =
    useState<string>("Password");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { onLogin } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await onLogin("976", phoneNumber, password);
      if (response.success) {
        console.log("Login successful:", response.data);
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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            padding: 20,
            borderRadius: 20,
            width: "100%",
            backgroundColor: "white",
            ...Platform.select({
              ios: {
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
            }),
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: "gray",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Welcome {baseUrl}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "gray",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Enter your phone number and password
          </Text>
          <View style={{ marginTop: 20 }}>
            <TextInput
              inputMode="tel"
              placeholder={phonePlaceholder}
              placeholderTextColor="gray"
              onFocus={onFocusPhone}
              onBlur={onBlurPhone}
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 16,
                paddingHorizontal: 10,
              }}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 16,
                paddingHorizontal: 10,
                marginTop: 10,
              }}
            >
              <TextInput
                secureTextEntry={!showPassword}
                placeholder={passwordPlaceholder}
                placeholderTextColor="gray"
                onFocus={onFocusPassword}
                onBlur={onBlurPassword}
                style={{ flex: 1 }}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="black"
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
          <View style={{ marginTop: 20 }}>
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
              variant="text"
              onPress={() => router.push("/forgotpassword/ForgotPassword")}
            >
              <Text
                style={{ color: "black", fontSize: 14, fontWeight: "bold" }}
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
                style={{ color: "black", fontSize: 16, fontWeight: "bold" }}
              >
                Sign up
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Login;
