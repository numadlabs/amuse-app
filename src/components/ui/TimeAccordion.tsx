import React from "react";
import { View, Text } from "react-native";
import Color from "@/constants/Color";

interface TimetableProps {
  title: string;
  opensAt: string;
  closesAt: string;
  isOffDay: boolean;
}

const TimeAccordion: React.FC<TimetableProps> = ({
  opensAt,
  closesAt,
  title,
  isOffDay,
}) => {
  return (
    <View style={{ flexDirection: "column", gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: 14, color: Color.Gray.gray100 }}>{title}</Text>
        {isOffDay ? (
          <Text>-</Text>
        ) : (
          <Text style={{ fontSize: 14, color: Color.Gray.gray50 }}>
            {opensAt}-{closesAt}
          </Text>
        )}
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: Color.Gray.gray400,
        }}
      />
    </View>
  );
};

export default TimeAccordion;
