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
  
  const DiscoverFloatRestCard = ({ onPress }) => {
    const handleNavigation = () => {
      router.push("https://www.fat-cat.cz/");
    };
  
    return (
      <TouchableOpacity style={styles.container} onPress={handleNavigation}>
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={styles.gradientContainer}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textAndButtonContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.topTitle}>Discover the Fat Cat</Text>
                <Text style={styles.bottomTitle}>Explore more at Fat Cat's official website</Text>
              </View>
              <TouchableOpacity style={styles.visitButton} onPress={handleNavigation}>
                <Text style={styles.visitButtonText}>Visit</Text>
                <ArrowRight2 size={16} color="white"/>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require("@/public/images/Cat.png")}
                style={styles.image}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  export default DiscoverFloatRestCard;
  
  const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    height: "90%",
    width: width - 32,
    overflow: "hidden",
  },
  gradientContainer: {
    flex:1,
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
    marginRight: 24,
    marginBottom: -8,
    padding: 16,
  },
  image: {
    position: "absolute",
    height: 80,
    width: 116,
  },
});