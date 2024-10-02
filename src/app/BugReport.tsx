import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import Button from "@/components/ui/Button";
import { bugReport } from "@/lib/service/mutationHelper";

const BugReportScreen = () => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const reasonOptions = [
    { label: "Select an issue", value: "" },
    {
      label: "Issues with loyalty program or rewards",
      value: "loyalty_program",
    },
    {
      label: "Problems finding or viewing restaurant information",
      value: "restaurant_info",
    },
    { label: "Trouble with my account or profile", value: "account_issues" },
    {
      label: "Difficulty using or navigating the app",
      value: "app_navigation",
    },
    { label: "App is slow or unresponsive", value: "app_performance" },
    { label: "Other issue not listed here", value: "other" },
  ];

  const { mutateAsync: submitBugReport } = useMutation({
    mutationFn: bugReport,
    onSuccess: () => {
      Alert.alert(
        "Success",
        "Your report has been submitted. We will review and address your issue as soon as possible.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    },
    onError: (error) => {
      console.error("Error submitting bug report:", error);
      Alert.alert(
        "Error",
        "We encountered an issue while submitting your report. Please try again later.",
      );
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!reason || !description) {
      Alert.alert(
        "Missing Information",
        "Please select an issue and provide a description.",
      );
      return;
    }

    const deviceModel = Platform.OS === "ios" ? "iPhone" : "Android";
    const appVersion = Constants.expoConfig?.version ?? "Unknown";
    const osVersion = Platform.Version.toString();

    try {
      await submitBugReport({
        deviceModel,
        appVersion,
        osVersion,
        reason,
        description,
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  }, [reason, description, submitBugReport]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Header title="Help Us Improve" />
          <View style={styles.content}>
            <Text style={styles.description}>
              We'd love to hear about any issues you're experiencing or
              suggestions you have for our app.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What's the issue?</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={reason}
                  onValueChange={setReason}
                  style={styles.picker}
                  dropdownIconColor={Color.base.White}
                >
                  {reasonOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={
                        Platform.OS === "android"
                          ? Color.base.Black
                          : Color.base.White
                      }
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tell us more</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                style={styles.textArea}
                placeholder="Please provide any additional details that might help us understand and address the issue."
                placeholderTextColor={Color.Gray.gray100}
              />
            </View>
            <Button
              onPress={handleSubmit}
              variant={reason && description ? "primary" : "disabled"}
              disabled={!reason || !description}
            >
              <Text style={styles.submitButtonText}>{"Submit"}</Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: Color.Gray.gray100,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Color.base.White,
  },
  pickerContainer: {
    backgroundColor: Color.Gray.gray600,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    overflow: "hidden",
  },
  picker: {
    color: Color.base.White,
  },
  textArea: {
    backgroundColor: Color.Gray.gray600,
    borderColor: Color.Gray.gray400,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: Color.base.White,
    height: 100,
    textAlignVertical: "top",
  },
  submitButtonText: {
    color: Color.base.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BugReportScreen;
