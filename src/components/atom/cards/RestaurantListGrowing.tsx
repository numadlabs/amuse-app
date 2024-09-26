import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import Color from "../../../constants/Color";
import { router } from "expo-router";
import { width } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { BODY_2_BOLD, CAPTION_1_BOLD, CAPTION_1_REGULAR } from "@/constants/typography";
import { ArrowRight2 } from "iconsax-react-native";

const RestaurantListGrowing = () => {

  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        style={styles.gradientContainer}
      >
        <View style={styles.contentContainer}>
          <View style={styles.textAndButtonContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.topTitle}>Restaurant List Growing!</Text>
              <Text style={styles.bottomTitle}>More restaurants are coming soon</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("@/public/images/RestaurantListGrow.png")}
              style={styles.image}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default RestaurantListGrowing;

const styles = StyleSheet.create({
container: {
  borderRadius: 20,
  borderWidth: 1,
  borderColor: Color.Gray.gray400,
  height: "90%",
  overflow: "hidden",
},
gradientContainer: {
  width: width - 32,
  paddingHorizontal: 16,
  paddingVertical: 16,
  borderRadius: 20,
},
contentContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
textAndButtonContainer: {
  flex: 1,
  marginRight: 16,
},
textContainer: {
  gap: 4,
  marginBottom: 16,
},
topTitle: {
  ...BODY_2_BOLD,
  color: Color.base.White,
},
bottomTitle: {
  ...CAPTION_1_REGULAR,
  color: Color.Gray.gray100,
},
visitButton: {
  borderColor: Color.Gray.gray400,
  borderWidth: 1,
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 48,
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
  marginBottom: 8,

},
visitButtonText: {
  ...CAPTION_1_BOLD,
  color: Color.base.White,
  marginRight: 8,
},
imageContainer: {
  justifyContent: "flex-start",
  alignItems: "center",
  marginBottom: 60,
  padding: 16,
},
image: {
  position: "absolute",
  height: 100,
  width: 88,
},
});