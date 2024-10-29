import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";
import { BODY_2_REGULAR } from "@/constants/typography";

const TermsAndCondo = () => {
  const data = [
    {
      title: "Section-1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt rutrum tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget accumsan dolor, id consequat diam.",
    },
    {
      title: "Section-2",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt rutrum tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget accumsan dolor, id consequat diam.",
    },
    {
      title: "Section-3",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt rutrum tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget accumsan dolor, id consequat diam.",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
        <Header title="Terms and Conditions" />
        <ScrollView style={styles.container}>
          {/* {data.map((item, index) => (
          <Accordion key={index} title={item.title} text={item.text} />
        ))} */}
          <Text style={styles.paragraph}>
            Welcome to Lumi! {"\n"}
          </Text>
          <Text style={styles.paragraph}>
            We’re thrilled to have you join our Pilot Program, and we greatly
            appreciate your participation. This program allows us to refine Amuse
            Bouche’s features, ensuring it becomes the best experience possible
            for our entire community, including you!
          </Text>

          <Text style={styles.paragraph}>
            Here at Lumi, we value transparency with our users. So,
            please note that while using the Lumi Application, certain
            user data will be collected. To enable account creation and continued
            user access, it is necessary that user email data is collected.
            Additionally, user experience is unique to each location, which
            requires user location data to also be collected.
          </Text>

          <Text style={styles.paragraph}>
            Aside from user email and location data collection, the rest is up to
            you! You can opt to allow the collection of data such as your birthday
            and profile picture. Opting-in allows us here at Lumi to
            continue to improve the Application so we can provide a more
            seamless and tailored user experience for you.
          </Text>

          <Text style={styles.paragraph}>
            Your privacy is important, and what data you choose to disclose is
            totally up to you! To change your data collection preferences, you can
            go to the privacy section of the settings menu and view the data
            collection options.
          </Text>
          <Text style={styles.paragraph}>
            Disclaimer: The Lumi Application is solely a platform for
            third-parties to engage with users. Any offerings of rewards or
            securities accessible through the Application are provided by third-
            parties. Hash2 Labs LLC, the developer of the Application, is not liable
            for any offers, rewards or any associated claims, damages or losses.
          </Text>

          <Text style={styles.paragraph}>
            One final note, to ensure security and smooth operations during the
            Pilot Program, some features will be limited. Specifically, you won’t be
            able to withdraw or transfer any bitcoin earned until the Pilot Program
            ends. We’ll notify all users via email and app notification as soon as
            the Pilot Program is completed.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 44 }]}>
            We are excited to have you as a part of our growing community!
          </Text>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TermsAndCondo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray600,
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: "column",
    gap: 16,
  },
  paragraph: {
    lineHeight: 18,
    fontSize: 14,
    marginTop: 24,
    color: Color.Gray.gray100, // Assuming this is close to Color.Gray.gray100
    marginBottom: 5, // Adding some space between paragraphs
  },
});
