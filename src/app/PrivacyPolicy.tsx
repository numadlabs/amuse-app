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
} from "react-native";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { height, width } from "@/lib/utils";
import Close from "@/components/icons/Close";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateUserInfo } from "@/lib/service/mutationHelper";
import { getUserById } from "@/lib/service/queryHelper";
import { router } from "expo-router";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { userKeys } from "@/lib/service/keysHelper";

const TermsAndCondo = () => {
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const [isBottomTabOpen, setIsBottomTabOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState('');
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
      if (data === null) {
        setter(true);
      } else {
        setter(data === 'true');
      }
    } catch (error) {
      console.error(`Error getting ${key} setting:`, error);
    }
  };

  useEffect(() => {
    getSetting('showProfilePicture', setShowProfilePicture);
    getSetting('showDateOfBirth', setShowDateOfBirth);
    getSetting('showArea', setShowArea);
  }, []);

  const handleToggle = (setting, value) => {
    if (value) {
      // If turning on, just update the state and save the setting
      switch (setting) {
        case 'profilePicture':
          setShowProfilePicture(true);
          saveSetting('showProfilePicture', true);
          break;
        case 'dateOfBirth':
          setShowDateOfBirth(true);
          saveSetting('showDateOfBirth', true);
          break;
        case 'area':
          setShowArea(true);
          saveSetting('showArea', true);
          break;
      }
    } else {
      // If turning off, show the bottom tab
      setCurrentSetting(setting);
      setIsBottomTabOpen(true);
    }
  };

  const confirmToggleOff = async () => {
    setLoading(true);
    try {
      let dataToUpdate = {};
      switch (currentSetting) {
        case 'profilePicture':
          setShowProfilePicture(false);
          saveSetting('showProfilePicture', false);
          dataToUpdate = { profilePicture: "" };
          break;
        case 'dateOfBirth':
          setShowDateOfBirth(false);
          saveSetting('showDateOfBirth', false);
          dataToUpdate = { dateOfBirth: "" };
          break;
        case 'area':
          setShowArea(false);
          saveSetting('showArea', false);
          dataToUpdate = { location: "" };
          break;
      }

      await updateUserInfoMutation({
        userId: authState.userId,
        data: dataToUpdate
      });

      queryClient.invalidateQueries({ queryKey: userKeys.info });
      saveSetting(currentSetting, false);
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
    try {
      await deleteUserMutation();
      setLoading(false);
      setIsDeleteModalOpen(false);
      router.replace("/Login");
    } catch (error) {
      console.error("Error deleting user:", error);
      setLoading(false);
      alert("Failed to delete user account");
    }
  };

  const data = [
    {
      title: "Data Collection",
      text: `The Platform collects two types of data from its users: necessary data collection which cannot be disabled and optional data collection which may be enabled/disabled at your discretion.  
          I. Location: We use location data to assist you in locating restaurants participating in a program on the Platform. We may store location data to improve and optimize the Platform. 
          II. Email: We will store and use your email for account creation, user login, password management, and Platform-to-user communications. 
C. Optional Data Collection 
          I. Birthday: We use birthday data to allow us to offer you a special birthday promotion or reward. 
          II. Profile Picture: You may opt to add a profile picture in order to personalize your profile. If added, the Platform will automatically store the data.`,
    },
    {
      title: "General Data Protection Regulation",
      text: `A. Our legal basis for collecting and using the data is for one or more of the following purposes: 
          I. We need to perform a contract with you. 
          II. You have given us permission to do so. 
          III. The processing is in our legitimate interest, and it is not overridden by your rights. 
          IV. It is necessary for payment processing purposes. 
          V. It is necessary to comply with the law.`,
    },
    {
      title: "Data Retention and Disclosure",
      text: `A. We will retain data only for as long as is necessary for the purposes as stated in this policy. 
B. Disclosure of your data may occur for one or more of the following reasons: 
          I. The Platform is involved in a merger, acquisition, or asset sale.  
          II. We are required by law to disclose your data.  
          III. We have a good faith belief that it is necessary to disclose your data in relation to the protection of the Platform and/or legal matters, both potential and active.`,
    },
    {
      title: "Data Protection",
      text: `A. The security of your data is important to us, and we strive to use all commercially reasonable means to protect your data. However, we do not guarantee absolute security of your data.`,
    },
    {
      title: "User Rights",
      text: `A. You have the following rights regarding your data: 
          I. Access: You can request access to the data of yours that we have collected.  
          II. Rectification: You have the right to have your information corrected if it is inaccurate or incomplete.  
          III. Objection: You have the right to request that we restrict the processing of your data.  
          IV. Portability: You have the right to be provided with a copy of your data that we have collected.  
          V. Withdraw Consent: You have the right to withdraw your consent at any time to the collection of your data.`,
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
            <View key={index} style={{ marginVertical: 16 }}>
              <Accordion title={item.title} text={item.text} />
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
              onValueChange={(value) => handleToggle('profilePicture', value)}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Date of birth</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showDateOfBirth ? Color.base.White : Color.Gray.gray100}
              value={showDateOfBirth}
              onValueChange={(value) => handleToggle('dateOfBirth', value)}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Area</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showArea ? Color.base.White : Color.Gray.gray100}
              value={showArea}
              onValueChange={(value) => handleToggle('area', value)}
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
            onPress={() => setIsDeleteModalOpen(true)}
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
              <CloseCircle size={24} color={Color.System.systemError} />
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

      {isBottomTabOpen && (
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
            <View style={styles.bottomTabContent}>
              <Warning2 size={62} color={Color.System.systemWarning} />
              <View style={{alignItems:'center', gap:8}}>
                <Text style={styles.bottomTabTitle}>Are you sure?</Text>
                <Text style={styles.bottomTabText}>
                  This action will permanently delete the information you've provided.
                </Text>
              </View>
              <View style={styles.bottomTabButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelToggleOff}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmToggleOff}>
                  <Text style={styles.buttonText}>Yes, Turn off</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>
      )}
      {isDeleteModalOpen && (
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
                height: height / 2,
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
            <View style={styles.bottomTabContent}>
              <CloseCircle size={96} color={Color.System.systemError} />
              <View style={{alignItems:'center', gap:8}}>
                <Text style={styles.bottomTabTitle}>Delete Account</Text>
                <Text style={styles.bottomTabText}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
              </View>
              <View style={styles.bottomTabButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsDeleteModalOpen(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleDeleteUser}>
                  <Text style={styles.buttonText}>Yes, Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>
      )}

      {loading && (
        <Modal style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Color.base.White} />
        </Modal>
      )}
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
  bottomTabContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 32,
  },
  bottomTabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.base.White,
    marginBottom: 16,
  },
  bottomTabText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: Color.Gray.gray50,
    marginBottom: 24,
  },
  bottomTabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    paddingHorizontal: 24,
    borderRadius: 48,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Color.Gray.gray400,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 48,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Color.base.White,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
});