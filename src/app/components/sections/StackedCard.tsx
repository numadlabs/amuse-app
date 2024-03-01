import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { EmojiHappy } from "iconsax-react-native";
import Color from "../../constants/Color";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { useQuery } from "react-query";
import { getUserCard } from "@/app/lib/service/queryHelper";

const StackedCard = () => {
  const { authState } = useAuth();
  const router = useRouter();

  // const { data: cards = [] } = useQuery(
  //   ["userCards", authState.userId],
  //   async () => {
  //     const response = await getUserCard(authState.userId);
  //     return response.data.cards;
  //   }
  // );

  const { data: cards = [] } = useQuery({
    queryKey: ["userCards"],
    queryFn: () => {
      return getUserCard(authState.userId);
    },
    // onError(error):{
    //   console.log(error)
    // }
  });
  console.log("🚀 ~ StackedCard ~ cards:", cards);

  const handleNavigation = (restaurant) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        name: restaurant.name,
        location: restaurant.location,
        about: restaurant.description,
        category: restaurant.category,
        isOwned: restaurant.isOwned,
      },
    });
  };

  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
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
        <View style={{ alignItems: "center" }}>
          {cards &&
            cards.data.cards.map((card, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.aCardContainer,
                  { marginTop: index !== 0 ? -20 : 0 },
                ]}
                key={card.id}
                onPress={() => handleNavigation(card)}
              >
                <Text style={styles.titleText}>{card.name}</Text>
                <Image style={styles.image} source={require("@/public/images/Image1.png")} />
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
};

export default StackedCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: Color.Gray.gray50,
    height: "100%",
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    overflow: "hidden",
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
    padding: 20,
    borderRadius: 32,
    alignItems: "center",
    elevation: 3,
    width: "100%",
    marginBottom: "-80%",
    borderWidth: 1,
  },
  titleText: {
    color: Color.Gray.gray400,
    fontSize: 16,
    marginBottom: 10,
    alignSelf:'flex-start',
    fontWeight:'bold'
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
    width:300,
    height:300,
    borderRadius:32
  }
});
