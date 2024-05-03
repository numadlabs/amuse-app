import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions
  } from "react-native";
  import React, { useState } from "react";
  import { RestaurantType } from "@/app/lib/types";
  import Color from "@/app/constants/Color";
  import { Reserve, Wallet } from "iconsax-react-native";
  import { LinearGradient } from "expo-linear-gradient";
  import Button from "../../ui/Button";
  import { WalletAdd1 } from "iconsax-react-native";
  
  interface ResListCardProp {
    marker: RestaurantType;
    onPress: () => void;
    isClaimLoading: boolean;
  }
  const HomeRestListCard: React.FC<ResListCardProp> = ({
    marker,
    onPress,
    isClaimLoading,
  }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const opensAt = new Date(marker.opensAt);
    const closesAt = new Date(marker.closesAt);
    const currentTime = new Date();
    const { width } = Dimensions.get("window");
    const CARD_WIDTH = width * 0.83;
  
    const isOpen =
      currentTime.getTime() >= opensAt.getTime() &&
      currentTime.getTime() <= closesAt.getTime();
    return (
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={{ backgroundColor: "transparent", borderRadius: 20, width: CARD_WIDTH }}
        >
          <View style={styles.container}>
            <Image
              source={{
                uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${marker.logo}` as string,
              }}
              style={styles.image}
            />
            <View style={{ gap: 28 }}>
              <View style={{ gap: 4 }}>
                <View style={{ width: '100%', flex: 1, overflow: 'hidden' }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.title}
                  >
                    {marker.name}
                  </Text>
                </View>
                <Text style={styles.category}>{marker.category}</Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", width: '80%', justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: "row", alignItems: "center",  }}>
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
                {marker.isOwned ? <View
                  style={{
                    width: 1,
                    height: 14,
                    backgroundColor: Color.Gray.gray50,
                  }}
                /> : '' }
                {marker.isOwned ?  (
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
                      borderColor: Color.base.White
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
  
  export default HomeRestListCard;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 12,
      borderWidth: 1,
      borderColor: Color.Gray.gray400,
      borderRadius: 16,
      gap: 16,
      marginBottom: 12,
      width: '100%'
    },
    image: {
      borderRadius: 8,
      width: 92,
      height: 92,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: Color.base.White,
      width: "80%",
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
  