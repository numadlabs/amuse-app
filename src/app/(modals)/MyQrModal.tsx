import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Color from "@/constants/Color";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateTap } from "@/lib/service/mutationHelper";
import { getUserCard } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { userKeys } from "@/lib/service/keysHelper";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { LinearGradient } from "expo-linear-gradient";
import Close from "@/components/icons/Close";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { BODY_2_REGULAR, H6 } from "@/constants/typography";

const { width } = Dimensions.get("window");
const markerSize = 250;
const halfMarkerSize = markerSize / 2;

const MyQrModal = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isBtcPopupVisible, setBtcPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const [qrData, setQrdata] = useState("");

  const socket = io(SERVER_SETTING.API_URL, { transports: ["websocket"] });
  const userId = authState.userId;

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("register", userId);
  });

  socket.on("tap-scan", (data) => {
    console.log("Tap scan emitted: ", data);
    const userCard = cards?.data?.cards.find(
      (card) => card.restaurantId === data?.data?.restaurantId
    );
    if (!userCard) {
      router.back();
      router.push({
        pathname: `/restaurants/${data?.restaurantId}`,
        //TODO params test hiigeerei
        // params: { cardId: cardId as any },
      });
    } else {
      router.back();
      router.navigate({
        pathname: "/PerkScreen",
        params: {
          restaurantId: data?.data?.restaurantId,
          btcAmount: data.data?.increment,
          powerUp: data.data?.bonus?.name,
        },
      });
    }
  });

  socket.on("connect", () => {
    console.log("socket connected: ", socket.connected); // true
  });

  const { currentLocation } = useLocationStore();

  // Fetch user cards based on current location
  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });

  const router = useRouter();

  // Set default values when component mounts
  useEffect(() => {
    setLoading(true);
    createTapMutation();
  }, []);

  // Mutation for creating a tap
  const { mutateAsync: createTapMutation } = useMutation({
    mutationFn: generateTap,
    onSuccess: async (data) => {
      try {
        setLoading(true);
        const newQrdata = data?.data?.data?.encryptedData;
        setQrdata(newQrdata);

        // Log the new QR data immediately after setting it
        console.log("QR Data from mutation:", qrData);
        setLoading(false);
      } catch (error) {
        console.error("Redeem mutation failed:", error);
      }
    },
  });

  return (
    <>
      <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Color.Gray.gray600,
              alignItems: "center",
            }}
          >
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator />
              </View>
            ) : (
              <View style={{ alignItems: "center", marginTop: 100, gap: 32 }}>
                <Text
                  style={{
                    ...H6,
                    color: Color.base.White,
                  }}
                >
                  My QR Code
                </Text>
                {/* <TouchableOpacity onPress={handleScanButtonPress}> */}
                <LinearGradient
                  colors={[Color.Brand.card.start, Color.Brand.card.end]}
                  style={[styles.button]}
                >
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <QRCode
                      backgroundColor="transparent"
                      color={Color.base.White}
                      size={width / 1.3}
                      value={`data:image/png;base64,${qrData}`}
                    />
                  )}
                </LinearGradient>
                {/* </TouchableOpacity> */}
                <View style={{ marginHorizontal: 32 }}>
                  <Text
                    style={{
                      ...BODY_2_REGULAR,
                      textAlign: "center",
                      color: Color.Gray.gray100,
                    }}
                  >
                    Show this to your waiter to check-in.{"\n"} Do not worry,
                    they are pros.
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: Color.Gray.gray400,
                  width: 48,
                  height: 48,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                },
              ]}
              onPress={() => {
                router.back();
              }}
            >
              <Close />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  markerContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -halfMarkerSize,
    marginTop: -halfMarkerSize,
    height: markerSize,
    width: markerSize,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    width: width - 64,
    aspectRatio: 1,
  },
  closeButton: {
    position: "absolute",
    right: "0%",
    top: "0%",
    margin: 16,
  },
});

export default MyQrModal;
