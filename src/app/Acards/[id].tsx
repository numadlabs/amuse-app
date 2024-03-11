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
import PowerUp from "../components/(feedback)/PowerUp";
import PowerUpCard from "../components/atom/cards/PowerUpCard";
import DetailsSheet from "../components/sections/DetailsSheet";
import BottomSheetDetails from "../components/sections/BottomDetailsSheet";

const Restaurant = () => {
  const { name, location, category, about, isOwned, benefits, artistInfo, membership, instruction, nftImageUrl, taps } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  console.log(instruction)
  const [loading, setLoading] = useState(false)
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!bottomSheetVisible);
  };

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
          <View style={{ backgroundColor: 'red', width: '100%' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <ImageBackground source={{ uri: nftImageUrl as string }} style={styles.textImageContainer}>
            <View style={styles.overlay} />
            <BlurView intensity={24} style={styles.textImageContainer1}>
              <View style={styles.textContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White, }}>{name}</Text>
                <Text style={{ fontSize: 12, color: Color.Gray.gray50 }}>{category}</Text>
              </View>
              <Image
                style={styles.image}
                source={{ uri: nftImageUrl as string }}
              />
              <View style={styles.bottomDetailsContainer}>
                <View style={styles.bottomDetails1}>
                  <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White, }}>{artistInfo}</Text>
                  <Text style={{ fontSize: 12, color: Color.Gray.gray50, fontWeight: 'bold' }}>MINT</Text>
                  <Text style={{ fontSize: 12, color: Color.Gray.gray50, fontWeight: 'bold' }}>#267473</Text>
                </View>
                <View style={styles.bottomDetails}>
                  <Text style={{ fontWeight: "bold", fontSize: 20, color: Color.base.White, }}>{taps}</Text>
                  <Text style={{ fontSize: 12, color: Color.Gray.gray50, fontWeight: 'bold' }}>VISITS</Text>
                </View>
              </View>
            </BlurView>
          </ImageBackground>
        )}
        <View style={styles.attrContainer}>
          <TouchableOpacity onPress={toggleBottomSheet}>
            <View style={{ backgroundColor: Color.Gray.gray50, justifyContent: 'center', alignItems: 'center', borderRadius: 48, paddingVertical: 12 }}>
              <Text style={{ fontSize: 15, color: Color.Gray.gray600, fontWeight: 'bold' }}>
                Details
              </Text>
            </View>
          </TouchableOpacity>
          {/* <BottomSheetDetails visible={bottomSheetVisible} onClose={toggleBottomSheet} benefits={benefits}/> */}
          <DetailsSheet isVisible={bottomSheetVisible} onClose={toggleBottomSheet} benefits={benefits} locations={location} memberships={membership} artistInfo={artistInfo} about={about} instruction={instruction}/>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 32 }}>Power ups</Text>
          <View style={styles.powerUpGrid}>
            <PowerUpCard title="Priority seating on Fridays" date="2024/01/03" onPress={() => router.navigate({
              pathname: '/PowerUp',
              params: {
                benefits
              }
            })} />
             <PowerUpCard title="Priority seating on Fridays" date="2024/01/03" onPress={() => router.navigate({
              pathname: '/PowerUp',
              params: {
                benefits
              }
            })} />
             <PowerUpCard title="Priority seating on Fridays" date="2024/01/03" onPress={() => router.navigate({
              pathname: '/PowerUp',
              params: {
                benefits
              }
            })} />
          </View>
        </View>
      </ScrollView>
    </View>
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
    marginTop: 12
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,

  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33, 33, 33, 0.32)',
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  powerUpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 15
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
  bottomDetails: {
    flexDirection: "column",
    gap: 4,
    alignItems: 'center'
  },
  bottomDetails1: {
    flexDirection: "column",
    gap: 4,
  },
  bottomDetailsContainer: {
    justifyContent: "space-between",
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    alignContent: 'center'
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
    marginBottom: 40
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
