import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import Color from "../constants/Color";
import Close from "../components/icons/Close";
import PowerUpCard from "../components/atom/cards/PowerUpCard";
import DetailsSheet from "../components/sections/DetailsSheet";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { height } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUserPowerUps, getUserCard } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import PowerUpLogo from "../components/icons/PowerUpLogo";
import { userKeys } from "../lib/service/keysHelper";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const Restaurant = () => {
  const offset = useSharedValue(0);
  const { currentLocation } = useLocationStore();
  const [showPerks, setShowPerks] = useState(true);

  const {
    id,
    name,
    location,
    category,
    about,
    benefits,
    artistInfo,
    membership,
    instruction,
    logo,
    taps,
  } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));
  const [isOpen, setOpen] = useState(false);
  const toggleBottomSheet = () => {
    setOpen(!isOpen);
    offset.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeY;
    })
    .onFinalize(() => {
      if (offset.value < height / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(height / 2, {}, () => {
          runOnJS(toggleBottomSheet)();
        });
      }
    });

  const backgroundColor = showPerks ? Color.base.White : Color.Gray.gray50;
  const { data: perks = [], isLoading } = useQuery({
    queryKey: userKeys.perks,
    queryFn: () => {
      return getUserPowerUps(id);
    },
    enabled: !!currentLocation,
  });
  const toggleView = (view) => {
    setShowPerks(view);
  };

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: Color.base.White, flex: 1 }}
    >
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            router.back();
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {loading ? ( // Conditionally render loading indicator
          <View style={{ backgroundColor: "red", width: "100%" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <ImageBackground
            source={{
              uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${logo}` as string,
            }}
            style={styles.textImageContainer}
          >
            <View style={styles.overlay} />
            <BlurView intensity={24} style={styles.textImageContainer1}>
              <View style={styles.textContainer}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: Color.base.White,
                  }}
                >
                  {name}
                </Text>
                <Text style={{ fontSize: 12, color: Color.Gray.gray50 }}>
                  {category}
                </Text>
              </View>
              <Image
                style={styles.image}
                source={{
                  uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${logo}` as string,
                }}
              />
              <View style={styles.bottomDetailsContainer}>
                <View style={styles.bottomDetails1}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.Gray.gray50,
                      fontWeight: "bold",
                    }}
                  >
                    #267473
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.Gray.gray50,
                      fontWeight: "bold",
                    }}
                  >
                    MEMBERSHIP
                  </Text>
                </View>
                <View style={styles.bottomDetails}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      color: Color.base.White,
                    }}
                  >
                    {taps}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Color.Gray.gray50,
                      fontWeight: "bold",
                    }}
                  >
                    Check-ins
                  </Text>
                </View>
              </View>
            </BlurView>
          </ImageBackground>
        )}
        <View style={styles.attrContainer}>
          <View
            style={{
              backgroundColor: Color.Gray.gray50,
              justifyContent: "space-between",
              borderRadius: 48,
              height: 48,
              width: "100%",
              flexDirection: "row",
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleView(true)}
              style={{
                backgroundColor: backgroundColor,
                alignItems: "center",
                borderRadius: 48,
                justifyContent: "center",
                width: "48%",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: Color.Gray.gray600,
                  fontWeight: "bold",
                }}
              >
                Perks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleView(false)}>
              <View
                style={{
                  backgroundColor: showPerks
                    ? Color.Gray.gray50
                    : Color.base.White,
                  flex: 1,
                  flexGrow: 1,
                  alignItems: "center",
                  paddingHorizontal: 60,
                  justifyContent: "center",
                  borderRadius: 48,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: Color.Gray.gray600,
                    fontWeight: "bold",
                  }}
                >
                  Details
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexGrow: 1, marginTop: 32 }}>
            {isLoading ? (
              <ActivityIndicator color={Color.Gray.gray600} />
            ) : showPerks ? (
              <View style={styles.powerUpGrid}>
                {perks && perks.length > 0 ? (
                  perks.map((item, index) => (
                    <PowerUpCard
                      key={index}
                      title={item.name}
                      onPress={() =>
                        router.push({
                          pathname: `/PowerUp`,
                          params: {
                            name: item.name,
                            id: item.id,
                          },
                        })
                      }
                    />
                  ))
                ) : (
                  <View
                    style={{
                      backgroundColor: Color.Gray.gray50,
                      flex: 1,
                      justifyContent: "center",
                      gap: 16,
                      padding: 24,
                      borderRadius: 16,
                    }}
                  >
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <PowerUpLogo />
                    </View>

                    <Text
                      style={{
                        textAlign: "center",
                        lineHeight: 16,
                        fontSize: 12,
                        fontWeight: "400",
                      }}
                    >
                      You haven’t got any perks yet.{"\n"} Every 10th check-in,
                      you will receive perks.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View
                style={{ flex: 1, flexGrow: 1, marginBottom: 150, padding: 8 }}
              >
                <DetailsSheet
                  benefits={benefits}
                  locations={location}
                  memberships={membership}
                  about={about}
                  instruction={instruction}
                  artistInfo={artistInfo}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    marginTop: 12,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 33, 0.32)",
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  powerUpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 15,
  },
  textImageContainer: {
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  bottomDetails: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
  bottomDetails1: {
    flexDirection: "column",
    gap: 4,
  },
  bottomDetailsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray600,
    fontSize: 16,
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});
