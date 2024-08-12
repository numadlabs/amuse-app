import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Location, ArrowDown2, ArrowUp2 } from "iconsax-react-native";
import Color from "@/constants/Color";
import Tick from "../icons/Tick";
import { height } from "@/lib/utils";
import * as Linking from "expo-linking";
import { RestaurantType } from "@/lib/types";
import TimeAccordion from "../ui/TimeAccordion";
import { useQuery } from "@tanstack/react-query";
import { getTimeTable } from "@/lib/service/queryHelper";
import { BODY_1_BOLD, BODY_1_REGULAR } from "@/constants/typography";

interface BottomSheetProps {
  data: RestaurantType;
}

const DetailsSheet: React.FC<BottomSheetProps> = ({ data }) => {
  const handleLocationPress = () => {
    if (data.latitude && data.longitude) {
      const mapURL = `https://maps.google.com/?q=${data.latitude},${data.longitude}`;
      Linking.openURL(mapURL);
    } else {
      console.warn("Latitude and longitude are not available");
    }
  };

  const { data: timeTable } = useQuery({
    queryKey: ["RestaurantTimeTable"],
    queryFn: () => getTimeTable(data.id),
  });

  const getDayName = (dayNo) => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return daysOfWeek[dayNo - 1]; // dayNo is 1-based
  };

  const [open, setOpen] = useState(false);

  const handlePress = () => {
    setOpen(!open);
  };
  const currentTime = new Date();

  return (
    <View style={[styles.bottomSheet]}>
      <View style={styles.content}>
        <Text
          style={{ ...BODY_1_BOLD, color: Color.base.White }}
        >
          Rewards
        </Text>
        <View style={{ marginVertical: 16 }}>
          <View style={styles.attribute}>
            <Tick size={24} color={Color.Gray.gray100} />
            <Text style={styles.attributeText}>{data.benefits}</Text>
          </View>
        </View>
        <View style={{ gap: 16 }}>
          <Text
            style={{
              ...BODY_1_BOLD,
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
                  {data.location}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ gap: 16 }}>
            <Text
              style={{
                ...BODY_1_BOLD,
                color: Color.base.White,
              }}
            >
              About
            </Text>
            <View>
              <Text style={styles.attributeText}>{data.description}</Text>
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
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      ...BODY_1_BOLD,
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
                            backgroundColor: data?.isOpen
                              ? `${Color.System.systemSuccess}`
                              : `${Color.System.systemError}`,
                          },
                        ]}
                      />
                      <Text
                        style={{
                          color: data?.isOpen
                            ? `${Color.System.systemSuccess}`
                            : `${Color.System.systemError}`,
                        }}
                      >
                        {data?.isOpen ? "Open" : "Closed"}
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
                    <View style={{ flexDirection: "column", gap: 16 }}>
                      {timeTable?.map((item, index) => (
                        <TimeAccordion
                          opensAt={item.opensAt}
                          closesAt={item.closesAt}
                          isOffDay={item.isOffDay}
                          title={getDayName(item.dayNoOfTheWeek)}
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
                ...BODY_1_BOLD,
                color: Color.base.White,
              }}
            >
              How to earn
            </Text>
            <View>
              <Text style={styles.attributeText}>{data.instruction}</Text>
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
    height: height / 4,
  },
  content: {
    backgroundColor: Color.Gray.gray600,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray50,
    ...BODY_1_REGULAR,
    width: "95%",
  },

  attributeLocText: {
    color: Color.System.systemInformation,
    ...BODY_1_REGULAR,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});

export default DetailsSheet;
