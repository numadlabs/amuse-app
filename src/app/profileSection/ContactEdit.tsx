import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";

const ContactEdit = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authState } = useAuth();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");
  const [buttonPosition, setButtonPosition] = useState("bottom");
  // const {
  //   data,1
  //   error,
  //   isLoading,
  //   status,
  //   mutateAsync: handleUpdateUser,
  // } = useMutation({
  //   mutationFn: updateUserInfo,
  //   onError: (error) => {
  //     console.log(error);
  //   },
  //   onSuccess: (data, variables) => {
  //     console.log("🚀 ~ ContactEdit ~ data:", data);
  //     try {
  //       console.log(" successful:", data);
  //     } catch (error) {
  //       console.error(" mutation failed:", error);
  //     }
  //   },
  // });

  // const triggerUpdateUser = async () => {
  //   setLoading(true);
  //   const userData = {
  //     nickname: nickname,
  //     email: email,
  //     location: location,
  //     dateOfBirth: dateOfBirth,
  //     message: message,
  //   };
  //   try {
  //     const data = await handleUpdateUser({
  //       userId: authState.userId,
  //       data: userData,
  //     });
  //     if (data.success) {
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };
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
  return (
    <>
      <Header title="Account" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.body}>
            <View style={styles.container}>
              <View style={styles.input}>
                <TextInput
                  placeholder={"Full name"}
                  placeholderTextColor={Color.Gray.gray200}
                  value={nickname}
                  onChangeText={setNickname}
                  style={{ fontSize: 20 }}
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  placeholderTextColor={Color.Gray.gray200}
                  placeholder={"Email"}
                  value={email}
                  onChangeText={setEmail}
                  style={{ fontSize: 20 }}
                />
              </View>
              <View style={styles.textAreaContainer}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder={"How can we help?"}
                  placeholderTextColor={Color.Gray.gray200} // Adjusted placeholder text color
                  value={message}
                  onChangeText={setMessage}
                  style={{ fontSize: 20 }} // Adjust font size if needed
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <Button
          variant="primary"
          textStyle="primary"
          size="default"
          // onPress={triggerUpdateUser}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Continue
            </Text>
          )}
        </Button>
      </SafeAreaView>
    </>
  );
};

export default ContactEdit;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
  },
  input: {
    height: 48,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },

  textAreaContainer: {
    height: 100, // Set the height of the container
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
