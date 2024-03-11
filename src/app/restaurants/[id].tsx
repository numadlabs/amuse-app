import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Location, TicketExpired, User, WalletAdd } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from 'expo-blur';
import Popup from "../components/(feedback)/Popup";
import Tick from "../components/icons/Tick";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import Close from "../components/icons/Close";

const Restaurant = () => {
  const { name, location, category, about, isOwned, benefits, artistInfo, expiryInfo, instruction, nftImageUrl } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false)

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    router.back();
  };

  return (
    <View style={{ backgroundColor: Color.base.White, flex: 1 }}>
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
          <View style={{backgroundColor:'red', width:'100%'}}>
            <ActivityIndicator/>
          </View>
        ) : (
        <ImageBackground source={{uri: nftImageUrl as string}} style={styles.textImageContainer}>
             <View style={styles.overlay} />
          <BlurView intensity={24} style={styles.textImageContainer1}>
            <View style={styles.textContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White, }}>{name}</Text>
              <Text style={{ fontSize: 12, color: Color.Gray.gray50 }}>{category}</Text>
            </View>
            <Image
              style={styles.image}
              source={{uri: nftImageUrl as string}}
            />
          </BlurView>
        </ImageBackground>
        )}
        <View style={styles.attrContainer}>
          <View style={{ gap: 32 }}>
            <View style={{ gap: 16 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Benefits</Text>
              <View>

                <View style={styles.attribute}>
                  <Tick />
                  <Text style={styles.attributeText}>
                    {benefits}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 16 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Locations
              </Text>
              <View>
                <View style={styles.attribute}>
                  <Location color={Color.Gray.gray600} />
                  <Text
                    style={
                      (styles.attributeText,
                        { textDecorationLine: "underline" })
                    }
                  >
                    "{location}"
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Memberships
            </Text>
            <View style={styles.membershipContainer}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <TicketExpired color={Color.Gray.gray600} />
                <Text>Expiry</Text>
              </View>
              <View>
                <Text>{expiryInfo} / free to renew</Text>
              </View>
            </View>
            <View //this is divider
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Color.Gray.gray100,
              }}
            />
            <View style={styles.membershipContainer}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <User color={Color.Gray.gray600} />
                <Text>Artist</Text>
              </View>

              <View>
                <Text>{artistInfo}</Text>
              </View>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>About</Text>
            <Text>{about}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              How it works
            </Text>
            <Text>
              {instruction}
            </Text>
            <View style={styles.imageContainer}>
              <Image
                source={require("@/public/images/qr.png")}
                style={{ width: "100%", height: "100%", borderRadius: 32 }}
              ></Image>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity  onPress={() => {
            if (router.canGoBack()) {
              openPopup();
            } else {

            }
          }}>
          <View style={styles.button1}>
          <WalletAdd color={Color.Gray.gray50} />
            <Text style={{color:  Color.Gray.gray50, fontSize: 15, fontWeight:'bold'}}>
            {isOwned === "false" ? "Add A-card" : "Owned"}
            </Text>
          </View>
        </TouchableOpacity>
        <Popup isVisible={isPopupVisible} onClose={closePopup} />
      </View>
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignContent:'center',
    justifyContent: "center",
    width: 48,
    padding: 12,
    gap:12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
    flexDirection: 'row',
  },
  button1: {
    alignItems: "center",
    alignContent:'center',
    justifyContent: "center",
    width: '100%',
    padding: 12,
    gap:12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray600,
    flexDirection: 'row',
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 80,
  },
  closeButton: {
    marginTop: 12
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  container: {
    marginTop: 16,

    paddingHorizontal: 16,
    flex: 1,
  },
  textImageContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,

  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33, 33, 33, 0.32)',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
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
