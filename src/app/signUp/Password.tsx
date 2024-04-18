import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Steps from "../components/atom/Steps";
import Tick from "../components/icons/Tick";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useSignUpStore } from "../lib/store/signUpStore";

const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/\d/.test(password)) {
    return false;
  }
  return true;
};

const Password = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { prefix, phoneNumber } = useLocalSearchParams();
  const { password, setPassword } = useSignUpStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordPlaceholder, setPasswordPlaceholder] =
    useState<string>("Password");

  const isPasswordValid = validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isRuleSatisfied = (rule: RegExp): boolean => {
    return rule.test(password);
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

  const onFocusPassword = () => {
    setPasswordPlaceholder("");
  };
  const onBlurPassword = () => {
    setPasswordPlaceholder("Password");
  };
  const handleNavigation = () => {
    console.log(phoneNumber, prefix, password);
    router.push({
      pathname: "/signUp/NickName",
      params: {
        phoneNumber: phoneNumber,
        prefix: prefix,
        password: password,
      },
    });
  };

  return (
    <>
      <Steps activeStep={2} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.topText}>Create password</Text>
              </View>
              <View style={styles.inputContainer}>
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
                      fontWeight: "400",
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
                      fontWeight: "400",
                      lineHeight: 20,
                      color: Color.base.White
                    }}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={toggleShowPassword}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={24}
                      color={Color.Gray.gray50}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {!doPasswordsMatch && (
                <Text style={styles.errorText}>Password doesn't match</Text>
              )}
              <View style={styles.ruleContainer}>
                <View style={{ flexDirection: "row" }}>
                  <Tick size={18} color={Color.Gray.gray100} />
                  <Text
                    style={[
                      styles.ruleText,
                      isRuleSatisfied(/.{8,}/) && styles.greenRuleText,
                    ]}
                  >
                    {"At least 8 characters"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Tick size={18} color={Color.Gray.gray100} />
                  <Text
                    style={[
                      styles.ruleText,
                      isRuleSatisfied(/[A-Z]/) && styles.greenRuleText,
                    ]}
                  >
                    {"At least 1 upper case letter (A-Z)"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Tick size={18} color={Color.Gray.gray100} />
                  <Text
                    style={[
                      styles.ruleText,
                      isRuleSatisfied(/[a-z]/) && styles.greenRuleText,
                    ]}
                  >
                    {"At least 1 lower case letter (a-z)"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Tick size={18} color={Color.Gray.gray100} />
                  <Text
                    style={[
                      styles.ruleText,
                      isRuleSatisfied(/\d/) && styles.greenRuleText,
                    ]}
                  >
                    {"At least 1 number (0-9)"}
                  </Text>
                </View>
              </View>
            </View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={110}
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
                  variant="primary"
                  textStyle="primary"
                  size="default"
                  onPress={handleNavigation}
                >
                  Confirm
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    height: "100%",
    paddingHorizontal: 16,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Color.Gray.gray500,
    shadowColor: "#000",
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginTop: 16,
    elevation: 4,
    borderRadius: 32,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  topText: {
    color: Color.base.White,
    fontWeight: "bold",
    fontSize: 24,
  },
  bottomText: {
    color: Color.Gray.gray400,
    fontSize: 12,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Color.Gray.gray100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputFocused: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Color.Gray.gray600,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  ruleContainer: {
    marginTop: 16,
    gap: 6,
  },
  ruleText: {
    fontSize: 14,
    color: Color.Gray.gray100,
  },
  greenRuleText: {
    color: Color.System.systemSuccess,
  },
  errorText: {
    color: Color.System.systemError,
    marginTop: 8,
    paddingHorizontal: 16,
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
});

export default Password;
