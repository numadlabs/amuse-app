import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Color from "@/constants/Color";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateTap } from "@/lib/service/mutationHelper";
import { getUserCard } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { userKeys } from "@/lib/service/keysHelper";
import { LinearGradient } from "expo-linear-gradient";
import Close from "@/components/icons/Close";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { BODY_2_REGULAR, H6 } from "@/constants/typography";
import Config from "config";

const socket = io(Config.apiUrl, { transports: ["websocket"] });
const { width } = Dimensions.get("window");
const markerSize = 250;
const halfMarkerSize = markerSize / 2;

const MyQrModal = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const [qrData, setQrdata] = useState("");
  const router = useRouter();
  const { currentLocation } = useLocationStore();
  const userId = authState.userId;
  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard();
    },
    enabled: !!currentLocation,
  });

  const handleTapScan = useCallback(
    (data) => {
      console.log("Tap scan emitted: ", data);
      const userCard = cards?.data?.cards.find(
        (card) => card.restaurantId === data?.data?.restaurantId
      );
      if (!userCard) {
        router.back();
        router.push({
          pathname: `/restaurants/${data?.data?.restaurantId}`,
        });
      }
      else {
        if (data?.isInTapLock === true) {
          router.back();
          router.push({
            pathname: `/AlreadyCheckedIn`,
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
      }
    },
    [cards, router]
  );

  // Mutation for creating a tap
  const { mutateAsync: createTapMutation } = useMutation({
    mutationFn: generateTap,
    onSuccess: async (data) => {
      try {
        setLoading(true);
        const newQrdata = data?.data?.data?.encryptedData;
        setQrdata(newQrdata);

        setLoading(false);
      } catch (error) {
        console.error("Redeem mutation failed:", error);
      }
    },
  });

  useEffect(() => {
    let isActive = true;
    setLoading(true);

    const setupSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        console.log("Connected to server");
        socket.emit("register", userId);
      };

      const onTapScan = (data) => {
        if (isActive) {
          console.log("Tap scan received:", data);
          handleTapScan(data);
        }
      };

      socket.on("connect", onConnect);
      socket.on("tap-scan", onTapScan);

      if (socket.connected) {
        onConnect();
      }

      return () => {
        socket.off("connect", onConnect);
        socket.off("tap-scan", onTapScan);
      };
    };

    const cleanupSocket = setupSocket();

    createTapMutation();

    return () => {
      isActive = false;
      cleanupSocket();
    };
  }, [userId, handleTapScan, createTapMutation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <View style={styles.content}>
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
            style={styles.qrContainer}
          >
            <QRCode
              backgroundColor="transparent"
              color={Color.base.White}
              size={width / 1.3}
              value={`data:image/png;base64,${qrData}`}
            />
            {error && (
              <Text style={{ ...BODY_2_REGULAR, color: Color.System.systemError }}>
                {error}
              </Text>
            )}
          </LinearGradient>
          {/* </TouchableOpacity> */}
          <View style={{ marginHorizontal: 32 }}>
            <Text style={styles.instruction}>
              Show this to your waiter to check-in.{"\n"} Do not worry, they are
              pros.
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: 32,
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
  instruction: {
    ...BODY_2_REGULAR,
    textAlign: "center",
    color: Color.Gray.gray100,
    marginHorizontal: 32,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    width: width - 64,
    aspectRatio: 1,
  },
});

export default MyQrModal;
