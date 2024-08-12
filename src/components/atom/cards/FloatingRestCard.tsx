// Import React and other necessary libraries
import Color from "@/constants/Color";
import { RestaurantType } from "@/lib/types";
import { Reserve, Wallet } from "iconsax-react-native";
import moment from "moment";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../ui/Button";
import { WalletAdd1 } from "iconsax-react-native";
import { SERVER_SETTING } from "@/constants/serverSettings";
import {
  BODY_1_MEDIUM,
  BODY_2_REGULAR,
  BUTTON_32,
  CAPTION_1_REGULAR,
} from "@/constants/typography";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.83;

interface FloatingRestaurantCardProps {
  marker: RestaurantType;
  // key: string;
  onPress: () => void;
}

const FloatingRestaurantCard: React.FC<FloatingRestaurantCardProps> = ({
  marker,
  // key,
  onPress,
}) => {
  // Convert opensAt and closesAt strings to Date objects
  const currentTime = moment();

  // Parse opensAt and closesAt strings using moment
  const opensAt = moment(marker.opensAt, "HH:mm");
  let closesAt = moment(marker.closesAt, "HH:mm");

  // Adjust closesAt if it's before or equal to opensAt to consider the next day
  if (closesAt.isSameOrBefore(opensAt)) {
    closesAt = closesAt.add(1, "day");
  }

  const isOpen = currentTime.isBetween(opensAt, closesAt, null, "[]");

  // console.log(isOpen, opensAt, closesAt);
  return (
    <LinearGradient
      colors={[Color.Brand.card.start, Color.Brand.card.end]}
      style={styles.card}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={24}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            gap: 16,
          }}
        >
          <Image
            source={{
              uri: `${SERVER_SETTING.CDN_LINK}${marker.logo}` as string,
            }}
            style={styles.cardImage}
            // resizeMode="cover"
          />
          <View style={styles.textContent}>
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.cardtitle}
              >
                {marker.name}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {marker.category}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "80%",
                alignItems: "center",
                ...(marker.isOwned
                  ? { gap: 12 }
                  : { justifyContent: "space-between" }),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: marker.isOpen
                        ? Color.System.systemSuccess
                        : Color.System.systemError,
                    },
                  ]}
                />
                <Text
                  style={{
                    color: marker.isOpen
                      ? Color.System.systemSuccess
                      : Color.System.systemError,
                  }}
                >
                  {marker.isOpen ? "Open" : "Closed"}
                </Text>
              </View>
              {marker.isOwned ? (
                <View
                  style={{
                    width: 1,
                    height: 14,
                    backgroundColor: Color.Gray.gray50,
                  }}
                />
              ) : (
                ""
              )}
              {marker.isOwned ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Reserve color={Color.Gray.gray100} size={16} />
                  <Text style={{ color: Color.Gray.gray50 }}>
                    {marker.visitCount === null ? 0 : marker.visitCount}{" "}
                    Check-ins
                  </Text>
                </View>
              ) : (
                <Button
                  variant="secondary"
                  onPress={onPress}
                  size="small"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderColor: Color.Gray.gray50,
                  }}
                >
                  <Text
                    style={{
                      ...BUTTON_32,
                      color: Color.Gray.gray50,
                    }}
                  >
                    Add
                  </Text>
                </Button>
              )}
            </View>
          </View>
        </BlurView>
      ) : (
        <BlurView
          intensity={8}
          experimentalBlurMethod="dimezisBlurView"
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            gap: 16,
          }}
        >
          <Image
            source={{
              uri: `${SERVER_SETTING.CDN_LINK}${marker.logo}` as string,
            }}
            style={styles.cardImage}
            // resizeMode="cover"
          />
          <View style={styles.textContent}>
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.cardtitle}
              >
                {marker.name}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {marker.category}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "80%",
                alignItems: "center",
                ...(marker.isOwned
                  ? { gap: 12 }
                  : { justifyContent: "space-between" }),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: marker.isOpen
                        ? Color.System.systemSuccess
                        : Color.System.systemError,
                    },
                  ]}
                />
                <Text
                  style={{
                    color: marker.isOpen
                      ? Color.System.systemSuccess
                      : Color.System.systemError,
                  }}
                >
                  {marker.isOpen ? "Open" : "Closed"}
                </Text>
              </View>
              {marker.isOwned ? (
                <View
                  style={{
                    width: 1,
                    height: 14,
                    backgroundColor: Color.Gray.gray50,
                  }}
                />
              ) : (
                ""
              )}
              {marker.isOwned ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Reserve color={Color.Gray.gray100} size={16} />
                  <Text
                    style={{ ...CAPTION_1_REGULAR, color: Color.Gray.gray50 }}
                  >
                    {marker.visitCount === null ? 0 : marker.visitCount}{" "}
                    Check-ins
                  </Text>
                </View>
              ) : (
                <Button
                  variant="secondary"
                  onPress={onPress}
                  size="small"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    paddingHorizontal: 24,
                    borderWidth: 1,
                    borderColor: Color.Gray.gray50,
                  }}
                >
                  <Text
                    style={{
                      ...BUTTON_32,
                      color: Color.Gray.gray50,
                    }}
                  >
                    Add
                  </Text>
                </Button>
              )}
            </View>
          </View>
        </BlurView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "space-between",
    marginRight: 10,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: Color.Gray.gray400,
  },
  cardImage: {
    width: 92,
    height: 92,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 12,
  },

  textContent: {
    height: 92,
    justifyContent: "space-between",
  },

  button: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  cardtitle: {
    color: Color.base.White,
    ...BODY_1_MEDIUM,
  },
  cardDescription: {
    ...BODY_2_REGULAR,
    color: Color.Gray.gray100,
  },
  signIn: {
    padding: 5,

    alignItems: "center",
    borderRadius: 3,
  },
});
export default FloatingRestaurantCard;
