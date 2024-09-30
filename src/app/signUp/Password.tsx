import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { z } from 'zod';
import Steps from "@/components/atom/Steps";
import Tick from "@/components/icons/Tick";
import Button from "@/components/ui/Button";
import Color from "@/constants/Color";
import { useSignUpStore } from "@/lib/store/signUpStore";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/layout/Header";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H5 } from "@/constants/typography";

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

const Password = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const { password, setPassword } = useSignUpStore();
  const [focusedInput, setFocusedInput] = useState<
    "password" | "confirmPassword" | null
  >(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const validatePassword = useCallback((pass: string) => {
    const result = passwordSchema.safeParse(pass);
    if (!result.success) {
      setValidationErrors(result.error.issues.map(issue => issue.message));
      setIsPasswordValid(false);
    } else {
      setValidationErrors([]);
      setIsPasswordValid(true);
    }
  }, []);

  useEffect(() => {
    validatePassword(password);
  }, [password, validatePassword]);

  const doPasswordsMatch = password === confirmPassword;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
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
                        onChangeText={handlePasswordChange}
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
                  {validationErrors.map((error, index) => (
                    <View key={index} style={{ flexDirection: "row" }}>
                      <Tick size={18} color={Color.Gray.gray100} />
                      <Text style={styles.ruleText}>{error}</Text>
                    </View>
                  ))}
                  {isPasswordValid && (
                    <Text style={[styles.ruleText, styles.greenRuleText]}>
                      Password meets all requirements
                    </Text>
                  )}
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