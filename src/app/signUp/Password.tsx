import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import Steps from "@/components/atom/Steps";
import Tick from "@/components/icons/Tick";
import Button from "@/components/ui/Button";
import Color from "@/constants/Color";
import { useSignUpStore } from "@/lib/store/signUpStore";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/layout/Header";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H5 } from "@/constants/typography";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .max(128, "Maximum number of characters reached");

const Password = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const { password, setPassword } = useSignUpStore();
  const [focusedInput, setFocusedInput] = useState<
    "password" | "confirmPassword" | null
  >(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isPasswordValid = passwordSchema.safeParse(password).success;
  const doPasswordsMatch = password === confirmPassword;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isRuleSatisfied = (rule: RegExp): boolean => {
    return rule.test(password);
  };

  const handleNavigation = () => {
    if (isPasswordValid && doPasswordsMatch) {
      router.push({
        pathname: "/signUp/NickName",
      });
    } else {
      console.log(
        "Password does not meet the validation rules or passwords do not match.",
      );
    }
  };

  return (
    <>
      <Header title="Sign up" />
      <Steps activeStep={2} />
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
                  {/* Password input field */}
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
                          flex: 1,
                          ...BODY_1_REGULAR,
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
                  {/* Confirm Password input field */}
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
                        placeholder={"Confirm Password"}
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
                  {/* Password rules */}
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

            <View style={[styles.buttonContainer, styles.bottomPosition]}>
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
                Confirm
              </Button>
            </View>
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
    ...H5,
  },
  inputContainer: {
    gap: 12,
  },
  ruleContainer: {
    marginTop: 16,
    gap: 6,
  },
  ruleText: {
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray100,
  },
  greenRuleText: {
    color: Color.System.systemSuccess,
  },
  errorText: {
    color: Color.System.systemError,
    ...CAPTION_1_REGULAR,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 16,
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
