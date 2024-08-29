import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import Color from "@/constants/Color";
import Close from "@/components/icons/Close";
import Popup from "@/components/(feedback)/Popup";
import PerkGradient from "@/components/icons/PerkGradient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePerkQr } from "@/lib/service/mutationHelper";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { BODY_2_REGULAR, H6 } from "@/constants/typography";
import Config from "config";

const { width } = Dimensions.get("window");

const socket = io(Config.apiUrl, { transports: ["websocket"] });

const PowerUp = () => {
  console.log("component rendered");
  const { authState } = useAuth();

  const userId = authState.userId;

  // const showToast = () => {
  //   setTimeout(() => {
  //     Toast.show({
  //       type: "perkToast",
  //       text1: "Perk consumed"
  //     })
  //   }, 800)
  // }
  const { id, name, restaurantId } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrdata] = useState("");
  const queryClient = useQueryClient();

  // socket.on("connect", () => {
  //   console.log("Connected to server");
  //   socket.emit("register", userId);
  // });

  // socket.on("bonus-scan", (data) => {
  //   console.log("Tapscan: ", data);
  //   if (data) {
  //     handleNavigation();
  //   }
  // });

  // socket.on("connect", () => {
  //   console.log("socket connected: ", socket.connected); // true
  // });

  const { mutateAsync: createBonusQrMutation } = useMutation({
    mutationFn: generatePerkQr,
    onError: (error) => {},
    onSuccess: (data, variables) => {
      try {
        setLoading(true);
        console.log("Successfully created");
        const newQrdata = data?.data?.data?.encryptedData;
        setQrdata(newQrdata);
        setLoading(false);
      } catch (error) {
        console.error("Bonus mutation failed:", error);
      }
    },
  });

  useEffect(() => {
    setLoading(true);
    createBonusQrMutation({
      id: id as string,
    });
  }, []);

  useEffect(() => {
    let isActive = true;

    const setupSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        console.log("Connected to server");
        socket.emit("register", userId);
      };

      const onTapScan = (data) => {
        if (isActive && data) {
          handleNavigation();
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

    createBonusQrMutation({
      id: id as string,
    });

    return () => {
      isActive = false;
      cleanupSocket();
    };
  }, [userId, createBonusQrMutation]);

  const handleNavigation = () => {
    queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    queryClient.invalidateQueries({ queryKey: userKeys.cards });
    queryClient.invalidateQueries({ queryKey: userKeys.info });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <View
        style={{
          backgroundColor: Color.Gray.gray600,
          flex: 1,
          marginTop: Platform.OS === "ios" ? -10 : 0,
        }}
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
        <View style={styles.container} key={id as string}>
          <LinearGradient
            colors={[Color.Brand.card.start, Color.Brand.card.end]}
            style={[styles.qrContainer]}
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

          <Popup
            title="Perk consumed."
            isVisible={isPopupVisible}
            onClose={handleNavigation}
          />
          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 24 }}
          >
            <View
              style={{
                padding: 12,
                backgroundColor: Color.Gray.gray400,
                borderRadius: 12,
                width: 52,
                height: 52,
              }}
            >
              <PerkGradient />
            </View>

            <View style={{ gap: 12, alignItems: "center" }}>
              <Text
                style={{
                  ...H6,
                  color: Color.base.White,
                }}
              >
                {name}
              </Text>
              <Text
                style={{
                  color: Color.Gray.gray100,
                  textAlign: "center",
                  ...BODY_2_REGULAR,
                }}
              >
                Show this to your waiter to redeem.{"\n"} Do not worry, they are
                pros.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PowerUp;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray300,
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
  container: {
    gap: 32,
    marginBottom: 50,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
