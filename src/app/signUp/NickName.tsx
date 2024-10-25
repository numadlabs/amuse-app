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
import Steps from "@/components/atom/Steps";
import Button from "@/components/ui/Button";
import Color from "@/constants/Color";
import { useAuth } from "@/context/AuthContext";
import { useSignUpStore } from "@/lib/store/signUpStore";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import Header from "@/components/layout/Header";
import { BODY_1_REGULAR, BUTTON_48, CAPTION_1_REGULAR, H5 } from "@/constants/typography";
const NickName = () => {
  const { nickname, setNickname, password, verificationCode, email, reset } =
    useSignUpStore();
  const [error, setError] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const { onRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await onRegister(
        nickname,
        email,
        password as string,
        verificationCode,
      );
      if (response.data) {
        console.log("Register successful:", response.data);
        router.replace("/(tabs)");
        reset();
      } else if (response && response.error) {
        setError("Email is already signed up.");
        console.log(error);
      } else {
        console.log("Register failed:", response.data);
      }
    } catch (error) {
      console.error("Error during register:", error);
    } finally {
      setLoading(false);
    }
  };

  const AnimatedText = Animated.createAnimatedComponent(Text);

  return (
    <>
      <Header title="Sign up" />
      <Steps activeStep={3} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={{
                  borderWidth: 1,
                  borderColor: Color.Gray.gray400,
                  borderRadius: 32,
                  marginTop: 16,
                }}
              >
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
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                        }}
                      />
                    </View>
                  </LinearGradient>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {error ? (
                      <AnimatedText
                        entering={FadeIn}
                        style={{
                          color: Color.System.systemError,
                          ...BUTTON_48,
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </AnimatedText>
                    ) : null}
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={[styles.buttonContainer, styles.bottomPosition]}>
              <Button
                variant={!nickname ? "disabled" : "primary"}
                onPress={handleRegister}
                textStyle={!nickname ? "disabled" : "primary"}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text>Finish</Text>
                )}
              </Button>
            </View>
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
    ...H5,
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    ...CAPTION_1_REGULAR,
    textAlign: "center",
  },
});
