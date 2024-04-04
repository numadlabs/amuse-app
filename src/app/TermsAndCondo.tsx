import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import Accordion from "./components/ui/Accordion";

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
        {data.map((item, index) => (
          <Accordion key={index} title={item.title} text={item.text} />
        ))}
      </View>
    </>
  );
};

export default TermsAndCondo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.base.White,
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 16
  },
});
