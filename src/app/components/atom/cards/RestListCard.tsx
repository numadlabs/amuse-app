import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
  } from "react-native";
  import React, { useState } from "react";
  import { RestaurantType } from "@/app/lib/types";
  import Color from "@/app/constants/Color";
  import { Reserve, Wallet } from "iconsax-react-native";
  import { LinearGradient } from "expo-linear-gradient";
  import Button from "../../ui/Button";
  import { WalletAdd1 } from "iconsax-react-native";
  import { width } from "@/app/lib/utils";
  
  interface ResListCardProp {
    marker: RestaurantType;
    onPress: () => void;
    isClaimLoading: boolean;
  }
  const RestListCard: React.FC<ResListCardProp> = ({
    marker,
    onPress,
    isClaimLoading,
  }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const opensAt = new Date(marker.opensAt);
    const closesAt = new Date(marker.closesAt);
    const currentTime = new Date();
    const { width } = Dimensions.get("window");
    const CARD_WIDTH = width * 0.88;
  
    const isOpen =
      currentTime.getTime() >= opensAt.getTime() &&
      currentTime.getTime() <= closesAt.getTime();
    return (
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        style={{
          width: '100%',
          overflow: "hidden",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: Color.Gray.gray400,
          marginBottom: 16,
        }}
      >
        <View style={styles.container}>
          <Image
            source={{
              uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${marker.logo}` as string,
            }}
            style={styles.image}
          />
          <View style={{ height: 92, justifyContent: "space-between" }}>
            <View style={{ gap: 4 }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                {marker.name}
              </Text>
              <Text style={styles.category}>{marker.category}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "82%",
                alignItems: "center",
                ...(marker.isOwned
                  ? { gap: 12 }
                  : { justifyContent: "space-between" }),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isOpen
                        ? `${Color.System.systemError}`
                        : `${Color.System.systemSuccess}`,
                    },
                  ]}
                />
                <Text
                  style={{
                    color: isOpen
                      ? `${Color.System.systemError}`
                      : `${Color.System.systemSuccess}`,
                  }}
                >
                  {isOpen ? "Closed" : "Open"}
                </Text>
              </View>
              {marker.isOwned ? (
                <View
                  style={{
                    width: 1,
                    height: 14,
                    backgroundColor: Color.Gray.gray50,
                  }}
                />
              ) : (
                ""
              )}
              {marker.isOwned ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Reserve color={Color.Gray.gray50} size={16} />
                  <Text style={{ color: Color.Gray.gray50 }}>
                    {marker.visitCount} Check-ins
                  </Text>
                </View>
              ) : (
                <Button
                  variant="text"
                  onPress={onPress}
                  disabled={loading}
                  size="small"
                  style={{
                    alignItems: "center",
                    height: 36,
                    justifyContent: "center",
                    borderWidth: 1,
                    borderRadius: 16,
                    borderColor: Color.base.White,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <View
                        style={{
                          height: "100%",
                          width: "100%",
                          marginLeft: 8,
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text style={{ fontSize: 11, color: Color.base.White }}>
                          Add
                        </Text>
                      </View>
                    </>
                  )}
                </Button>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };
  
  export default RestListCard;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flex: 1,
      padding: 12,
  
      borderRadius: 20,
      gap: 16,
    },
    image: {
      borderRadius: 12,
      width: 92,
      height: 92,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: Color.base.White,
    },
    category: {
      fontSize: 12,
      color: Color.Gray.gray100,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 5,
    },
  });
  