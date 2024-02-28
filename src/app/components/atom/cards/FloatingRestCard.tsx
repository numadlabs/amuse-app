// Import React and other necessary libraries
import { RestaurantType } from "@/app/lib/types";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;

// Define the props for the FloatingRestaurantCard component
interface FloatingRestaurantCardProps {
  marker: RestaurantType; // Use the Restaurant interface defined earlier
  // key: string;
  onPress: () => void; // A function to handle the button press
  isClaimLoading: boolean;
}

// Define the FloatingRestaurantCard component
const FloatingRestaurantCard: React.FC<FloatingRestaurantCardProps> = ({
  marker,
  // key,
  onPress,
  isClaimLoading,
}) => {
  // console.log("🚀 ~ marker:", key);
  return (
    <View style={styles.card}>
      {/* <Image
        source={marker.image} // Assuming the marker object has an image property
        style={styles.cardImage}
        resizeMode="cover"
      /> */}
      <View style={styles.textContent}>
        <Text numberOfLines={1} style={styles.cardtitle}>
          {marker.name}
        </Text>
        <Text numberOfLines={1} style={styles.cardDescription}>
          {marker.description}
        </Text>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={onPress}
            style={[
              styles.signIn,
              {
                borderColor: "#FF6347",
                borderWidth: 1,
              },
            ]}
            disabled={isClaimLoading}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#FF6347",
                },
              ]}
            >
              {isClaimLoading
                ? "Loading"
                : marker.isOwned
                ? "Owned"
                : " Add a-card"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    // shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#212121",
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  signIn: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

// Export the component
export default FloatingRestaurantCard;
