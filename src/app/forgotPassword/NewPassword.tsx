import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Steps from "@/components/atom/Steps";
import Tick from "@/components/icons/Tick";
import Button from "@/components/ui/Button";
import Color from "@/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import { usePasswordStore } from "@/lib/store/passwordStore";
import Header from "@/components/layout/Header";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/service/mutationHelper";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H5 } from "@/constants/typography";

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
  const { email, verificationCode, password, setPassword } = usePasswordStore();
  const [focusedInput, setFocusedInput] = useState<
    "password" | "confirmPassword" | null
  >(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isRuleSatisfied = (rule: RegExp): boolean => {
    return rule.test(password);
  };

  const { mutateAsync: forgotPasswordMutation } = useMutation({
    mutationFn: forgotPassword,
  });

  const handleNavigation = async () => {
    try {
      if (isPasswordValid && doPasswordsMatch) {
        setLoading(true);

        await forgotPasswordMutation({
          email: email,
          verificationCode: verificationCode,
          password: password,
        });

        router.replace({
          pathname: "/forgotPassword/Success",
        });
        setLoading(false);
      } else {
        console.log(
          "Password does not meet the validation rules or passwords do not match.",
        );
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <Header title="Forgot password?" />
      <Steps activeStep={3} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
                      focusedInput === "password"
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
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          ...BODY_1_REGULAR,
                          flex: 1,
                          color: Color.base.White,
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
                  <LinearGradient
                    colors={
                      focusedInput === "confirmPassword"
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
                        onFocus={() => setFocusedInput("confirmPassword")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          flex: 1,
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                        }}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
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

            <View style={[styles.bottomPosition, styles.buttonContainer]}>
              <Button
                variant={
                  isPasswordValid && doPasswordsMatch ? "primary" : "disabled"
                }
                textStyle={
                  isPasswordValid && doPasswordsMatch ? "primary" : "disabled"
                }
                size="default"
                onPress={handleNavigation}
              >
                {loading ? <ActivityIndicator /> : "Confirm"}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    ...H5,
    color: Color.base.White,
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
    ...CAPTION_1_REGULAR,
    fontSize: 14,
    color: Color.Gray.gray100,
  },

  greenRuleText: {
    color: Color.System.systemSuccess,
  },

  errorText: {
    ...CAPTION_1_REGULAR,
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
  },
  bottomPosition: {
    justifyContent: "flex-end",
  },
});

export default Password;
