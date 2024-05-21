import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Color from "@/app/constants/Color";
import { useStateStep } from "@/app/lib/store/stepStore";

interface StepperProps {
  step: number;
  currentStep: number;
  handleNavigation: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ step, currentStep, handleNavigation }) => {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor:
          step === currentStep ? Color.Gray.gray50 : Color.Gray.gray500,
      }}
      onPress={() => handleNavigation(step)}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: step === currentStep ? Color.Gray.gray600 : Color.base.White,
        }}
      >
        {step}
      </Text>
    </TouchableOpacity>
  );
};

export default Stepper;
