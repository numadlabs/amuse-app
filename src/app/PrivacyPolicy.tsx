import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { BODY_1_REGULAR, H6 } from "@/constants/typography";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Accordion from "@/components/ui/Accordion";
import { DocumentDownload, Warning2, CloseCircle } from "iconsax-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { logoutHandler, useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateUserInfo } from "@/lib/service/mutationHelper";
import { getUserById } from "@/lib/service/queryHelper";
import { router } from "expo-router";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { userKeys } from "@/lib/service/keysHelper";

const { width, height } = Dimensions.get("window");

const TermsAndConditions = () => {
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const [isBottomTabOpen, setIsBottomTabOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateUserInfoMutation } = useMutation({
    mutationFn: updateUserInfo,
  });
  const pressed = useSharedValue(false);
  const { authState } = useAuth();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

  const { data: user = [] } = useQuery({
    queryKey: ["user", authState.userId],
    queryFn: () => getUserById(authState.userId),
  });

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
  });

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Error saving ${key} setting:`, error);
    }
  };

  const getSetting = async (key, setter) => {
    try {
      const data = await AsyncStorage.getItem(key);
      setter(data === null ? true : data === "true");
    } catch (error) {
      console.error(`Error getting ${key} setting:`, error);
    }
  };

  useEffect(() => {
    getSetting("showProfilePicture", setShowProfilePicture);
    getSetting("showDateOfBirth", setShowDateOfBirth);
    getSetting("showArea", setShowArea);
  }, []);

  const handleToggle = (setting, value) => {
    if (value) {
      saveSetting(
        `show${setting.charAt(0).toUpperCase() + setting.slice(1)}`,
        true
      );
      switch (setting) {
        case "profilePicture":
          setShowProfilePicture(true);
          break;
        case "dateOfBirth":
          setShowDateOfBirth(true);
          break;
        case "area":
          setShowArea(true);
          break;
      }
    } else {
      setCurrentSetting(setting);
      setIsBottomTabOpen(true);
    }
  };

  const confirmToggleOff = async () => {
    setLoading(true);
    try {
      let dataToUpdate = {};
      switch (currentSetting) {
        case "profilePicture":
          setShowProfilePicture(false);
          dataToUpdate = { profilePicture: "" };
          break;
        case "dateOfBirth":
          setShowDateOfBirth(false);
          dataToUpdate = { birthYear: "", birthMonth: "" };
          break;
        case "area":
          setShowArea(false);
          dataToUpdate = { countryId: "" };
          break;
      }
      await updateUserInfoMutation({
        userId: authState.userId,
        data: dataToUpdate,
      });

      queryClient.invalidateQueries({ queryKey: userKeys.info });
      saveSetting(
        `show${
          currentSetting.charAt(0).toUpperCase() + currentSetting.slice(1)
        }`,
        false
      );
    } catch (error) {
      console.error(`Error updating ${currentSetting}:`, error);
    } finally {
      setLoading(false);
      setIsBottomTabOpen(false);
    }
  };

  const cancelToggleOff = () => {
    setIsBottomTabOpen(false);
  };

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
    setIsDeleteModalOpen(false);

    try {
      const response = await deleteUserMutation();
      console.log("🚀 ~ handleDeleteUser ~ response:", response);
      if (response.success) {
        // Perform logout and clear all data
        await logoutHandler();
      } else {
        throw new Error("Cannot delete user: " + response.error);
      }
    } catch (error) {
      console.log("Error deleting user:", error);
      alert(`Failed to delete user account ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderToggleItem = (label, value, onValueChange) => (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{
          false: Color.Gray.gray300,
          true: Color.System.systemSuccess,
        }}
        thumbColor={value ? Color.base.White : Color.Gray.gray100}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );

  const renderButton = (onPress, icon, text, style) => (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={styles.buttonContent}>
        {icon}
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  const data = [
    {
      title: "Data Collection",
      text: `a. The Platform collects two types of data from its users: necessary data collection which cannot be disabled and optional data collection which may be enabled/disabled at your discretion.

b. Necessary Data Collection
	I. Location: We use location data to assist you in locating restaurants participating in a program on the Platform. We may store location data to improve and optimize the Platform.
	II. Email: We will store and use your email for account creation, user login, password management and Platform-to-user communications.

c. Optional Data Collection
	I. Birthday: We use birthday data to allow us to offer you a special birthday promotion or reward.
	II. Profile Picture: You may opt to add a profile picture in order to personalize your profile. If added, the Platform will automatically store the data. `,
    },
    {
      title: "General Data Protection Regulation",
      text: `a. Our legal basis for collecting and using the data is for one or more of the following purposes:
	I. We need to perform a contract with you.
	II. You have given us permission to do so.
	III. The processing is in our legitimate interest, and it is not overridden by your rights.
	IV. It is necessary for payment processing purposes.
	V. It is necessary to comply with the law. `,
    },
    {
      title: "Data Retention and Disclosure",
      text: `a. We will retain data only for as long as is necessary for the purposes as stated in this policy.

b. Disclosure of your data may occur for one or more of the following reasons:
	I. The Platform is involved in a merger, acquisition or asset sale.
	II. We are required by law to disclose your data.
	III. We have a good faith belief that it is necessary to disclose your data in relation to the protection of the Platform and/or legal matters, both potential and active. `,
    },
    {
      title: "Data Protection",
      text: `a. The security of your data is important to us, and we strive to use all commercially reasonable means to protect your data. However, we do not guarantee absolute security of your data.`,
    },
    {
      title: "User Rights",
      text: `a. You have the following rights regarding your data:
	I. Access: You can request access to the data of yours that we have collected.
	II. Rectification: You have the right to have your information corrected
that information is inaccurate or incomplete.
	III. Objection: You have the right to request that we restrict the processing of your data.
	IV. Portability: You have the right to be provided with a copy of your data that we have collected.
	V. Withdraw Consent: You have the right to withdraw your consent at any time to the collection of your data.
`,
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
          <Text style={styles.sectionHeader}>Disclaimer</Text>
          <Text style={styles.sectionBody}>
            By using the Amuse Bouche application platform ("Platform"), you
            agree to the collection and use of information in accordance with
            this policy.
          </Text>

          {data.map((item, index) => (
            <View key={index} style={{ marginVertical: 16 }}>
              <Accordion title={item.title} text={item.text} />
            </View>
          ))}

          <Text style={styles.sectionHeader}>Optional Data</Text>
          <Text style={styles.sectionBody}>
            To maintain data privacy, you have the option to disable specific
            fields.
          </Text>

          {renderToggleItem("Profile picture", showProfilePicture, (value) =>
            handleToggle("profilePicture", value)
          )}
          {renderToggleItem("Date of birth", showDateOfBirth, (value) =>
            handleToggle("dateOfBirth", value)
          )}
          {renderToggleItem("Country", showArea, (value) =>
            handleToggle("area", value)
          )}

          {renderButton(
            exportUserData,
            <DocumentDownload size={24} color={Color.base.White} />,
            "Download Data",
            styles.downloadButton
          )}

          {renderButton(
            () => setIsDeleteModalOpen(true),
            <CloseCircle size={24} color={Color.System.systemError} />,
            "Delete Account",
            styles.deleteButton
          )}
        </ScrollView>
      </View>

      <Modal transparent={true} visible={isBottomTabOpen}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.modalOverlay, animatedStyles]}
        />
        <Animated.View
          entering={SlideInDown.springify().damping(18)}
          exiting={SlideOutDown.springify()}
          style={[styles.bottomTab, animatedStyles]}
        >
          <View style={styles.bottomTabContent}>
            <Warning2 size={62} color={Color.System.systemWarning} />
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={styles.bottomTabTitle}>Are you sure?</Text>
              <Text style={styles.bottomTabText}>
                This action will permanently delete the information you've
                provided.
              </Text>
            </View>
            <View style={styles.bottomTabButtons}>
              {renderButton(
                cancelToggleOff,
                null,
                "Cancel",
                styles.cancelButton
              )}
              {renderButton(
                confirmToggleOff,
                null,
                "Yes, Turn off",
                styles.confirmButton
              )}
            </View>
          </View>
        </Animated.View>
      </Modal>

      <Modal transparent={true} visible={isDeleteModalOpen}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[StyleSheet.absoluteFill, styles.modalOverlay]}
        />
        <Animated.View
          entering={SlideInDown.springify().damping(18)}
          exiting={SlideOutDown.springify()}
          style={[styles.modalContent, { width: width }]}
        >
          <View style={styles.iconContainer}>
            <CloseCircle size={96} color={Color.System.systemError} />
          </View>
          <Text style={styles.bottomTabTitle}>IMPORTANT NOTICE</Text>

          <Text style={styles.bottomTabText}>
            The Pilot Program for Amuse Bouche is still ongoing. If you proceed
            with deleting your account, you will forfeit all bitcoin accumulated
            in your Amuse Bouche account. Once deleted, you will not be able to
            recover or transfer your bitcoin.
          </Text>
          <Text style={styles.bottomTabText}>
            However, your bitcoin will not be forfeited if you maintain your
            account until the completion of the Pilot Program and the full
            launch of the Application. You will then be able to transfer your
            bitcoin at your discretion. Please note that deleting your account
            will also result in the permanent erasure of all your data. By
            deleting your account, you acknowledge and accept these terms.
          </Text>
          <View style={styles.bottomTabButtons}>
            {renderButton(
              () => setIsDeleteModalOpen(false),
              null,
              "Cancel",
              styles.cancelButton
            )}
            {renderButton(
              handleDeleteUser,
              null,
              "Delete My Account",
              styles.confirmButton
            )}
          </View>
        </Animated.View>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Color.base.White} />
        </View>
      )}
    </>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray600,
    flex: 1,
    padding: 16,
    flexDirection: "column",
  },
  scrollViewContainer: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Color.Gray.gray500,
    borderColor: Color.Gray.gray300,
    borderWidth: 1,
  },
  sectionHeader: {
    ...H6,
    color: Color.base.White,
    marginTop: 20,
    fontSize: 16,
  },
  sectionBody: {
    fontWeight: "400",
    fontFamily: "Sora",
    color: Color.Gray.gray50,
    lineHeight: 20,
    marginTop: 20,
    fontSize: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderColor: Color.Gray.gray300,
  },
  label: {
    color: Color.base.White,
    ...BODY_1_REGULAR,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonText: {
    fontSize: Platform.OS === "ios" ? 12 : 15,
    fontWeight: "600",
    lineHeight: 24,
    color: Color.base.White,
  },
  downloadButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 48,
  },
  deleteButton: {
    marginTop: 12,
    marginBottom: 40,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Color.System.systemError,
    borderRadius: 48,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: 98,
  },
  bottomTab: {
    backgroundColor: Color.Gray.gray600,
    bottom: 0,
    width: width,
    zIndex: 99,
    position: "absolute",
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    padding: 16,
  },
  bottomTabContent: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 32,
  },
  bottomTabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Color.base.White,
    marginBottom: 16,
    textAlign: "center",
  },
  bottomTabText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    color: Color.Gray.gray50,
    marginBottom: 24,
  },
  bottomTabButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    paddingHorizontal: 24,
    borderRadius: 48,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: Color.Gray.gray400,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 48,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Color.Gray.gray600,
    position: "absolute",
    bottom: 0,
    zIndex: 99,
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    padding: 16,
    maxHeight: height * 0.9,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
});
