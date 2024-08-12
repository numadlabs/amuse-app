import Color from "@/constants/Color";
import { BODY_1_REGULAR } from "@/constants/typography";
import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const SplitOTPInput = ({ codeLength = 4, onCodeFilled }) => {
  const [code, setCode] = useState(Array(codeLength).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if current input is filled
    if (text.length === 1 && index < codeLength - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onCodeFilled when all inputs are filled
    if (newCode.every((digit) => digit !== "") && onCodeFilled) {
      onCodeFilled(newCode.join(""));
    }
  };

  const handleKeyPress = (event, index) => {
    // Move to previous input on backspace if current input is empty
    if (
      event.nativeEvent.key === "Backspace" &&
      index > 0 &&
      code[index] === ""
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.input}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          placeholder="-"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  input: {
    width: 48,
    color: Color.base.White,
    height: 48,
    borderWidth: 1,
    borderColor: Color.Gray.gray300,
    borderRadius: 16,
    textAlign: "center",
    ...BODY_1_REGULAR,
    marginHorizontal: 5,
  },
});

export default SplitOTPInput;
