import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <>
      <Header title="Terms and Conditions" />
      <View style={styles.container}>
        {/* {data.map((item, index) => (
          <Accordion key={index} title={item.title} text={item.text} />
        ))} */}
        <Text style={{ color: Color.Gray.gray50, fontSize: 16, marginTop: 16 }}>
          This app is a proof of concept. Any images, locations, rewards, and
          offers are purely for demonstration purposes and do not construe any
          sort of commitment. No Bitcoin, rewards, or perks listed in this app
          are redeemable in any physical location.{"\n"}
          {"\n"}
          This proof of concept app is confidential. Reproduction, publication,
          or dissemination is strictly prohibited.
        </Text>
      </View>
    </>
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
});
