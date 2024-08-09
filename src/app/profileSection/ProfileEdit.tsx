import { Cake, Camera, Location, Sms, User } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import { updateUserInfo } from "@/lib/service/mutationHelper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { userKeys } from "@/lib/service/keysHelper";
import { width } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { BODY_1_REGULAR, BODY_2_MEDIUM } from "@/constants/typography";

const ProfileEdit = () => {
  const { authState } = useAuth();
  const { data: user = [] } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
  });
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [initialDate, setInitialDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  const [focusedInput, setFocusedInput] = useState<
    "Nickname" | "Email" | "Area" | "Birthday" | null
  >(null);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isProfilePrefilled =
    user?.user?.email && user?.user?.location && user?.user?.dateOfBirth;

  useEffect(() => {
    if (user) {
      setNickname(user.user.nickname || "");
      setEmail(user.user.email || "");
      setLocation(user.user.location || "");
      setDateOfBirth(user.user.dateOfBirth || "");
      setProfilePicture(user.user.profilePicture || "");
    }
  }, [user]);

  useEffect(() => {
    if (
      user.user.nickname !== nickname ||
      user.user.profilePicture !== profilePicture ||
      user.user.location !== location ||
      user.user.dateOfBirth !== dateOfBirth ||
      user.user.profilePicture !== profilePicture
    ) {
      setDataChanged(true);
    } else {
      setDataChanged(false);
    }
  }, [user, nickname, email, location, dateOfBirth, profilePicture]);

  const onDateChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate.toISOString().split("T")[0]);
      setInitialDate(selectedDate);
    }
  };
  const queryClient = useQueryClient();

  const triggerUpdateUser = async () => {
    setLoading(true);

    // Emoji blocking regex
    const emojiRegex = /\p{Emoji}/u;

    // Date validation
    if (!dateOfBirth) {
      setError("Please select a valid date of birth");
      setLoading(false);
      return;
    }

    // Input validations
    if (nickname.length >= 10) {
      setError("Nickname must be less than 10 characters");
      setLoading(false);
      return;
    }

    // Check for emojis in nickname
    if (emojiRegex.test(nickname)) {
      setError("Nickname cannot contain emojis");
      setLoading(false);
      return;
    }

    // Check for emojis in email
    if (emojiRegex.test(email)) {
      setEmailError("Email cannot contain emojis");
      setLoading(false);
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email");
      setLoading(false);
      return;
    }

    const userData = {
      nickname,
      location,
      dateOfBirth,
      profilePicture: profilePicture
        ? {
            uri: profilePicture.uri,
            type: "image/jpeg",
            name: "profile_picture.jpg",
          }
        : undefined,
    };
    try {
      await updateUserInfo({ userId: authState.userId, data: userData });
      setLoading(false);
      setDataChanged(false);
      queryClient.invalidateQueries({ queryKey: userKeys.info });

      // Navigation based on profile prefill status
      if (!isProfilePrefilled) {
        router.navigate("/Success");
      } else {
        router.back();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Handle error (e.g., show toast message)
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0]);
    }
  };

  const [show, setShow] = useState(false);
  const confirmDate = () => {
    setShow(false);
  };
  const showDatepicker = () => {
    setShow(true);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString(
      Platform.OS === "ios" ? "en-US" : "en-GB",
      options,
    );
    return formattedDate;
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
        <Header title="Account" />
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={styles.body}>
            <LinearGradient
              style={{
                paddingBottom: 16,
                paddingTop: 24,
                paddingHorizontal: 16,
                borderRadius: 24,
              }}
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.container}>
                <View style={styles.profileContainer}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.profilePic}
                  >
                    {user?.user?.profilePicture ? (
                      <Image
                        source={{
                          uri: `${SERVER_SETTING.PROFILE_PIC_LINK}${user?.user?.profilePicture}`,
                        }}
                        style={{ width: 96, height: 96, borderRadius: 48 }}
                      />
                    ) : (
                      <User size={48} color={Color.Gray.gray50} />
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 20,
                      right: width / 3.5,
                      backgroundColor: Color.Gray.gray400,
                      padding: 8,
                      borderRadius: 48,
                    }}
                  >
                    <Camera size={16} color={Color.Gray.gray50} />
                  </View>
                </View>
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: Color.base.White,
                      ...BODY_2_MEDIUM,
                    }}
                  >
                    Nickname
                  </Text>
                  <LinearGradient
                    colors={
                      focusedInput === "Nickname"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      borderRadius: 16,
                      padding: 1,
                    }}
                  >
                    <View style={styles.input}>
                      <User color={Color.Gray.gray50} />
                      <TextInput
                        placeholder="Nickname"
                        placeholderTextColor={Color.Gray.gray200}
                        value={nickname}
                        onChangeText={setNickname}
                        onFocus={() => setFocusedInput("Nickname")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                          height: 48,
                        }}
                      />
                    </View>
                  </LinearGradient>
                  {error && (
                    <Text
                      style={{
                        color: Color.System.systemError,
                        fontSize: 14,
                        lineHeight: 18,
                        fontWeight: "600",
                        marginVertical: 12,
                      }}
                    >
                      {error}
                    </Text>
                  )}
                </View>
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: Color.base.White,
                      ...BODY_2_MEDIUM,
                    }}
                  >
                    Email
                  </Text>
                  <LinearGradient
                    colors={
                      focusedInput === "Email"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      borderRadius: 16,
                      padding: 1,
                    }}
                  >
                    <View style={styles.input}>
                      <Sms color={Color.Gray.gray50} />
                      <TextInput
                        placeholderTextColor={Color.Gray.gray100}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocusedInput("Email")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                          height: 48,
                        }}
                      />
                    </View>
                  </LinearGradient>
                  {emailError && (
                    <Text
                      style={{
                        color: Color.System.systemError,
                        fontSize: 14,
                        lineHeight: 30,
                        fontWeight: "600",
                        marginVertical: 12,
                      }}
                    >
                      {emailError}
                    </Text>
                  )}
                </View>
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: Color.base.White,
                      ...BODY_2_MEDIUM,
                    }}
                  >
                    Area
                  </Text>
                  <LinearGradient
                    colors={
                      focusedInput === "Area"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      borderRadius: 16,
                      padding: 1,
                      marginBottom: 12,
                    }}
                  >
                    <View style={styles.input}>
                      <Location color={Color.Gray.gray50} />
                      <TextInput
                        placeholderTextColor={Color.Gray.gray200}
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                        onFocus={() => setFocusedInput("Area")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          ...BODY_1_REGULAR,
                          color: Color.base.White,
                          width: "100%",
                          height: 48,
                        }}
                      />
                    </View>
                  </LinearGradient>
                </View>
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: Color.base.White,
                      ...BODY_2_MEDIUM,
                    }}
                  >
                    Birthday
                  </Text>
                  <LinearGradient
                    colors={
                      focusedInput === "Birthday"
                        ? [Color.Brand.main.start, Color.Brand.main.end]
                        : [Color.Gray.gray300, Color.Gray.gray300]
                    }
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      borderRadius: 16,
                      padding: 1,
                      marginBottom: 12,
                    }}
                  >
                    <View style={[styles.input]}>
                      <Cake color={Color.Gray.gray50} />
                      <TouchableOpacity onPress={showDatepicker}>
                        <Text
                          style={{
                            ...BODY_1_REGULAR,
                            color: Color.base.White,
                            width: "100%",
                          }}
                        >
                          {dateOfBirth
                            ? formatDate(dateOfBirth)
                            : "Select Date"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              </View>
              {/* <Animated.View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, lineHeight: 18, fontWeight: '600', color: Color.base.White }}>
                  For more rewards
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <ProgressBar progress={progress} width={'85%'} height={8} />
                  <Text style={{ color: Color.base.White, fontSize: 12, lineHeight: 16, fontWeight: '700' }}>{`${progress * 100}%`}</Text>
                </View>
              </Animated.View> */}
            </LinearGradient>
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 16, marginBottom: 30 }}>
          <Button
            variant={dataChanged ? "primary" : "disabled"}
            textStyle={dataChanged ? "primary" : "disabled"}
            size="default"
            onPress={triggerUpdateUser}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Save changes
              </Text>
            )}
          </Button>
        </View>
        {show && (
          <Animated.View
            entering={SlideInDown.springify().damping(20)}
            exiting={SlideOutDown.springify().damping(10)}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              backgroundColor: Color.Gray.gray500,
              padding: 16,
              zIndex: 99,
            }}
          >
            <DateTimePicker
              value={initialDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
            />
            {Platform.OS === "ios" && (
              <Button
                variant="tertiary"
                onPress={confirmDate}
                style={{ bottom: 15 }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: Color.base.White,
                  }}
                >
                  Done
                </Text>
              </Button>
            )}
          </Animated.View>
        )}
      </SafeAreaView>
    </>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    overflow: "hidden",
    borderColor: Color.Gray.gray300,
    borderWidth: 1,

    borderRadius: 24,
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
    backgroundColor: Color.Gray.gray300,
    position: "relative",
    marginBottom: 24,
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
    backgroundColor: Color.Gray.gray600,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
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
