import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView } from "react-native";
import { EmojiHappy, Flash } from "iconsax-react-native";
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
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
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

  useEffect(() => {
    if (cards && cards.data && cards.data.cards) {
      const totalCardHeight = cards.data.cards.reduce((totalHeight, card, index) => {
        const marginBottom = index !== 0 ? -80 : 0;
        const cardHeight = 350 + marginBottom;
        return totalHeight + cardHeight;
      }, 0);

      const adjustedTotalHeight = totalCardHeight * (1 - 0.8);
      setScrollViewHeight(adjustedTotalHeight);
    }
  }, [cards]);

  const latestCards = cards?.data?.cards.slice(0, 4);
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
        logo: restaurant.logo,
        taps: restaurant.visitCount,
        artistInfo: restaurant.artistInfo,
        benefits: restaurant.benefits,
        membership: restaurant.expiryInfo,
        instruction: restaurant.instruction
      },
    });
  };

  return (
    <>
      {cards?.data?.cards.length === 0 ? (
        <View style={styles.container1}>
          <View>
            <Flash size={48} color={Color.Gray.gray400} />
          </View>
          <Text style={{ textAlign: 'center' }}>Discover restaurants, add an membership card, and start earning rewards every time you check-in at a participating restaurant!</Text>
          <TouchableOpacity onPress={() => router.navigate('/Acards')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Explore</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ height: scrollViewHeight }}>
          {cards?.data?.cards &&
            latestCards.map((card, index) => (
              <TouchableOpacity
                activeOpacity={0.9}
                key={card.id}
                onPress={() => handleNavigation(card)}
              >

                <ImageBackground resizeMode='cover' source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${card.logo}` }}
                  style={[
                    styles.aCardContainer,
                    { marginTop: index !== 0 ? -5 : 0 },
                  ]}>
                  <View style={styles.overlay} />
                  <BlurView intensity={24} style={styles.blurContainer}>
                    <Text style={styles.titleText}>{card.name}</Text>
                    <Text style={[styles.buttonText, {bottom:5}]}>{card.category}</Text>
                    <View style={{ alignItems: 'center' }}>
                      <Image style={styles.image} source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${card.logo}` }} />
                    </View>
                  </BlurView>
                </ImageBackground>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </>
  );
};

export default StackedCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray50,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    minHeight: 380,
    maxHeight: 600,
  },
  container1: {
    backgroundColor: Color.Gray.gray50,
    height: 380,
    paddingHorizontal: 16,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
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
    fontSize: 12,
    lineHeight:16,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 32,
  },
});
