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
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { getAcard } from "../lib/service/mutationHelper";
import { restaurantKeys } from "../lib/service/keysHelper";
import Toast from "react-native-toast-message";

const Restaurant = () => {
  const { cardId, name, location, category, about, isOwned, benefits, artistInfo, expiryInfo, instruction, logo } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  console.log(cardId)
  const [isClaimLoading, setIsClaimLoading] = useState(false)
  const { authState } = useAuth()
  const queryClient = useQueryClient();

  const showToast = () => {
    Toast.show({
      type: "perkToast",
      text1: "Added membership card",
    });
  };

  const { mutateAsync: createGetAcardMutation } = useMutation({
    mutationFn: getAcard,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => { },
  });
  const handleGetAcard = async (acardId: string) => {
    console.log("🚀 ~ RestaurantMapView ~ aCardId:", acardId);
    setIsClaimLoading(true);
    if (authState.userId) {

      const data = await createGetAcardMutation({
        userId: authState.userId,
        cardId: acardId,
      });
      if (data.data.success) {
        queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
        setIsClaimLoading(false);
        const owned = data.data.userCard
        console.log(owned)
        showToast();
      }
    }
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
       
          <ImageBackground source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${logo}` as string }} style={styles.textImageContainer}>
            <View style={styles.overlay} />
            <BlurView intensity={24} style={styles.textImageContainer1}>
              <View style={styles.textContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White, }}>{name}</Text>
                <Text style={{ fontSize: 12, color: Color.Gray.gray50 }}>{category}</Text>
              </View>
              <Image
                style={styles.image}
                source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${logo}` as string }}
              />
            </BlurView>
          </ImageBackground>
        
        <View style={styles.attrContainer}>
          <View style={{ gap: 32 }}>
            <View style={{ gap: 16 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Rewards</Text>
              <View>

                <View style={styles.attribute}>
                  <Tick size={8} color={Color.Gray.gray600} />
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
                      (styles.attributeText)
                    }
                  >
                    "{location}"
                  </Text>
                </View>
              </View>
            </View>


            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              How it works
            </Text>
            <Text>
              Open your app to the homepage, scan the QR code from your waiter or hostess, and earn rewards for checking in. Activate power-ups for extra rewards.
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
        <TouchableOpacity onPress={() => {
          handleGetAcard(cardId as string)
        }}>
          <View style={styles.button1}>
            <WalletAdd color={Color.Gray.gray50} />
            <Text style={{ color: Color.Gray.gray50, fontSize: 15, fontWeight: 'bold' }}>
              {isClaimLoading
                ? "Loading"
                :  isOwned
                  ? "Owned"
                  : "Add a membership card"}
            </Text>
          </View>
        </TouchableOpacity>
        <Popup title="" isVisible={isPopupVisible} onClose={closePopup} />
      </View>
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignContent: 'center',
    justifyContent: "center",
    width: 48,
    padding: 12,
    gap: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
    flexDirection: 'row',
  },
  button1: {
    alignItems: "center",
    alignContent: 'center',
    justifyContent: "center",
    width: '100%',
    padding: 12,
    gap: 12,
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
