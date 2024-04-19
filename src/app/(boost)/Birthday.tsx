import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import PrimaryButton from "../components/atom/button/PrimaryButton";
import Button from "../components/ui/Button";
import { router, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useBoostInfoStore from "../lib/store/boostInfoStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import BoostSuccess from "../components/(feedback)/BoostSuccess";
import { updateUserInfo } from "../lib/service/mutationHelper";
import { LinearGradient } from "expo-linear-gradient";

const Email = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const router = useRouter();
  const { email, area, birthdate, setBirthdate } = useBoostInfoStore(); // Destructure the birthdate and setBirthdate from the Zustand hook

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
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
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      // setDate(currentDate.toISOString().split("T")[0]);
      setBirthdate(selectedDate.toISOString());
    }
    // setShowDatePicker(false);
  };

  useEffect(() => {
    if (birthdate) {
      setShowDatePicker(true);
    }
  }, [birthdate]);

  const {
    data,
    error,
    status,
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
        // setEncryptedTap(data.data.data);
        // togglePopup();
      } catch (error) {
        console.error(" mutation failed:", error);
      }
    },
  });

  const triggerUpdateUser = async () => {
    setLoading(true);
    const userData = {
      email,
      location: area,
      dateOfBirth: birthdate,
      // Add any other data you want to send
    };
    try {
      const data = await handleUpdateUser({
        userId: authState.userId,
        data: userData,
      });
      if (data.success) {
        router.push("(boost)/Success");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
                {/* <TextInput onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder='Birthday' style={isFocused ? { borderColor: Color.Gray.gray600, height: 48, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, marginTop: 10, } : { height: 48, borderWidth: 1, borderColor: Color.Gray.gray100, borderRadius: 16, paddingHorizontal: 16, marginTop: 10, }} /> */}
                {/* <Button
                  onPress={openDatePicker}
                  variant="secondary"
                  textStyle="secondary"
                  size="default"
                >
                  Select Birthdate
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthdate ? new Date(birthdate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )} */}
                {showDatePicker ? (
                  <DateTimePicker
                    value={birthdate ? new Date(birthdate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    // textColor={"#333"}
                    // // accentColor={accentColor || undefined}
                    // neutralButton={{ label: "#F3F4F6" }}
                    // negativeButton={{ label: "Cancel", textColor: "red" }}
                    // positiveButton={{ label: "OK", textColor: "green" }}
                    // neutralButton={{ label: "Clear", textColor: "grey" }}
                    maximumDate={new Date(Date.now())}
                    // minimumDate={new Date(1900, 0, 1)}
                    // themeVariant="dark"
                  />
                ) : (
                  <Button
                    onPress={openDatePicker}
                    variant="primary"
                    textStyle="primary"
                    size="default"
                  >
                    Select Birthdate
                  </Button>
                )}
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
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    Continue
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Email;

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
  // This only works on iOS
  datePicker: {
    // width: 320,
    // backgroundColor: "white",
    // height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
