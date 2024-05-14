import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  runOnJS,
  ReduceMotion,
  FadeIn,
} from "react-native-reanimated";
import {
  TickCircle,
  Location,
  TicketExpired,
  User,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-react-native";
import Color from "@/app/constants/Color";
import Tick from "../icons/Tick";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { height } from "@/app/lib/utils";
import * as Linking from "expo-linking";
import { RestaurantType } from "@/app/lib/types";
import TimeAccordion from "../ui/TimeAccordion";

interface BottomSheetProps {
  benefits: string | string[];
  locations: string | string[];
  memberships: string | string[];
  about: string | string[];
  latitude: string;
  description: string;
  longitude: string;
  instruction: string | string[];
  artistInfo: string | string[];
  marker: RestaurantType;
}

const DetailsSheet: React.FC<BottomSheetProps> = ({
  benefits,
  locations,
  memberships,
  about,
  instruction,
  artistInfo,
  latitude,
  description,
  longitude,
  marker,
}) => {
  const handleLocationPress = () => {
    if (latitude && longitude) {
      const mapURL = `https://maps.google.com/?q=${latitude},${longitude}`;
      Linking.openURL(mapURL);
    } else {
      console.warn("Latitude and longitude are not available");
    }
  };
  const [open, setOpen] = useState(false);

  const handlePress = () => {
    setOpen(!open);
  };
  const currentTime = new Date();
  const opensAt = new Date(marker?.opensAt);
  const closesAt = new Date(marker?.closesAt);
  const isOpen =
    currentTime.getTime() >= opensAt?.getTime() &&
    currentTime.getTime() <= closesAt?.getTime();

  const data = [
    {
      title: "Monday",
      text: "12:00 - 23:00",
    },
    {
      title: "Tuesday",
      text: "12:00 - 23:00",
    },
    {
      title: "Wednesday",
      text: "12:00 - 23:00",
    },
    {
      title: "Thursday",
      text: "12:00 - 23:00",
    },
    {
      title: "Friday",
      text: "12:00 - 23:00",
    },
    {
      title: "Saturday",
      text: "12:00 - 23:00",
    },
    {
      title: "Sunday",
      text: "Closed",
    },
  ];

  return (
    <View style={[styles.bottomSheet]}>
      <View style={styles.content}>
        <Text
          style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White }}
        >
          Rewards
        </Text>
        <View style={{ marginVertical: 16 }}>
          <View style={styles.attribute}>
            <Tick size={24} color={Color.Gray.gray100} />
            <Text style={styles.attributeText}>{benefits}</Text>
          </View>
        </View>
        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: Color.base.White,
            }}
          >
            Locations
          </Text>
          <View style={{ width: "90%" }}>
            <View style={styles.attribute}>
              <Location color={Color.Gray.gray100} />
              <TouchableOpacity onPress={handleLocationPress}>
                <Text numberOfLines={2} style={styles.attributeLocText}>
                  {locations}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Color.base.White,
              }}
            >
              About
            </Text>
            <View>
              <Text style={styles.attributeText}>{description}</Text>
            </View>
          </View>

          <View style={{ gap: 16, flexDirection: "column" }}>
            <View style={{ gap: 16, flexDirection: "column" }}>
              <TouchableOpacity
                onPress={handlePress}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: '100%'
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: Color.base.White,
                    }}
                  >
                    Timetable
                  </Text>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                    {open ? (
                      <ArrowUp2 size={20} color={Color.base.White} />
                    ) : (
                      <ArrowDown2 size={20} color={Color.base.White} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              <Animated.View entering={FadeIn}>
                {open && (
                  <Animated.View>
                    <View style={{ flexDirection: 'column', gap: 16 }}>
                      {data.map((item, index) => (
                        <TimeAccordion
                          time={item.text}
                          title={item.title}
                          key={index}
                        />
                      ))}
                    </View>
                  </Animated.View>
                )}
              </Animated.View>
            </View>
          </View>

          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Color.base.White,
              }}
            >
              How to earn
            </Text>
            <View>
              <Text style={styles.attributeText}>{instruction}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  bottomSheet: {
    backgroundColor: Color.Gray.gray600,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    zIndex: 999,
    height: height / 5,
  },
  content: {
    backgroundColor: Color.Gray.gray600
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: Color.Gray.gray600,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    color: Color.Gray.gray400,
    fontWeight: "normal",
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonText: {
    color: Color.System.systemSuccess,
    fontSize: 18,
    fontWeight: "bold",
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray50,
    fontSize: 16,
    width: "95%",
  },

  attributeLocText: {
    color: Color.System.systemInformation,
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});

export default DetailsSheet;
