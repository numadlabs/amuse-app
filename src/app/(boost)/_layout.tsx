import React from "react";
import { Stack, router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Color from "@/constants/Color";
import { ArrowLeft } from "iconsax-react-native";

const _layout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <View>
                <ArrowLeft color={Color.Gray.gray50} />
              </View>
            </TouchableOpacity>
          ),
          headerTitle: "Boost",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          },
          headerStyle: { backgroundColor: Color.Gray.gray600 },
        }}
      >
        <Stack.Screen name="Area" />
        <Stack.Screen name="Birthday" />
        <Stack.Screen options={{ headerShown: false }} name="Success" />
      </Stack>
    </>
  );
};

export default _layout;
