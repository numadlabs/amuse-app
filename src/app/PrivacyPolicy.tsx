import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
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

const TermsAndCondo = () => {
  const [loading, setLoading] = useState(false);
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

  return (
    <>
      <Header
        title="Privacy policy"
        titleStyle={{ fontFamily: "Sora", fontWeight: 600 }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          <Text style={styles.header}>1. Data Collection: </Text>
          <Text style={styles.body}>
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              User Location:
            </Text>{" "}
            We use your location information to help you find nearby
            participating restaurants in our loyalty program.{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Email:
            </Text>{" "}
            We require your email address for account creation, login, sending
            one-time passwords, and password reset functionality. {"\n"}{" "}
          </Text>
          <Text style={styles.subHeader}>Optional Data Collection:</Text>
          <Text style={styles.body}>
            In addition to the mandatory data, we also collect the following
            optional information if you choose to provide it: {"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Area:
            </Text>{" "}
            You can optionally provide information about the area you live or
            work in. This helps the registered restaurants better understand
            which areas have the most engaged customers.{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Birthday:{" "}
            </Text>
            You can optionally provide your birthday, which may be used to offer
            special promotions or rewards on your birthday. {"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Profile Picture:
            </Text>{" "}
            You can optionally upload a profile picture, which will be displayed
            in your account.
          </Text>
          <Text style={styles.header}>2. Data usage: </Text>
          <Text style={styles.body}>
            We use the collected data for the following purposes:{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              User Location:{" "}
            </Text>
            To help you find nearby participating restaurants in our loyalty
            program.{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Email:{" "}
            </Text>
            To create and manage your account, send you one-time passwords, and
            allow you to reset your password.{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Area:{" "}
            </Text>
            To provide participating restaurants with aggregated data about the
            areas with the most engaged customers.{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Birthday:{" "}
            </Text>
            To offer you special promotions or rewards on your birthday.{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              {" "}
              Profile Picture:{" "}
            </Text>{" "}
            To personalize your account and display your image to the
            restaurants you visit.
          </Text>
          <Text style={styles.header}>3. Data Protection: </Text>
          <Text style={styles.body}>
            We take the security and privacy of your data seriously. We use
            industry-standard encryption and security measures to protect your
            personal information from unauthorized access, disclosure, or
            misuse. Your data is stored securely and is only accessible to
            authorized personnel who need it to perform their duties.
          </Text>
          <Text style={styles.header}>4. Your Rights: </Text>
          <Text style={styles.body}>
            You have the following rights regarding your personal data:{"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Access:{" "}
            </Text>{" "}
            You can request to access the personal data we have collected about
            you. {"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Correction:{" "}
            </Text>{" "}
            You can request to correct any inaccurate or incomplete personal
            data we have about you. {"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Deletion:{" "}
            </Text>{" "}
            You can request the deletion of your personal data, subject to any
            legal or regulatory obligations we may have. {"\n"}
            <Text style={{ color: Color.base.White, fontWeight: "bold" }}>
              Opt-out:{" "}
            </Text>{" "}
            You can opt-out of sharing your optional data (area, birthday,
            profile picture) at any time.
          </Text>
          <Text style={styles.body}>
            If you have any questions or concerns about our privacy practices,
            please contact our privacy team at privacy@restaurantloyalty.com.
          </Text>
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
});
