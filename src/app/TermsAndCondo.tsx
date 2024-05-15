import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRouter } from "expo-router";
import Steps from "./components/atom/Steps";
import Color from "./constants/Color";
import Button from "./components/ui/Button";
import useBoostInfoStore from "./lib/store/boostInfoStore";

const GOOGLE_MAPS_API_KEY = "AIzaSyDLFwoZfCSJErsQQwNwFiqRDmLVICrnjdg"; // Replace with your API key

const Area = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const router = useRouter();
  const { area, setArea } = useBoostInfoStore();

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

  const handleAreaChange = (data: any, details: any) => {
    setArea(details.formatted_address);
  };

  return (
    <>
      <Steps activeStep={2} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.body}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={styles.gradientContainer}
              >
                <View style={styles.textContainer}>
                  <View style={styles.textGap}>
                    <Text style={styles.topText}>Area</Text>
                    <Text style={styles.bottomText}>
                      Restaurants love locals. Get rewarded extra for {"\n"}
                      staying close to home.
                    </Text>
                  </View>
                  <View style={styles.inputContainer}>
                  
                  </View>
                </View>
              </LinearGradient>
            </View>

            <GooglePlacesAutocomplete
                      placeholder="Area (ex. Dubai Marina)"
                      minLength={2} // Minimum characters to start fetching suggestions
                      fetchDetails={true}
                      onPress={handleAreaChange}
                      query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: "en",
                        types: "(cities)",
                      }}
                    // ...
                    />
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
                onPress={() => router.push("(boost)/Birthday")}
              >
                Continue
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Area;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  body: {
    paddingHorizontal: 16,
  },
  gradientContainer: {
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
  textGap: {
    gap: 8,
  },
  listView: {
    position: 'absolute',
    top: 56, // Height of textInputContainer + margin
    left: 16,
    right: 16,
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
  },
  description: {
    color: Color.base.White,
  },
  row: {
    backgroundColor: Color.Gray.gray500,
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
  inputContainer: {
    marginTop: 10,
    borderRadius: 16,
    padding: 1,
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
});
