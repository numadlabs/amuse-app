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
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "../lib/store/passwordStore";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const { prefix, phoneNumber } = useLocalSearchParams(); 
  console.log(prefix, phoneNumber)
  const { password, setPassword } = usePasswordStore();
  const [focusedInput, setFocusedInput] = useState<'password' | 'confirmPassword' | null>(null);
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
    if (isPasswordValid && doPasswordsMatch) {
      console.log(phoneNumber, prefix, password);
      router.push({
        pathname: "/signUp/NickName",
        params: {
          phoneNumber: phoneNumber,
          prefix: prefix,
          password: password,
        },
      });
    } else {
      console.log("Password does not meet the validation rules or passwords do not match.");
    }
  };

  return (
    <>
      <Steps activeStep={3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={{
                borderWidth: 1,
                borderColor: Color.Gray.gray400,
                marginTop: 16,
                borderRadius: 32,
              }}
            >
              <View style={styles.container}>
                <View style={styles.textContainer}>
                  <Text style={styles.topText}>Create password</Text>
                </View>
                <View style={styles.inputContainer}>
                <LinearGradient
                    colors={
                      focusedInput === 'password'
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
                      placeholder={passwordPlaceholder}
                      placeholderTextColor={Color.Gray.gray100}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: "400",
                        lineHeight: 20,
                        color: Color.base.White,
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
                  </LinearGradient>
                  <LinearGradient
                    colors={
                      focusedInput === 'confirmPassword'
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
                      placeholder={passwordPlaceholder}
                      placeholderTextColor={Color.Gray.gray100}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: "400",
                        lineHeight: 20,
                        color: Color.base.White,
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
                  </LinearGradient>
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
            </LinearGradient>
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
                  variant={isPasswordValid && doPasswordsMatch ? "primary" : 'disabled'}
                  textStyle={isPasswordValid && doPasswordsMatch ? "primary" : 'disabled'}
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
