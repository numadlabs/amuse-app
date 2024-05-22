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

const MyQrModal = () => {
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
    // const getCameraPermissions = async () => {
    //   const { status } = await Camera.requestCameraPermissionsAsync();
    //   setHasPermission(status === "granted");
    // };
    // getCameraPermissions();
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
          params: { cardId: cardId as any }
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

  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  return (
    <>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: Color.Gray.gray600, alignItems: 'center' }}>
          {/* <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417"],
                }}
                style={StyleSheet.absoluteFillObject}
                flash={flashMode == true ? "on" : "off"}
              // flash="on"
              /> */}
          {/* Overlay for guiding user to place QR code within scan area */}


          {/* Button for toggling flashlight */}
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 100, gap: 32 }}>
              <Text style={{ fontSize: 20, lineHeight: 24, color: Color.base.White, fontWeight: '700' }}>My QR Code</Text>
              <TouchableOpacity
                onPress={handleScanButtonPress}
              >
                <LinearGradient
                  colors={[Color.Brand.card.start, Color.Brand.card.end]}
                  style={[styles.button]}
                >
                  <Image source={require('../../public/images/pqr.png')} style={{ width: width - 128, height: width - 128 }} />
                </LinearGradient>
              </TouchableOpacity>
              <View style={{ marginHorizontal: 32 }}>
                <Text style={{ textAlign: 'center', fontSize: 14, lineHeight: 18, color: Color.Gray.gray100 }}>Show this to your waiter to check-in.{"\n"} Do not worry, they are pros.</Text>
              </View>
            </View>
          )
          }

          {/* Button for closing the modal */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: Color.Gray.gray400, width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }]}
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