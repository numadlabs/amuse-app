import Color from "@/app/constants/Color";
import { RestaurantType } from "@/app/lib/types";
import { Reserve } from "iconsax-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Restaurant desc endpoint deeree nemeh

interface OwnedAcardsProp {
  marker: RestaurantType;
  onPress: () => void;
}
const OwnedAcards: React.FC<OwnedAcardsProp> = ({ marker, onPress }) => {
  const opensAt = new Date(marker.opensAt);
  const closesAt = new Date(marker.closesAt);
  const currentTime = new Date();

  const isOpen =
    currentTime.getTime() >= opensAt.getTime() &&
    currentTime.getTime() <= closesAt.getTime();
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Image
            source={{
              uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${marker.logo}` as string,
            }}
            style={styles.image}
          />
          <View style={{ gap: 28 }}>
            <View style={{ gap: 4 }}>
              <View style={{ width: "80%" }}>
                <Text style={styles.title}>{marker.name}</Text>
              </View>
              <Text style={styles.category}>{marker.category}</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isOpen
                        ? `${Color.System.systemError}`
                        : `${Color.System.systemSuccess}`,
                    },
                  ]}
                />
                <Text
                  style={{
                    color: isOpen
                      ? `${Color.System.systemError}`
                      : `${Color.System.systemSuccess}`,
                  }}
                >
                  {isOpen ? "Closed" : "Open"}
                </Text>
              </View>

              <View
                style={{
                  width: 1,
                  height: 14,
                  backgroundColor: Color.Gray.gray50,
                }}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Reserve color={Color.Gray.gray100} size={16} />
                <Text style={{ color: Color.Gray.gray50 }}>{marker.visitCount} Check-ins</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OwnedAcards;

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: "row",
    padding: 12,
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  image: {
    borderRadius: 8,
    width: 92,
    height: 92,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Color.base.White,
  },
  category: {
    fontSize: 12,
    color: Color.Gray.gray100,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5, // To make it a circle
    marginRight: 5, // Adjust the margin as needed
  },
});
