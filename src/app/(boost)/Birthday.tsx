import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import Button from "../components/ui/Button";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useBoostInfoStore from "../lib/store/boostInfoStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "../lib/service/mutationHelper";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

const Birthday = () => {
  // State for managing button position based on keyboard visibility
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const router = useRouter();
  // Custom hook to manage user information
  const { email, area, birthdate, setBirthdate } = useBoostInfoStore();
  // States for date picker functionality
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialDate, setInitialDate] = useState(new Date());
  const [temporaryDate, setTemporaryDate] = useState(new Date());
  const { authState } = useAuth();
  
  useEffect(() => {
    // Add keyboard listeners to adjust button position
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setButtonPosition("top")
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setButtonPosition("bottom")
    );
    
    // Clean up listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handler for date change in the picker
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTemporaryDate(selectedDate);
      setInitialDate(selectedDate);
    }
  };

  // Handler for confirming date selection
  const handleDatePickerDone = () => {
    setBirthdate(temporaryDate.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  // Mutation hook for updating user information
  const {
    mutateAsync: handleUpdateUser,
  } = useMutation({
    mutationFn: updateUserInfo,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ QrModal ~ data:", data);
      try {
        console.log(" successful:", data);
      } catch (error) {
        console.error(" mutation failed:", error);
      }
    },
  });

  // Function to trigger user update
  const triggerUpdateUser = async () => {
    setLoading(true);
    const userData = {
      email,
      location: area,
      dateOfBirth: birthdate,
    };
    try {
      const data = await handleUpdateUser({
        userId: authState.userId,
        data: userData,
      });
      if (data.success) {
        router.push("(boost)/Success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString(
      Platform.OS === "ios" ? "en-US" : "en-GB",
      options
    );
    return formattedDate;
  };

  return (
    <>
      <Steps activeStep={3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              {/* Gradient background for the main content area */}
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={{
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: Color.Gray.gray400,
                  borderRadius: 32,
                }}
              >
                <View style={styles.textContainer}>
                  <View style={{ gap: 8 }}>
                    <Text style={styles.topText}>Birthday</Text>
                    <Text style={styles.bottomText}>
                      Rewarding the wise, the reckless, and everyone in between.
                    </Text>
                  </View>
                  {/* TouchableOpacity to open date picker */}
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.datePickerText}>
                        {birthdate ? formatDate(birthdate) : "Select Date"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
            {/* Button container with dynamic positioning */}
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
                onPress={triggerUpdateUser}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                    Finish
                  </Text>
                )}
              </Button>
            </View>
            {/* Animated date picker overlay */}
            {showDatePicker && (
              <Animated.View style={styles.dateTimePickerOverlay}
              entering={SlideInDown.springify().damping(20)}
              exiting={SlideOutDown.springify().damping(10)}>
               
                <DateTimePicker
                  value={initialDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                />
                <Button
                  variant="tertiary"
                  onPress={handleDatePickerDone}
                  style={{bottom:15}}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: Color.base.White,
                    }}
                  >
                    Done
                  </Text>
                </Button>
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Birthday;

// StyleSheet for component styles
const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
    borderRadius: 32,
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
  topText: {
    color: Color.base.White,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    fontSize: 12,
    textAlign: "center",
  },
  datePickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: Color.Gray.gray300,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  datePickerText: {
    color: Color.base.White,
  },
  dateTimePickerOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex:99,
    width: "100%",
    backgroundColor: Color.Gray.gray500,
    padding: 16,
  },
});
