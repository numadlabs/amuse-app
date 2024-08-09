import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "@/components/ui/Accordion";

const TermsAndCondo = () => {
  return (
    <>
      <Header title="Privacy policy" />
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
        </ScrollView>
      </View>
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
    fontWeight: "600",
    fontSize: 20,
    fontFamily: "Sora",
    color: Color.base.White,
    marginTop: 20,
  },
  subHeader: {
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Sora",
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
