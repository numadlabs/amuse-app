import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import Button from "../components/ui/Button";
import { router, useRouter } from "expo-router";
import useBoostInfoStore from "../lib/store/boostInfoStore";
import { LinearGradient } from "expo-linear-gradient";

const Email = () => {
  // State for managing the button position
  const [buttonPosition, setButtonPosition] = useState("bottom");
  // State for managing the focus state of the TextInput
  const [isFocused, setIsFocused] = useState(false);
  // Hook to navigate using the router
  const router = useRouter();
  // Custom hook to manage email state
  const { email, setEmail } = useBoostInfoStore();

  // Effect to manage keyboard events
  useEffect(() => {
    // Listener for keyboard show event
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setButtonPosition("top")
    );

    // Listener for keyboard hide event
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setButtonPosition("bottom")
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handler for email input change
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  return (
    <>
      {/* Step indicator component */}
      <Steps activeStep={1} />
      {/* Keyboard avoiding view to handle keyboard presence */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* TouchableWithoutFeedback to dismiss the keyboard on touch */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              {/* Linear gradient for styling the email input container */}
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
                    <Text style={styles.topText}>Email</Text>
                    <Text style={styles.bottomText}>
                      Restaurants will use this to get in touch for things like priority reservations. Spam is so 20th century.
                    </Text>
                  </View>
                  {/* Linear gradient for styling the email input */}
                  <LinearGradient
                    colors={
                      isFocused
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
                      {/* TextInput for email */}
                      <TextInput
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={email} // Set the value of the input to the email from the Zustand store
                        onChangeText={handleEmailChange} // Call the handleEmailChange function when the text changes
                        autoCapitalize="none"
                        placeholder="Email"
                        placeholderTextColor={Color.Gray.gray100}
                        style={{
                          flex: 1,
                          fontSize: 16,
                          fontWeight: "400",
                          lineHeight: 20,
                          color: Color.base.White,
                        }}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>
            {/* KeyboardAvoidingView to handle button positioning */}
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
                {/* Button to navigate to the next screen */}
                <Button
                  variant={email ? "primary" : "disabled"}
                  textStyle={email ? "primary" : "disabled"}
                  size="default"
                  onPress={() => router.push("(boost)/Area")}
                >
                  Continue
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Email;

// Styles for the component
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
  },
  bottomPosition: {
    justifyContent: "flex-end",

    ...Platform.select({
      ios: {
        marginBottom: 50,
      },
      android: {
        marginBottom: 20,
      },
    }),
  },
  topPosition: {
    justifyContent: "flex-start",
    ...Platform.select({
      ios: {
        marginBottom: 50,
      },
      android: {
        marginBottom: 20,
      },
    }),
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
});
