import Color from "@/app/constants/Color";
import React, { useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, Platform } from "react-native";
import { ArrowUp2, ArrowDown2 } from "iconsax-react-native";

const Accordion = ({ text, title }) => {
  const [open, setOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setOpen(!open);
    Animated.timing(fadeAnim, {
      toValue: open ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    });
  };

  return (
    <View
      style={{
        backgroundColor: Color.Gray.gray500,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Color.Gray.gray300,
        justifyContent: 'center',
        ...Platform.select({
          ios: {
            shadowColor: Color.Gray.gray500,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 12,
          },
          android: {
            elevation: 12,
          },
        }),
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: Color.Gray.gray50 }}
        >
          {title}
        </Text>
        {open ? <ArrowUp2 size={20} color={Color.Gray.gray100}/> : <ArrowDown2 size={20} color={Color.Gray.gray100} />}
      </TouchableOpacity>
      <Animated.View style={{ paddingTop: 8 }}>
        {open && (
          <Text style={{ color: Color.Gray.gray100, fontSize: 14 }}>
            {text}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

export default Accordion;
