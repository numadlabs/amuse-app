import Color from "@/app/constants/Color";
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ArrowUp2, ArrowDown2 } from "iconsax-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const Accordion = ({ text, title }) => {
  const [open, setOpen] = useState(false);
  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setOpen(!open);
  };

  return (
    <LinearGradient
      colors={[Color.Brand.card.start, Color.Brand.card.end]}
      style={{
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Color.Gray.gray300,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: Color.Gray.gray50 }}
        >
          {title}
        </Text>
        {open ? (
          <ArrowUp2 size={20} color={Color.Gray.gray100} />
        ) : (
          <ArrowDown2 size={20} color={Color.Gray.gray100} />
        )}
      </TouchableOpacity>
      <Animated.View entering={FadeIn}>
        <TouchableOpacity onPress={handlePress}>
          {open && (
            <Animated.View>
              <Text
                style={{
                  color: Color.Gray.gray100,
                  fontSize: 14,
                  marginTop: 8,
                }}
              >
                {text}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

export default Accordion;
