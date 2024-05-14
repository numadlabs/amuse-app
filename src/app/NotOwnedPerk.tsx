import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "./constants/Color";
import Close from "./components/icons/Close";
import Popup from "./components/(feedback)/Popup";
import Toast from "react-native-toast-message";
import PerkGradient from "./components/icons/PerkGradient";
import PerkGradientSm from "./components/icons/PerkGradientSm";
import Tick from "./components/icons/Tick";

const NotOwnedPerk = () => {
  const showToast = () => {
    setTimeout(() => {
      Toast.show({
        type: "perkToast",
        text1: "Perk consumed",
      });
    }, 800);
  };
  return (
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
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
      <View style={styles.container}>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 64 }}
        >
          <View
            style={{ flexDirection: "column", gap: 24, alignItems: "center" }}
          >
            <View
              style={{
                padding: 12,
                backgroundColor: Color.Gray.gray400,
                borderRadius: 12,
                width: 52,
                height: 52,
              }}
            >
              <PerkGradient />
            </View>
            <View
              style={{ flexDirection: "column", gap: 12, alignItems: "center" }}
            >
              <Text
                style={{
                  color: Color.base.White,
                  fontSize: 20,
                  lineHeight: 24,
                  fontWeight: "bold",
                }}
              >
                Priority seating on Fridays
              </Text>
              <Text
                style={{
                  color: Color.Gray.gray100,
                  fontSize: 14,
                  lineHeight: 18,
                }}
              >
                Enjoy a free drink on the house, every 5 visits.
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24
          }}
        >
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ width: 40, height: 40, backgroundColor: Color.System.systemSuccess, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Tick size={20} color={Color.base.White}/>
            </View>
            <View style={{ width: 40, height: 40, backgroundColor: Color.Gray.gray500, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Tick size={20} color={Color.Gray.gray100}/>
            </View>
            <View
              style={{
                padding: 12,
                backgroundColor: Color.Gray.gray400,
                borderRadius: 12,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PerkGradientSm />
            </View>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: Color.Gray.gray100,
            }}
          >
            4 Check-ins until next perk
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotOwnedPerk;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray300,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    marginTop: 12,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  container: {
    marginBottom: 64,
    gap: 64,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  powerUpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 15,
  },
  textImageContainer: {
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  bottomDetails: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
  bottomDetails1: {
    flexDirection: "column",
    gap: 4,
  },
  bottomDetailsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray600,
    fontSize: 16,
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});
