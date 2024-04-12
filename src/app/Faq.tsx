import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import Accordion from "./components/ui/Accordion";

const Faq = () => {
  const data = [
    {
      title: "FAQ-1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt rutrum tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget accumsan dolor, id consequat diam.",
    },
    {
      title: "FAQ-2",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt rutrum tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget accumsan dolor, id consequat diam.",
    },
    {
      title: "FAQ-3",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt rutrum tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget accumsan dolor, id consequat diam.",
    },
  ];

  return (
    <>
      <Header title="FAQ" />
      <View style={styles.container}>
        {data.map((item, index) => (
          <Accordion key={index} title={item.title} text={item.text} />
        ))}
      </View>
    </>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.base.White,
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 16
  },
});
