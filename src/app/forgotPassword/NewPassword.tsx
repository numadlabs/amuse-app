import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { z } from "zod";
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

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Password = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const { email, verificationCode, password, setPassword } = usePasswordStore();
  const [focusedInput, setFocusedInput] = useState<
    "password" | "confirmPassword" | null
  >(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<z.ZodIssue[]>([]);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const isRuleSatisfied = (rule: RegExp): boolean => rule.test(password);

  const { mutateAsync: forgotPasswordMutation } = useMutation({
    mutationFn: forgotPassword,
  });

  const validatePasswords = () => {
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      setValidationErrors(result.error.issues);
      return false;
    }
    setValidationErrors([]);
    return true;
  };

  const handleNavigation = async () => {
    try {
      if (validatePasswords()) {
        setLoading(true);
        await forgotPasswordMutation({
          email,
          verificationCode,
          password,
        });
        router.replace({ pathname: "/forgotPassword/Success" });
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      // Here you could set an error state and display it to the user
    } finally {
      setLoading(false);
    }
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
              style={styles.gradientContainer}
            >
              <View style={styles.container}>
                <View style={styles.textContainer}>
                  <Text style={styles.topText}>Create password</Text>
                </View>
                <View style={styles.inputContainer}>
                  {/* Password Input */}
                  <LinearGradient
                    colors={
                      focusedInput === "password"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={styles.inputGradient}
                  >
                    <View style={styles.inputWrapper}>
                      <TextInput
                        secureTextEntry={!showPassword}
                        placeholder="Password"
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        style={styles.input}
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
                  {/* Confirm Password Input */}
                  <LinearGradient
                    colors={
                      focusedInput === "confirmPassword"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={styles.inputGradient}
                  >
                    <View style={styles.inputWrapper}>
                      <TextInput
                        secureTextEntry={!showPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor={Color.Gray.gray100}
                        onFocus={() => setFocusedInput("confirmPassword")}
                        onBlur={() => setFocusedInput(null)}
                        style={styles.input}
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
                {validationErrors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>
                    {error.message}
                  </Text>
                ))}
                <View style={styles.ruleContainer}>
                  {/* Password Rules */}
                  <PasswordRule
                    satisfied={isRuleSatisfied(/.{8,}/)}
                    text="At least 8 characters"
                  />
                  <PasswordRule
                    satisfied={isRuleSatisfied(/[A-Z]/)}
                    text="At least 1 upper case letter (A-Z)"
                  />
                  <PasswordRule
                    satisfied={isRuleSatisfied(/[a-z]/)}
                    text="At least 1 lower case letter (a-z)"
                  />
                  <PasswordRule
                    satisfied={isRuleSatisfied(/\d/)}
                    text="At least 1 number (0-9)"
                  />
                </View>
              </View>
            </LinearGradient>

            <View style={[styles.bottomPosition, styles.buttonContainer]}>
              <Button
                variant={validationErrors.length === 0 ? "primary" : "disabled"}
                textStyle={
                  validationErrors.length === 0 ? "primary" : "disabled"
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

const PasswordRule = ({
  satisfied,
  text,
}: {
  satisfied: boolean;
  text: string;
}) => (
  <View style={{ flexDirection: "row" }}>
    <Tick size={18} color={Color.Gray.gray100} />
    <Text style={[styles.ruleText, satisfied && styles.greenRuleText]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    height: "100%",
    paddingHorizontal: 16,
  },
  gradientContainer: {
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    marginTop: 16,
    borderRadius: 32,
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
  inputContainer: {
    gap: 12,
  },
  inputGradient: {
    marginTop: 10,
    borderRadius: 16,
    padding: 1,
  },
  inputWrapper: {
    alignItems: "center",
    gap: 12,
    alignContent: "center",
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
  },
  input: {
    ...BODY_1_REGULAR,
    flex: 1,
    color: Color.base.White,
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
    ...CAPTION_1_REGULAR,
    color: Color.System.systemError,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    paddingHorizontal: 20,
  },
  bottomPosition: {
    justifyContent: "flex-end",
  },
});

export default Password;
