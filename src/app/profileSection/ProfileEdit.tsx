import { Cake, Camera, Location, Sms, User } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
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
  const { authState } = useAuth();
  const { data: user = [], refetch } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: () => getUserById(authState.userId),
  });

  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
      setDateOfBirth(user.dateOfBirth || "");
    }
  }, [user]);

  useEffect(() => {
    // Check if any data has changed
    if (
      user.nickname !== nickname ||
      user.email !== email ||
      user.location !== location ||
      user.dateOfBirth !== dateOfBirth
    ) {
      setDataChanged(true);
    } else {
      setDataChanged(false);
    }
  }, [user, nickname, email, location, dateOfBirth]);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate.toISOString());
    }
  };

  const triggerUpdateUser = async () => {
    setLoading(true);
    const userData = { nickname, email, location, dateOfBirth };
    try {
      await updateUserInfo({ userId: authState.userId, data: userData });
      await refetch();
      setLoading(false);
      setDataChanged(false); // Reset data change flag after saving
    } catch (error) {
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
              <View style={styles.input}>
                <User color={Color.Gray.gray600} />
                <TextInput
                  placeholder="Nickname"
                  placeholderTextColor={Color.Gray.gray200}
                  value={nickname}
                  onChangeText={setNickname}
                  style={{ fontSize: 20 }}
                />
              </View>
              <View style={styles.input}>
                <Sms color={Color.Gray.gray600} />
                <TextInput
                  placeholderTextColor={Color.Gray.gray200}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={{ fontSize: 20 }}
                />
              </View>
              <View style={styles.input}>
                <Location color={Color.Gray.gray600} />
                <TextInput
                  placeholderTextColor={Color.Gray.gray200}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                  style={{ fontSize: 20 }}
                />
              </View>
              <View style={styles.input}>
                <Cake color={Color.Gray.gray600} />
                <DateTimePicker
                  value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date(Date.now())}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        {dataChanged && (
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
                Save
              </Text>
            )}
          </Button>
        )}
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
    paddingHorizontal: 16,
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
