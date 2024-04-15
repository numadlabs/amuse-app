import Color from "@/app/constants/Color";
import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../ui/Button";
import Animated, {
  withSpring,
  useSharedValue,
  ReduceMotion,
} from "react-native-reanimated";
import PowerUpCard from "../atom/cards/PowerUpCard";

interface PopupProps {
  isVisible: boolean;
  powerUpTitle: string;
  onClose: () => void;
  title: string;
  subText: string;
}

const PowerUp: React.FC<PopupProps> = ({
  isVisible,
  title,
  subText,
  onClose,
  powerUpTitle,
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(isVisible ? 0 : 300, {
      mass: 1.5,
      damping: 80,
      stiffness: 398,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 20,
      reduceMotion: ReduceMotion.System,
    });
  }, [translateY, isVisible]);

  return (
    <Modal animationType="none" transparent={true} visible={isVisible}>
      <View style={styles.container}>
        <Animated.View style={[styles.popup, { transform: [{ translateY }] }]}>
          <View style={styles.content}>
            <PowerUpCard
              title={powerUpTitle}
              onPress={() => console.log("pressed")}
              date="2024/03/10"
            />

            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{subText}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                variant="primary"
                textStyle="primary"
                size="default"
                onPress={onClose}
              >
                Done
              </Button>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 16,
  },
  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 32,
    width: "100%",
    marginBottom: 32,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    color: Color.Gray.gray600,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    color: Color.Gray.gray400,
    fontWeight: "normal",
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
  },
});

export default PowerUp;
