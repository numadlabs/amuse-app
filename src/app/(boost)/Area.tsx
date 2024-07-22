import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Steps from "../components/atom/Steps";
import Color from "../constants/Color";
import Button from "../components/ui/Button";
import { useRouter } from "expo-router";
import useBoostInfoStore from "../lib/store/boostInfoStore";
import { LinearGradient } from "expo-linear-gradient";
import { height, width } from "../lib/utils";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const Area = () => {
  // State to manage button position based on keyboard visibility
  const [buttonPosition, setButtonPosition] = useState("bottom");
  // State to manage input focus
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  // Custom hook to manage area state
  const { area, setArea } = useBoostInfoStore();

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

  return (
    <>
      {/* Component to show current step in a multi-step process */}
      <Steps activeStep={2} />
      {/* KeyboardAvoidingView to handle keyboard appearance */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.body}>
              {/* Gradient background for the main content area */}
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={styles.gradient}
              > 
                <View style={styles.textContainer}>
                  <View style={styles.textWrapper}>
                    <Text style={styles.topText}>Area</Text>
                    <Text style={styles.bottomText}>
                      Restaurants love locals. Get rewarded extra for {"\n"}{" "}
                      staying close to home.
                    </Text>
                  </View>
                  {/* Gradient border for the input field */}
                  <LinearGradient
                    colors={
                      isFocused
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={styles.inputGradient}
                  >
                    <View style={styles.inputWrapper}>
                      {/* Google Places Autocomplete component for area input */}
                      <GooglePlacesAutocomplete
                        placeholder="Area (ex. Prague)"
                        onPress={(data, details = null) => {
                          setArea(data.description);
                        }}
                        query={{
                          key: 'AIzaSyD6P0kwuwr_7RTb5_2UZLNteryotRLItCM',
                          language: 'en',
                          components: "country:cz",
                        }}
                        fetchDetails={true}
                        onFail={(error) => console.error(error)}
                        styles={{
                          separator: styles.separator,
                          textInput: styles.textInput,
                          listView: styles.listView,
                          row: styles.row,
                          poweredContainer: styles.poweredContainer,
                        }}
                        renderRow={(rowData) => (
                          <Text style={styles.suggestion}>{rowData.description}</Text>
                        )}
                        listViewDisplayed="auto"
                        renderDescription={(rowData) => rowData.description}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>
            {/* KeyboardAvoidingView for the button */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={110}
              behavior={Platform.OS === "ios" ? "height" : "padding"}
            >
              {/* Button container with dynamic positioning */}
              <View
                style={[
                  styles.buttonContainer,
                  buttonPosition === "bottom"
                    ? styles.bottomPosition
                    : styles.topPosition,
                ]}
              >
                {/* Continue button, enabled only when area is selected */}
                <Button
                  variant={area ? "primary" : "disabled"}
                  textStyle={area ? "primary" : "disabled"}
                  size="default"
                  onPress={() => router.push("(boost)/Birthday")}
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

export default Area;

// StyleSheet for component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  body: {
    paddingHorizontal: 16,
  },
  gradient: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 32,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
    borderRadius: 32,
  },
  textWrapper: {
    gap: 8,
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
  inputGradient: {
    marginTop: 10,
    borderRadius: 16,
    padding: 1,
    zIndex:9
  },
  inputWrapper: {
    alignItems: "center",
    gap: 12,
    alignContent: "center",
    flexDirection: "row",
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
  },
  separator: {
    backgroundColor: Color.Gray.gray300,
  },
  textInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    color: Color.Gray.gray100,
    fontSize: 16,
    lineHeight: 20,
    backgroundColor: Color.Gray.gray500,
  },
  listView: {
    maxHeight: height / 3,
    overflow: 'hidden',
  },
  row: {
    backgroundColor: Color.Gray.gray400,
    width: width,
  },
  poweredContainer: {
    display: 'none',
  },
  suggestion: {
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 8,
    color: Color.Gray.gray100,
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
});