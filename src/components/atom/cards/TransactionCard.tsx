import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Export, Import } from "iconsax-react-native";
import Color from "@/constants/Color";
import { BODY_2_MEDIUM, CAPTION_1_REGULAR } from "@/constants/typography";

interface TransactionCardProps {
  amount: number;
  type: string;
  createdAt: string;
}
const TransactionCard: React.FC<TransactionCardProps> = ({
  amount,
  type,
  createdAt,
}) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(createdAt));

  return (
    <View style={styles.body}>
      <View style={styles.icon}>
        {type == "PURCHASE" ? (
          <Export size={24} color={Color.System.systemError} />
        ) : (
          <Import size={24} color={Color.System.systemSuccess} />
        )}
      </View>
      <View style={{ gap: 8, width: "50%" }}>
        <Text
          style={{
            ...BODY_2_MEDIUM,
            color: Color.Gray.gray50,
            textAlign: "left",
          }}
        >
          {type == "PURCHASE" ? "Withdraw" : "Reward"}
        </Text>
        <Text
          style={{
            color: Color.Gray.gray100,
            ...CAPTION_1_REGULAR,
            textAlign: "left",
          }}
        >
          {formattedDate}
        </Text>
      </View>
      <Text
        style={{
          ...BODY_2_MEDIUM,
          textAlign: "left",
          color: Color.Gray.gray50,
        }}
      >
        {type == "PURCHASE" ? `-${amount.toFixed(5)}` : `+${amount.toFixed(5)}`}{" "}
        BTC
      </Text>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  icon: {
    backgroundColor: Color.Gray.gray400,
    padding: 12,
    borderRadius: 12,
  },
});
