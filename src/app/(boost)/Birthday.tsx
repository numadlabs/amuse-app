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
import BoostSteps from "@/components/atom/BoostSteps";
import Color from "@/constants/Color";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import useBoostInfoStore from "@/lib/store/boostInfoStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/lib/service/mutationHelper";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { BUTTON_40, BUTTON_48, CAPTION_1_REGULAR, H5 } from "@/constants/typography";

const Birthday = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const router = useRouter();
  const { email, area, birthdate, setBirthdate } = useBoostInfoStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { authState } = useAuth();

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
      // keyboardDidHideListener.remove();
    };
  }, []);

  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  };
  const [selectedDate, setSelectedDate] = useState(getMaxDate());
  useEffect(() => {
    if (selectedDate) {
      setBirthdate(selectedDate.toISOString().split("T")[0]);
    }
  }, [selectedDate, setBirthdate]);
  
  const handleDatePicker = (event, date) => {
    if (date) {
      const maxDate = getMaxDate();
      if (date <= maxDate) {
        setSelectedDate(date);
      } else {
        setSelectedDate(maxDate);
      }
      setShowDatePicker(false);
    }
  };

  const { mutateAsync: handleUpdateUser } = useMutation({
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

  const triggerUpdateUser = async () => {
    setLoading(true);
    const userData = {
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

  return (
    <>
      <BoostSteps activeStep={2} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
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
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.datePickerText}>
                        {selectedDate
                          ? selectedDate.toLocaleDateString(
                              Platform.OS === "ios" ? "en-US" : "en-GB",
                              { month: "short", year: "numeric" }
                            )
                          : "Select Date"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
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
                  <Text
                    style={{ color: "white", ...BUTTON_48, fontWeight: "bold" }}
                  >
                    Finish
                  </Text>
                )}
              </Button>
            </View>
            {showDatePicker && (
        <Animated.View
          style={styles.dateTimePickerOverlay}
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.springify().damping(10)}
        >
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDatePicker}
            maximumDate={getMaxDate()}
            textColor="black"
          />
          <Button
            variant="tertiary"
            onPress={() => setShowDatePicker(false)}
            style={{ bottom: 15 }}
          >
            <Text
              style={{
                ...BUTTON_48,
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
    ...H5,
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    ...CAPTION_1_REGULAR,
    textAlign: "center",
  },
  datePickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: Color.Gray.gray300,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  datePickerText: {
    color: Color.base.White,
  },
  dateTimePickerOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 99,
    width: "100%",
    backgroundColor: Color.Gray.gray500,
    padding: 16,
  },
});