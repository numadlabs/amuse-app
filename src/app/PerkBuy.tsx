import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Color from "./constants/Color";
import Close from "./components/icons/Close";
import { router, useLocalSearchParams } from "expo-router";
import PerkGradient from "./components/icons/PerkGradient";
import Button from "./components/ui/Button";

const PerkBuy = () => {
    const { name, id, price } = useLocalSearchParams();

  return (
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1, paddingHorizontal: 16 }} key={id as string}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            router.back();
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          gap: 24
        }}
      >
        <View
          style={{
            padding: 12,
            backgroundColor: Color.Gray.gray400,
            borderRadius: 12,
            width: 56,
            height: 56,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PerkGradient />
        </View>
        <View style={{ flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: Color.base.White, fontWeight: 'bold', fontSize: 20 }}>{name}</Text>
            <Text style={{ color: Color.Gray.gray100, fontSize: 14, lineHeight: 18, textAlign: 'center' }}>Purchase perk, use it on next visit.</Text>
        </View>
      </View>
      <Button variant="primary" size="large">
        <Text style={{ fontSize: 15, fontWeight: '600', color: Color.base.White }}>{`Buy ${price} BTC`}</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray300,
  },
  closeButton: {
    marginTop: 12,
  },
});

export default PerkBuy;
