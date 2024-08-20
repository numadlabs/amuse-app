import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { BODY_1_MEDIUM, BODY_1_REGULAR, H6 } from "@/constants/typography";
import { userKeys } from "@/lib/service/keysHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { deleteUser } from "@/lib/service/mutationHelper";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { CloseCircle, DocumentDownload } from "iconsax-react-native";
import Button from "@/components/ui/Button";
import Close from "@/components/icons/Close";
import { height, width } from "@/lib/utils";
import { router } from "expo-router";
import Accordion from "@/components/ui/Accordion";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TermsAndCondo = () => {
  const [loading, setLoading] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { authState } = useAuth();
  const pressed = useSharedValue(false);
  const { data: user = [] } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
  });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

  const saveProfilePictureSetting = async (value) => {
    try {
      await AsyncStorage.setItem('showProfilePicture', value.toString());
      setShowProfilePicture(value);
    } catch (error) {
      console.error('Error saving profile picture setting:', error);
    }
  };

  const saveDateOfBirthSetting = async (value) => {
    try {
      await AsyncStorage.setItem('showDateOfBirth', value.toString());
      setShowDateOfBirth(value);
    } catch (error) {
      console.error('Error saving date of birth setting:', error);
    }
  };
  const saveAreaSetting = async (value) => {
    try {
      await AsyncStorage.setItem('showArea', value.toString());
      setShowArea(value);
    } catch (error) {
      console.error('Error saving area setting:', error);
    }
  };

  const getAreaSetting = async () => {
    try {
      const data =  await AsyncStorage.getItem('showArea');
      setShowArea(data === 'true');
    } catch (error) {
      console.error('Error saving area setting:', error);
    }
  };

  const getProfilePictureSetting = async () => {
    try {
    const data =  await AsyncStorage.getItem('showProfilePicture');
      setShowProfilePicture(data === 'true');
    } catch (error) {
      console.error('Error saving profile picture setting:', error);
    }
  };

  const getDateOfBirthSetting = async () => {
    try {
      const data =  await AsyncStorage.getItem('showDateOfBirth');
       console.log(data)
      setShowDateOfBirth(data === 'true');
    } catch (error) {
      console.error('Error saving date of birth setting:', error);
    }
  };

  useEffect(() =>  {
    getProfilePictureSetting();
    getDateOfBirthSetting();
    getAreaSetting();
  }, [])

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
  });

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

  const handleDeleteUser = async () => {
    setLoading(true);
    await deleteUserMutation().then(() => {
      toggleBottomSheet;
      setLoading(false);
      router.replace("/Login");
    });
  };

  const data = [
    {
      title: "Data Collection",
      text: "The Platform collects two types of data from its users: necessary datacollection which cannot be disabled and optional data collection which may be enabled/disabled at your discretion.  i. Location:  We use location data to assist you in locating restaurants participating in a program on the Platform. We may store location data to improve and optimize the Platform. ii. Email:  We will store and use your email for account creation, user login, password management and Platform-to-user communications. c. Optional Data Collection i. Birthday: We use birthday data to allow us to offer you a special birthday promotion or reward. ii. Profile Picture: You may opt to add a profile picture in order to personalize your profile. If added, the Platform will automatically store the data.",

    },
    {
      title: "General Data Protection Regulation",
      text: "a. Our legal basis for collecting and using the data is for one or more of the following purposes: i. We need to perform a contract with you. ii. You have given us permission to do so. iii. The processing is in our legitimate interest, and it is not overridden by your rights. iv. It is necessary for payment processing purposes. v. It is necessary to comply with the law.",
    },
    {
      title: "Data Retention and Disclosure",
      text: "a. We will retain data only for as long as is necessary for the purposes as stated in this policy. b. Disclosure of your data may occur for one or more of the following reasons: i. The Platform is involved in a merger, acquisition or asset sale.  ii. We are required by law to disclose your data.  iii. We have a good faith belief that it is necessary to disclose your data in relation to the protection of the Platform and/or legal matters, both potential and active.",
    },
    {
      title: "Data Protection",
      text: "a. The security of your data is important to us, and we strive to use all commercially reasonable means to protect your data. However, we do not guarantee absolute security of your data.",
    },
    {
      title: "User Rights",
      text: "a. You have the following rights regarding your data: i. Access: You can request access to the data of yours that we have collected.  ii. Rectification: You have the right to have your information corrected that information is inaccurate or incomplete.  iii. Objection: You have the right to request that we restrict the processing of your data.  iv. Portability: You have the right to be provided with a copy of your data that we have collected.  v. Withdraw Consent: You have the right to withdraw your consent at any time to the collection of your data.",
    },
  ];

  return (
    <>
      <Header
        title="Privacy policy & Settings"
        titleStyle={{ fontFamily: "Sora", fontWeight: 600 }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          <Text style={[styles.header, { fontSize: 16 }]}>Disclaimer</Text>
          <Text style={[styles.body, { fontSize: 12 }]}>
            By using the Amuse Bouche application platform ("Platform"), you agree to the collection
            and use of information in accordance with this policy.
          </Text>

          {data.map((item, index) => (
            <View style={{ marginVertical: 16 }}>
              <Accordion key={index} title={item.title} text={item.text} />
            </View>

          ))}
          <Text style={[styles.header, { fontSize: 16 }]}>Optional Data</Text>
          <Text style={[styles.body, { fontSize: 12 }]}>
            To maintain data privacy, you have the option to disable specific fields.
          </Text>

          <View style={styles.item}>
            <Text style={styles.label}>Profile picture</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showProfilePicture ? Color.base.White : Color.Gray.gray100}
              value={showProfilePicture}
              onValueChange={saveProfilePictureSetting}
            />

          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Date of birth</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showDateOfBirth ? Color.base.White : Color.Gray.gray100}
              value={showDateOfBirth}
              onValueChange={saveDateOfBirthSetting}
            />

          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Area</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showArea ? Color.base.White : Color.Gray.gray100}
              value={showArea}
              onValueChange={saveAreaSetting}
            />
          </View>
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
                marginBottom: 40,
              }}
            >
              <DocumentDownload size={24} color={Color.System.systemError} />
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
        </ScrollView>
      </View>
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
                  Please consider using your in-app balance before deleting your
                  account.
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
    </>
  );
};

export default TermsAndCondo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray600,
    flex: 1,
    padding: 16,
    flexDirection: "column",
  },
  scrollViewContainer: {
    borderRadius: 16,
    paddingBottom: 60,
    paddingHorizontal: 16,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: Color.Gray.gray500,
    borderColor: Color.Gray.gray300,
  },
  header: {
    ...H6,
    color: Color.base.White,
    marginTop: 20,
  },
  subHeader: {
    ...BODY_1_MEDIUM,
    color: Color.base.White,
  },
  body: {
    fontWeight: "400",
    fontFamily: "Sora",
    color: Color.Gray.gray50,
    lineHeight: 20,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderColor: Color.Gray.gray300,
  },
  label: {
    color: Color.base.White,
    ...BODY_1_REGULAR,
  },
});
