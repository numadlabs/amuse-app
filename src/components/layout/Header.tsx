import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  StyleProp,
} from "react-native";
import { ArrowLeft } from "iconsax-react-native";
import Color from "../../constants/Color";
import { useRouter } from "expo-router";
import { BODY_1_BOLD } from "@/constants/typography";

interface NavbarProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

const Header: React.FC<NavbarProps> = ({ title, titleStyle}) => {
  const router = useRouter();

  return (
    <>
      <SafeAreaView style={{ backgroundColor: Color.Gray.gray600 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.icon}>
            <ArrowLeft size={24} color={Color.Gray.gray50} />
          </TouchableOpacity>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.Gray.gray600,
  },
  icon: {
    position: "absolute",
    left: 16,
  },
  title: {
    ...BODY_1_BOLD,
    color: Color.Gray.gray50,
  },
});

export default Header;
