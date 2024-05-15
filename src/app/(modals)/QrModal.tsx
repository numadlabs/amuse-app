import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CameraView, Camera } from "expo-camera";
import Color from "../constants/Color";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateTap, redeemTap } from "../lib/service/mutationHelper";
import Popup from "../components/(feedback)/Popup";
import PowerUp from "../components/(feedback)/PowerUp";
import { getUserCard } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import { Flash } from "iconsax-react-native";
import Toast from "react-native-toast-message";
import { restaurantKeys, userKeys } from "../lib/service/keysHelper";
import { SERVER_SETTING } from "../constants/serverSettings";
import { LinearGradient } from "expo-linear-gradient";
import Close from "../components/icons/Close";
const { width, height } = Dimensions.get("window");
const markerSize = 250;
const halfMarkerSize = markerSize / 2;

const overlayAdjusting = 5;

const QrModal = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isBtcPopupVisible, setBtcPopupVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [restaurantId, setRestaurantId] = useState("")
  const [loading, setLoading] = useState(false);
  const [cardId, setCardId] = useState("")
  const [visitCount, setVisitCount] = useState(0)
  const [flashMode, setFlashMode] = useState(false);
  const [powerUp, setPowerUp] = useState("");
  const [emptyError, setEmptyError] = useState("");
  const [btcAmount, setBTCAmount] = useState("");
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const showToast = () => {
    setTimeout(function () {
      Toast.show({
        type: "perkToast",
        text1: "1$ of bitcoin added to your wallet",
      });
    }, 1500);
  };

  const toggleBtcPopup = () => {
    setBtcPopupVisible(!isBtcPopupVisible);
  };


  const closeModal = () => {
    toggleBtcPopup();
    togglePopup();
    // showToast();
  };

  const queryClient = useQueryClient();
  const closeBtcModal = () => {
    router.back();
  };
  const { currentLocation } = useLocationStore();

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
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
    setRestaurantId("7c0489fc-94fd-4c3d-95a0-8ede22f6ea28");
    setCardId("fd97915d-72a3-49e5-85dd-b9fed5c599a8")
    setVisitCount(1)
  }, []);


  const {
    data,
    error,
    status,
    mutateAsync: createTapMutation,
  } = useMutation({
    mutationFn: generateTap,
    onError: (error) => {
    },
    onSuccess: (data, variables) => {
      try {
        const resp = createRedeemMutation(data.data.data);
      } catch (error) {
        console.error("Redeem mutation failed:", error);
      }
    },
  });

  

  const { mutateAsync: createRedeemMutation } = useMutation({
    mutationFn: redeemTap,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ QrModal ~ data:", data.data.data);
      if (visitCount >= SERVER_SETTING.PERK_FREQUENCY) {
        setPowerUp(data.data.data.bonus?.name);
        queryClient.invalidateQueries({ queryKey: userKeys.perks });
      }
      setBTCAmount(data.data?.data?.increment);
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.cards });
      queryClient.invalidateQueries({ queryKey: userKeys.info });

      if (visitCount % SERVER_SETTING.PERK_FREQUENCY === null) {
        router.back()
        router.navigate({
          pathname: '/PerkScreen',
          params: {
            restaurantId: restaurantId,
            btcAmount: data.data?.data?.increment,
            powerUp: data.data?.data?.bonus?.name,
          }
        });
      }
      else {
        router.back()
        router.navigate({
          pathname: '/PerkScreen',
          params: {
            restaurantId: restaurantId,
            btcAmount: data.data?.data?.increment,
            powerUp: data.data?.data?.bonus?.name,
          }
        });
      }
    },
  });
  const userCard = cards?.data?.cards.find((card) => card.restaurantId === restaurantId);
  const handleScanButtonPress = async () => {
    try {
      setLoading(true);

      if (!userCard) {
        router.back()
        router.push({
          pathname: `/restaurants/${restaurantId}`,
          params: {cardId : cardId as any}
        })
      } else if (userCard) {
        const data = await createTapMutation(restaurantId);
      }
    } catch (error) {
      console.log("Map mutation failed:", error);
    }
  };
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function marker(
    color: string,
    size: number,
    borderLength: number,
    thickness: number = 2,
    borderRadius: number = 0
  ): JSX.Element {
    return (
      <View style={{ height: size, width: size }}>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            top: 0,
            left: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
            borderTopLeftRadius: borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            top: 0,
            right: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderRightWidth: thickness,
            borderTopRightRadius: borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            bottom: 0,
            left: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderLeftWidth: thickness,
            borderBottomLeftRadius: borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            bottom: 0,
            right: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
            borderBottomRightRadius: borderRadius,
          }}
        ></View>
      </View>
    );
  }

  return (
    <>
      {isModalVisible && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={StyleSheet.absoluteFillObject}
              flash={flashMode == true ? "on" : "off"}
            // flash="on"
            />
            {/* Overlay for guiding user to place QR code within scan area */}
            <View
              style={[
                styles.overlay,
                {
                  height: (height - markerSize) / 2 - overlayAdjusting,
                  width: width,
                },
              ]}
            />
            <View
              style={[
                styles.overlay,
                {
                  height: (height - markerSize) / 2,
                  marginTop: (height + markerSize) / 2 - overlayAdjusting * 3,
                  width: width,
                },
              ]}
            />

            <View
              style={[
                styles.overlay,
                {
                  width: (width - markerSize) / 2,
                  height: markerSize - overlayAdjusting * 2,
                  marginTop: (height - markerSize) / 2 - overlayAdjusting,
                },
              ]}
            />
            <View
              style={[
                styles.overlay,
                {
                  width: (width - markerSize) / 2,
                  height: markerSize - overlayAdjusting * 2,
                  marginLeft: (width + markerSize) / 2,
                  marginTop: (height - markerSize) / 2 - overlayAdjusting,
                },
              ]}
            />
            {/* Marker for indicating QR code scanning area */}
            <View style={styles.markerContainer}>
              {marker("white", markerSize, 40, 4, 12)}
            </View>

            {/* Button for toggling flashlight */}
            <TouchableOpacity
              onPress={handleScanButtonPress}
              style={styles.flashButton}
              disabled={loading || isButtonPressed}
              onPressIn={() => setIsButtonPressed(true)}
              onPressOut={() => setIsButtonPressed(false)}
            >
              <LinearGradient
                colors={[Color.Brand.main.start, Color.Brand.main.end]}
                style={[styles.button]}
              >
                {loading ? (
                  <ActivityIndicator color={Color.Gray.gray600} />
                ) : (
                  <Flash color={Color.base.White} />
                )}

              </LinearGradient>
            </TouchableOpacity>

            {/* Button for closing the modal */}
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => {
                router.back();
              }}
            >
              <Close />
            </TouchableOpacity>
          </View>
          {visitCount >= SERVER_SETTING.PERK_FREQUENCY ? (
            <PowerUp
              title="Congrats!"
              powerUpTitle={powerUp}
              subText="You received a power-up."
              isVisible={isPopupVisible}
              onClose={closeModal}
            />
          ) : null}
          <Popup
            isVisible={isBtcPopupVisible}
            onClose={closeBtcModal}
            title={btcAmount}
          />
        </View>
      )}
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
    width: 48,
    height: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray400,
  },
  closeButton: {
    position: "absolute",
    right: "0%",
    top: "0%",
    margin: 16,
  },
  flashButton: {
    position: "absolute",
    marginHorizontal:"44%",
    bottom: "0%",
    marginRight: 16,
    marginBottom: 100,
  },
});

export default QrModal;