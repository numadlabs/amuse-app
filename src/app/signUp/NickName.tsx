import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Steps from "../components/atom/Steps";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import { useSignUpStore } from "../lib/store/signUpStore";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
const NickName = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const { password, phoneNumber, prefix } = useLocalSearchParams();
  const { nickname, setNickname } = useSignUpStore();
  const [error, setError] = useState<string>("")
  const [isFocused, setIsFocused] = useState(false);

  const { onRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await onRegister(
        nickname,
        prefix as string,
        phoneNumber as string,
        password as string
      );
      console.log(phoneNumber, password, nickname, prefix);
      if (response.data) {
        console.log("Register successful:", response.data);
        router.push("/(tabs)");
      } else if (response && response.error) {
        setError("User already exists with this phone number");
        console.log(error)
      }
      else {
        console.log("Register failed:", response.data);
      }
    } catch (error) {
      console.error("Error during register:", error);
    } finally {
      setLoading(false);
    }
  };

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


  const AnimatedText = Animated.createAnimatedComponent(Text)

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
                style={{ borderWidth: 1, borderColor: Color.Gray.gray400, borderRadius: 32, marginTop: 16 }}>
                <View style={styles.textContainer}>
                  <View style={{ gap: 8 }}>
                    <Text style={styles.topText}>Nickname</Text>
                    <Text style={styles.bottomText}>
                      This will be shared with others. We want exclusive {"\n"}
                      invites to feel special.
                    </Text>
                  </View>
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
                      <TextInput
                        value={nickname}
                        onChangeText={setNickname}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholderTextColor={Color.Gray.gray100}
                        placeholder="Nickname"
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
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    {error ? <AnimatedText entering={FadeIn} style={{ color: Color.System.systemError, fontSize:15, textAlign:'center' }}>{error}</AnimatedText> : null}
                  </View>

                </View>
              </LinearGradient>
            </View>
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
                <Button
                  variant={!nickname ? "disabled" : 'primary'}
                  onPress={handleRegister}
                  textStyle={!nickname ? "disabled" : 'primary'}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (

                    <Text
                    >
                      Finish
                    </Text>
                  )}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default NickName;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
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
    lineHeight: 16,
    textAlign: "center",
  },
});
