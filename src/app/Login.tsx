import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Button from "./components/ui/Button";
import Divider from "./components/atom/Divider";
import { Link, router } from "expo-router";
import { useAuth } from "./context/AuthContext";
import LoginSchema from "./validators/LoginSchema";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { onLogin } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await onLogin("976", phoneNumber, password);
      if (response.success) {
        // Successful login
        console.log("Login successful:", response.data);
        const accessToken = response.data.auth.accessToken;
        router.push('/Home');
      } else {
        // Login failed
        console.log("Login failed:", response.data);
        console.log(phoneNumber, password, response)
        alert("Invalid credentials. Please check your phone number and password and try again.");
      }
    } catch (error) {
      // Network error or other exception
      console.error("Error during login:", error);
      alert("Login Error. Please try again later.");
    }
  };
  



  const dismissKeyboard = () => {
    Keyboard.dismiss();
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
            borderWidth: 1,
            borderColor: "black",
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
            Welcome
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
              placeholder="Phone number"
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
            <TextInput
              secureTextEntry={true}
              placeholder="Password"
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 16,
                paddingHorizontal: 10,
                marginTop: 10,
              }}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button variant="primary" onPress={handleLogin}>
              Log in
            </Button>
            <Button variant="text" onPress={() => router.push('/forgotpassword/ForgotPassword')}>

              Forgot password?

            </Button>
            <Divider />
            <Button
              variant="tertiary"
              onPress={() => router.push("/signUp/PhoneNumber")}
            >
              Sign up
            </Button>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Login;
