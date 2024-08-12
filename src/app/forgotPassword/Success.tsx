import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Color from "@/constants/Color";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/service/keysHelper";
import TickCircle from "@/components/icons/TickCircle";
import useBoostInfoStore from "@/lib/store/boostInfoStore";
import { BODY_2_REGULAR, H6 } from "@/constants/typography";

const Success = () => {
  // Initialize the query client
  const queryClient = useQueryClient();
  const { reset } = useBoostInfoStore();
  // Handler for navigation
  const handleNavigation = () => {
    // Invalidate queries related to user info
    queryClient.invalidateQueries({ queryKey: userKeys.info });
    // Navigate to the main tabs
    router.replace("/(tabs)");
    reset();
  };

  return (
    <View style={styles.body}>
      {/* Linear gradient for styling the success message container */}
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Container for the success icon */}
        <View style={styles.svgContainer}>
          <TickCircle />
        </View>
        {/* Congratulations message */}
        <Text style={styles.topText}>Password changed</Text>
        {/* Reward message */}
        <Text style={styles.bottomText}>Your password has been changed.</Text>
      </LinearGradient>
      {/* Container for the confirm button */}
      <View style={styles.buttonContainer}>
        <Button
          variant="tertiary"
          textStyle="primary"
          size="default"
          onPress={handleNavigation}
        >
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default Success;

// Styles for the component
const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  container: {
    width: "100%",
    height: 212,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    paddingTop: 24,
    paddingBottom: 32,
    marginTop: 16,
    elevation: 4,
    borderRadius: 32,
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  topText: {
    ...H6,
    color: Color.base.White,
    marginTop: 8,
    textAlign: "center",
  },
  bottomText: {
    ...BODY_2_REGULAR,
    marginTop: 12,
    color: Color.Gray.gray100,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
