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
import { ArrowLeft, ShoppingCart } from "iconsax-react-native";
import Color from "../../constants/Color";
import { useRouter } from "expo-router";
import { BODY_1_BOLD } from "@/constants/typography";

interface NavbarProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

const RestaurantHeader: React.FC<NavbarProps> = ({ title, titleStyle}) => {
  const router = useRouter();

  return (
    <>
      <SafeAreaView style={{ backgroundColor: Color.Gray.gray600 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()}>
            <View style={{}}>
            <ArrowLeft size={24} color={Color.Gray.gray50} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {/* <TouchableOpacity onPress={() => router.navigate('/Cart')}>
            <View style={{}}>
            <ShoppingCart size={24} color={Color.Gray.gray50} />
            </View>
          </TouchableOpacity> */}
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

  title: {
    ...BODY_1_BOLD,
    color: Color.Gray.gray50,
  },
});

export default RestaurantHeader;
