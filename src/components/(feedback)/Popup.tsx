import Color from "@/constants/Color";
import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import Button from "../ui/Button";
import Animated, {
  withSpring,
  useSharedValue,
  ReduceMotion,
} from "react-native-reanimated";
import TickCircle from "../icons/TickCircle";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, title }) => {
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
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.popup, { transform: [{ translateY }] }]}>
          <View style={styles.content}>
            <TickCircle />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Perk consumed.</Text>
              {/* <Text style={styles.message}>Check-in successful.</Text> */}
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
    backgroundColor: Color.Gray.gray600,
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
    color: Color.base.White,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    color: Color.Gray.gray50,
    fontWeight: "normal",
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
  },
});

export default Popup;
