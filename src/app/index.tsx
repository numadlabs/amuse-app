import React from "react";
import { Text, View } from "react-native";
import BottomTab from "./components/layout/Footer";


export default function Page() {
  return (
    <>
      <View className="flex flex-1">
        <Text className="">Hello world!</Text>
      </View>
      <BottomTab/>
    </>
  );
}

