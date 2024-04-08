import Color from "@/app/constants/Color";
import { TickCircle } from "iconsax-react-native";
import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import Button from "../ui/Button";
import { useRouter } from "expo-router"; // Import the useRouter hook for navigation

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const BoostSuccess: React.FC<PopupProps> = ({ isVisible, onClose }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation, isVisible]);

  const handleNavigation = () => {
    router.push({
      pathname: "(tabs)/",
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      // onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnimation,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
              width: 300,
              gap: 16,
            }}
          >
            <TickCircle size={72} color={Color.System.systemSuccess} />
            <View style={{ alignItems: "center", gap: 8, marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 24,
                  color: Color.Gray.gray600,
                  fontWeight: "bold",
                }}
              >
                Success
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.Gray.gray400,
                  fontWeight: "normal",
                }}
              >
                Every time you use an membership card, you will receive extra rewards.
                Manage personal info in your settings.
              </Text>
            </View>
            <Button
              variant="primary"
              textStyle="primary"
              size="default"
              onPress={() => {
                onClose();
                handleNavigation();
              }}
            >
              Done
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BoostSuccess;
