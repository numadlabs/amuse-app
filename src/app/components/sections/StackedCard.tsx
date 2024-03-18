import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView } from "react-native";
import { EmojiHappy } from "iconsax-react-native";
import Color from "../../constants/Color";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "react-query";
import { getUserCard } from "@/app/lib/service/queryHelper";
import useLocationStore from "@/app/lib/store/userLocation";
import { BlurView } from "expo-blur";
import { RestaurantType } from "@/app/lib/types";


const StackedCard = () => {
  const { currentLocation } = useLocationStore();
  const router = useRouter();
  const queryClient = useQueryClient()

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["userCards"],
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });
  console.log("🚀 ~ StackedCard ~ cards:", cards);

  useEffect(() => {
    queryClient.invalidateQueries("userCards");
  }, []); 



  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/Acards/${restaurant.id}`,
      params: {
        name: restaurant.name,
        location: restaurant.location,
        about: restaurant.description,
        category: restaurant.category,
        isOwned: restaurant.isOwned,
        nftImageUrl: restaurant.nftImageUrl,
        taps: restaurant.visitCount,
        artistInfo: restaurant.artistInfo,
        benefits: restaurant.benefits,
        membership: restaurant.expiryInfo,
        instruction: restaurant.instruction
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {cards?.data?.cards.length === 0 ? (
        <View style={styles.container1}>
          <View style={{ justifyContent: "center" }}>
            <EmojiHappy size={48} color={Color.Gray.gray400} />
          </View>
          <Text>Collect A-cards to start earning.</Text>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add A-cards</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {cards &&
            cards?.data?.cards.slice(0, 4).map((card, index) => (
              <TouchableOpacity
                activeOpacity={0.9}
                key={card.id}
                onPress={() => handleNavigation(card)}
              >

                <ImageBackground resizeMode='cover' source={{ uri: card.nftImageUrl }}
                  style={[
                    styles.aCardContainer,
                    { marginTop: index !== 0 ? -20 : 0 },
                  ]}>
                  <View style={styles.overlay} />
                  <BlurView intensity={24} style={styles.blurContainer}>
                    <Text style={styles.titleText}>{card.name}</Text>
                    <View style={{ alignItems: 'center' }}>
                      <Image style={styles.image} source={{ uri: card.nftImageUrl }} />
                    </View>
                  </BlurView>
                </ImageBackground>
              </TouchableOpacity>
            ))}
        </View>
      )}

    </ScrollView>
  );
};

export default StackedCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    backgroundColor: Color.Gray.gray50,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    height:500
  },
  container1: {
    marginTop: 80,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  aCardContainer: {
    backgroundColor: Color.Gray.gray50,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: "-80%",
    borderColor: Color.Gray.gray400,
    overflow: 'hidden'
  },
  aCardContainer1: {
    backgroundColor: Color.Gray.gray50,
    padding: 20,
    borderRadius: 32,
    alignItems: "center",
    elevation: 3,
    width: "100%",
    marginBottom: "-80%",
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  blurContainer: {
    width: '100%',
    flex: 1,
    padding: 20
  },
  titleText: {
    color: Color.base.White,
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33, 33, 33, 0.32)',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 48,
    marginTop: 24,
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 13,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 32,
  },
});
