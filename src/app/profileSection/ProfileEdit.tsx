import { Cake, Camera, Location, Sms, User } from "iconsax-react-native";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text
} from "react-native";
import Header from "../components/layout/Header";
import Color from "../constants/Color";
import { useMutation, useQuery } from "react-query";
import { getUserById } from "../lib/service/queryHelper";
import { useAuth } from "../context/AuthContext";
import { updateUserInfo } from "../lib/service/mutationHelper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../components/ui/Button";


const ProfileEdit = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authState } = useAuth()
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      // setDate(currentDate.toISOString().split("T")[0]);
      setDateOfBirth(selectedDate.toISOString());
    }
    // setShowDatePicker(false);
  };
  useEffect(() => {
    if (dateOfBirth) {
      setShowDatePicker(true);
    }
  }, [dateOfBirth]);


  const { data: user = [] } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: () => {
      return getUserById(authState.userId)
    }
  })

  const {
    data,
    error,
    isLoading,
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
      nickname: nickname, 
      email: email, 
      location: location, 
      dateOfBirth: dateOfBirth, 
    };
    try {
      const data = await handleUpdateUser({
        userId: authState.userId,
        data: userData,
      });
      if (data.success) {
        // Handle success, e.g., showing a success message
        setLoading(false);
      }
    } catch (error) {
      // Handle error, e.g., showing an error message
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Header title="Account" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.body}>
            <View style={styles.container}>
              <View style={styles.profileContainer}>
                <View style={styles.profilePic}>
                  <User size={48} color={Color.Gray.gray400} />
                  <View style={styles.camera}>
                    <Camera color={Color.Gray.gray50} size={16}></Camera>
                  </View>
                </View>
              </View>
              <View style={styles.input}>
                <User color={Color.Gray.gray600} />
                <TextInput
                  placeholder={user.nickname}
                  placeholderTextColor={Color.Gray.gray200}
                  value={nickname}
                  onChangeText={setNickname}
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
              <View style={styles.input}>
                <Sms color={Color.Gray.gray600} />
                <TextInput
                  placeholderTextColor={Color.Gray.gray200}
                  placeholder={user.email}
                  value={email}
                  onChangeText={setEmail}
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
              <View style={styles.input}>
                <Location color={Color.Gray.gray600} />
                <TextInput
                  placeholderTextColor={Color.Gray.gray200}
                  placeholder={user.location}
                  value={location}
                  onChangeText={setLocation}
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
              <View style={styles.input}>
                <Cake color={Color.Gray.gray600} />
                 {showDatePicker ? (
                  <DateTimePicker
                    value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date(Date.now())}
                  />
                ) : (
                  <Button
                    onPress={openDatePicker}
                    variant="secondary"
                    textStyle="secondary"
                    size="default"
                  >
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''}
                  </Button>
                )}
              </View>
            </View>
          </View>
          
        </ScrollView>
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
      </SafeAreaView>
    </>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
  },
  profilePic: {
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    height: 96,
    padding: 10,
    borderRadius: 200,
    backgroundColor: Color.Gray.gray50,
    position: "relative",
    marginBottom: 32,
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
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
    paddingHorizontal:16,
    gap: 12,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileStatsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  profileStats: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 8,
  },
  profileConfig: {
    gap: 16,
    marginTop: 24,
  },
  configContainer: {
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
});
