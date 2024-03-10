// Import React and other necessary libraries
import Color from "@/app/constants/Color";
import { RestaurantType } from "@/app/lib/types";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.80;

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
  const opensAt = new Date(marker.opensAt);
  const closesAt = new Date(marker.closesAt);
  const currentTime = new Date();

  const isOpen =
    currentTime.getTime() >= opensAt.getTime() &&
    currentTime.getTime() <= closesAt.getTime();

  return (
    <View style={styles.card}>
      <Image
        source={{uri: marker.nftImageUrl as string}}
        style={styles.cardImage}
        // resizeMode="cover"
      />
      <View style={styles.textContent}>
        <View>
          <Text numberOfLines={1} style={styles.cardtitle}>
            {marker.name}
          </Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {marker.category}
          </Text>
        </View>

        <View style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isOpen ? `${Color.System.systemError}` : `${Color.System.systemSuccess}` },
              ]}
            />
            <Text style={{ color: isOpen ? `${Color.System.systemError}` : `${Color.System.systemSuccess}` }}>
              {isOpen ? "Closed" : "Open"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onPress}
            style={[
              styles.signIn,
              {
                borderColor: "#000",
                borderWidth: 1,
                backgroundColor: "#000",
                width: 96,
                height: 32,
                borderRadius: 48,
              },
            ]}
            disabled={isClaimLoading}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#FFF",
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
    backgroundColor: Color.base.White,
    justifyContent: "space-between",
    marginHorizontal: 10,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 16,
  },

  cardImage: {
    width: 92,
    height: 92,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 8
  },

  textContent: {
    flex: 1,
    gap: 30,
    // backgroundColor: "red",
  },

  button: {
    // backgroundColor: "#FFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  cardtitle: {
    fontSize: 18,

    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#656565",
  },
  signIn: {
    padding: 5,

    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Export the component
export default FloatingRestaurantCard;
