import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Color from "@/constants/Color";

interface OtpInputProps {
  length: number;
  onOtpChange: (otp: string) => void;
}

const OtpInputEmail: React.FC<OtpInputProps> = ({ length, onOtpChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    onOtpChange(otp.join(''));
  }, [otp, onOtpChange]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);  // Only keep the last character
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          ref={(ref) => inputRefs.current[index] = ref}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  input: {
    width: 48,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#3A3A3C',
    color: Color.base.White,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OtpInputEmail;