import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CameraView, Camera } from "expo-camera/next";
import Color from "../constants/Color";
import { useRouter } from "expo-router";
import { useMutation } from "react-query";
import { generateTap, redeemTap } from "../lib/service/mutationHelper";

const { width, height } = Dimensions.get("window");

const markerSize = 250;
const halfMarkerSize = markerSize / 2;

const overlayAdjusting = 5;

const QrModal = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [encryptedTap, setEncryptedTap] = useState("");
  console.log("🚀 ~ QrModal ~ encryptedTap:", encryptedTap);
  const router = useRouter();
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const {
    data,
    error,
    isLoading,
    status,
    mutateAsync: createMapMutation,
  } = useMutation({
    mutationFn: generateTap,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ QrModal ~ data:", data);
      createRedeemMutation(data.data.data);
      setEncryptedTap(data.data.data);
    },
  });
  const { mutateAsync: createRedeemMutation } = useMutation({
    mutationFn: redeemTap,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ QrModal ~ data:", data);
    },
  });

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

  const overlayStyles = (
    overlayWidth,
    overlayHeight,
    marginTop = 0,
    marginLeft = 0
  ) => ({
    ...styles.overlay,
    width: overlayWidth,
    height: overlayHeight,
    marginTop,
    marginLeft,
  });

  console.log(overlayStyles(width, (height - markerSize) / 2));

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View style={styles.markerContainer}>
          {marker("white", markerSize, 60, 4, 12)}

          {/* <TouchableOpacity
            style={[styles.button, styles.flashButton]}
            onPress={() => {
              createMapMutation("7fad6e44-9f29-4dea-9196-666895710f12");
            }}
          >
            <Text>Test tap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.flashButton]}
            onPress={() => {
              createRedeemMutation(encryptedTap);
            }}
          >
            <Text>Test redeem</Text>
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.flashButton]}
          // onPress={() => {
          //   setFlashMode(!flashMode);
          // }}
          onPress={() => {
            createMapMutation("0d6145c7-d83c-45b3-90cb-479e21ebde6b");
          }}
        >
          <Text>Scan</Text>
          {/* <Image source={require("@/public/icons/flash.png")} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            router.back();
          }}
        >
          <Image source={require("@/public/icons/close.png")} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // borderRadius: 20,
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
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
  },
  closeButton: {
    position: "absolute",
    right: "0%",
    top: "0%",
    marginTop: 4,
    marginRight: 16,
  },
  flashButton: {
    position: "absolute",
    right: "38%",
    bottom: "0%",
    marginRight: 16,
    marginBottom: 100,
  },
});

export default QrModal;
