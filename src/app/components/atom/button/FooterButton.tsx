import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Color from '@/app/constants/Color';
import React from 'react'


interface FooterButtonProps {
  icon: JSX.Element;
  onPress: () => void;
  active: boolean;
  color: string;
  label: string;
}
const FooterButton:React.FC<FooterButtonProps> = ({ icon, onPress, active, color, label }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon}
      <Text style={[ active && { color: color }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FooterButton


const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    flexDirection: "row",
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 44,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    width: 68,
    columnGap: 4,
    height: 68,
  },

  qr: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 32,
    bottom: 20,
    position: "relative",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: Color.Gray.gray100,
    marginTop: 4,
  },
});
