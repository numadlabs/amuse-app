import {
  Cake,
  Camera,
  CloseCircle,
  DocumentDownload,
  Location,
  Sms,
  User,
} from "iconsax-react-native";
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
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import { deleteUser, updateUserInfo } from "@/lib/service/mutationHelper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { userKeys } from "@/lib/service/keysHelper";
import { height, width } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { SERVER_SETTING } from "@/constants/serverSettings";
import Close from "@/components/icons/Close";

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
  const [isOpen, setIsOpen] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [focusedInput, setFocusedInput] = useState<
    "Nickname" | "Email" | "Area" | "Birthday" | null
  >(null);
  const [error, setError] = useState("");
  const pressed = useSharedValue(false);
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isProfilePrefilled =
    user?.user?.email && user?.user?.location && user?.user?.dateOfBirth;
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
  });

  const handleDeleteUser = async () => {
    setLoading(true);
    await deleteUserMutation().then(() => {
      toggleBottomSheet;
      setLoading(false);
      router.replace("/Login");
    });
  };

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

  const generateCSV = (userData) => {
    const headers = [
      "Nickname",
      "Email",
      "Location",
      "Date of Birth",
      "Balance",
      "Converted Balance",
      "Created At",
      "Visit Count",
      "Profile Picture Link",
    ];

    const profilePicLink = userData.user.profilePicture
      ? `${SERVER_SETTING.PROFILE_PIC_LINK}${userData.user.profilePicture}`
      : "";

    const data = [
      userData.user.nickname,
      userData.user.email,
      userData.user.location,
      userData.user.dateOfBirth || "",
      userData.user.balance,
      userData.convertedBalance,
      userData.user.createdAt,
      userData.user.visitCount,
      profilePicLink,
    ];

    return headers.join(",") + "\n" + data.map((item) => `"${item}"`).join(",");
  };

  const toggleBottomSheet = () => {
    setIsOpen(!isOpen);
  };

  const exportUserData = async () => {
    try {
      const csvContent = generateCSV(user);
      const fileUri = FileSystem.documentDirectory + "user_data.csv";

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing isn't available on your platform");
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error exporting user data:", error);
      alert("Failed to export user data");
    }
  };

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
                      fontSize: 14,
                      lineHeight: 18,
                      fontWeight: "600",
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
                          fontSize: 20,
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
                      fontSize: 14,
                      lineHeight: 30,
                      fontWeight: "600",
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
                          fontSize: 20,
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
                      fontSize: 14,
                      lineHeight: 30,
                      fontWeight: "600",
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
                          fontSize: 20,
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
                      fontSize: 14,
                      lineHeight: 18,
                      fontWeight: "600",
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
                            fontSize: 20,
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

              <TouchableOpacity
                style={{
                  marginTop: 24,
                }}
                onPress={() => exportUserData()}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: Color.Gray.gray400,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 48,
                    gap: 12,
                  }}
                >
                  <DocumentDownload size={24} color={Color.base.White} />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      lineHeight: 24,
                      color: Color.base.White,
                    }}
                  >
                    Download Data
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 12,
                }}
                onPress={toggleBottomSheet}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: Color.System.systemError,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 48,
                    gap: 12,
                  }}
                >
                  <DocumentDownload
                    size={24}
                    color={Color.System.systemError}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      lineHeight: 24,
                      color: Color.System.systemError,
                    }}
                  >
                    Delete Account
                  </Text>
                </View>
              </TouchableOpacity>
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

        {isOpen &&
          (loading ? (
            <View style={{ flex: 1 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <Modal transparent={true}>
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  {
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 98,
                  },
                  animatedStyles,
                ]}
              />
              <Animated.View
                entering={SlideInDown.springify().damping(18)}
                exiting={SlideOutDown.springify()}
                style={[
                  {
                    backgroundColor: Color.Gray.gray600,
                    height: height / 1.5,
                    bottom: 0,
                    width: width,
                    zIndex: 99,
                    position: "absolute",
                    borderTopStartRadius: 32,
                    borderTopEndRadius: 32,
                    gap: 24,
                    padding: 16,
                  },
                  animatedStyles,
                ]}
              >
                <View
                  style={{
                    paddingVertical: 8,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 24,
                      color: Color.base.White,
                      fontWeight: "bold",
                    }}
                  >
                    Delete account
                  </Text>
                  <TouchableOpacity onPress={toggleBottomSheet}>
                    <View
                      style={{
                        backgroundColor: Color.Gray.gray400,
                        borderRadius: 48,
                        padding: 8,
                        width: 32,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: 1,
                        position: "absolute",
                        left: 85,
                        top: -18,
                      }}
                    >
                      <Close />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", gap: 16, padding: 16 }}>
                  <CloseCircle size={96} color={Color.System.systemError} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: Color.System.systemError,
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Are you sure you want to delete your account?
                  </Text>
                  <Text
                    style={{
                      lineHeight: 20,
                      fontSize: 14,
                      color: Color.Gray.gray50,
                      textAlign: "center",
                    }}
                  >
                    This action cannot be undone. You will lose:
                  </Text>
                  <View style={{ width: "100%" }}>
                    <Text
                      style={{
                        lineHeight: 20,
                        fontSize: 14,
                        color: Color.Gray.gray50,
                      }}
                    >
                      • All your personal data
                    </Text>
                    <Text
                      style={{
                        lineHeight: 20,
                        fontSize: 14,
                        color: Color.System.systemError,
                        fontWeight: "bold",
                      }}
                    >
                      • Your entire in-app balance
                    </Text>
                    <Text
                      style={{
                        lineHeight: 20,
                        fontSize: 14,
                        color: Color.Gray.gray50,
                      }}
                    >
                      • All associated content, history, and achievements
                    </Text>
                  </View>
                  <Text
                    style={{
                      lineHeight: 20,
                      fontSize: 14,
                      color: Color.Gray.gray50,
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Please consider using your in-app balance before deleting
                    your account.
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 16,
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="secondary"
                      textStyle="secondary"
                      onPress={toggleBottomSheet}
                      style={{ flex: 1, marginRight: 8 }}
                    >
                      <Text style={{ color: Color.base.White }}>No</Text>
                    </Button>
                    <Button
                      variant="primary"
                      textStyle="primary"
                      onPress={handleDeleteUser}
                      style={{ flex: 1, marginLeft: 8 }}
                    >
                      <Text style={{ color: Color.base.White }}>Yes</Text>
                    </Button>
                  </View>
                </View>
              </Animated.View>
            </Modal>
          ))}
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
