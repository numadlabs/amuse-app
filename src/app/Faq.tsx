import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import Accordion from "@/components/ui/Accordion";

const Faq = () => {
  const data = [
    {
      title: "What is Amuse Bouche?",
      text: "Amuse Bouche is a restaurant loyalty app where users earn bitcoin for checking into restaurants and receive perks for being regular customers.",
    },
    {
      title: "What are Membership Cards?",
      text: "Membership Cards represent subscriptions to your favorite restaurants. Easily browse and add Membership Cards on the Discover page to explore participating restaurants in your area.",
    },
    {
      title: "How do I earn rewards with Amuse Bouche?",
      text: "You earn bitcoin and extra perks by scanning a QR code and thereby checking into restaurants on the check-in page. The more you visit, the more you'll be rewarded.",
    },
    {
      title: "Do I need to deal with crypto wallets?",
      text: "No, there's no need for crypto wallet complexity. Your bitcoin rewards are managed within the app.",
    },
    {
      title: "How do I redeem my rewards?",
      text: "You can redeem your rewards directly within the app for various perks offered by participating restaurants.",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <Header title="FAQ" />
      <View style={styles.container}>
        {data.map((item, index) => (
          <Accordion key={index} title={item.title} text={item.text} />
        ))}
      </View>
    </View>
    </SafeAreaView>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray600,
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: "column",
    gap: 16,
  },
});
