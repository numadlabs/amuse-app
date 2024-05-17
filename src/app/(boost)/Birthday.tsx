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
  TouchableOpacity,
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

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const confirmDate = () => {
    setShow(false);
    // Here you can handle the confirmed date, such as saving it to a database or state
    console.log("Selected Date:", date);
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
                  <TouchableOpacity onPress={showDatepicker}>
                    <View style={{ width: '100%', borderWidth: 1, borderColor: Color.Gray.gray300, height: 48, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 16 }}>
                      <Text style={{ color: Color.base.White }}>
                        {date.toDateString()}
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
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    Finish
                  </Text>
                )}
              </Button>
            </View>
            {show && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  backgroundColor: Color.Gray.gray500,
                  padding: 16,
                }}
              >
                <DateTimePicker
                  value={birthdate ? new Date(birthdate) : new Date()}
                  mode="date"
                  display="spinner"
                  onChange={onChange}
                />
                <Button variant="tertiary" onPress={confirmDate}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: Color.base.White,
                    }}
                  >
                    Confirm date
                  </Text>
                </Button>
              </View>
            )}
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
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
});
