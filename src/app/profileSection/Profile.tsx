import { useRouter } from "expo-router";
import {
  ArrowRight2,
  Lock,
  LogoutCurve,
  MessageQuestion,
  NoteText,
  Sms,
  User,
} from "iconsax-react-native";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import { useAuth } from "@/context/AuthContext";
import {
  getUserById,
  getUserCard,
  getUserTaps,
  getUserTiers,
} from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { userKeys } from "@/lib/service/keysHelper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { BODY_1_REGULAR, BODY_2_REGULAR, BUTTON_48, H5, H6 } from "@/constants/typography";

const Profile = () => {
  const { currentLocation } = useLocationStore();
  const { authState, onLogout } = useAuth();
  const router = useRouter();
  const { data: taps = [] } = useQuery({
    queryKey: userKeys.taps,
    queryFn: () => {
      return getUserTaps();
    },
  });

  const { data: userTier = [], isLoading: isUserTierLoading } = useQuery({
    queryKey: userKeys.tier,
    queryFn: getUserTiers,
    enabled: !!authState.userId,
  });

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

  const { data: user = [] } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => {
      return getUserById(authState.userId);
    },
  });

  const userTierData = userTier.find(
    (tier) => tier.id === user?.user?.userTierId,
  );
  console.log(userTier);
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
        <Header title="Profile" />
        <ScrollView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
          <View style={styles.body}>
            <View
              style={{
                borderWidth: 1,
                borderColor: Color.Gray.gray300,
                borderRadius: 16,
              }}
            >
              <TouchableOpacity onPress={() => router.push("/Tier")}>
                <LinearGradient
                  colors={[Color.Brand.card.start, Color.Brand.card.end]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "row",
                    gap: 20,
                    borderWidth: 1,
                    borderColor: Color.Gray.gray300,
                  }}
                >
                  <View style={styles.profilePic}>
                    {user?.user?.profilePicture ? (
                      <Image
                        source={{
                          uri: `${SERVER_SETTING.PROFILE_PIC_LINK}${user?.user?.profilePicture}`,
                        }}
                        style={{ width: 72, height: 72, borderRadius: 48 }}
                      />
                    ) : (
                      <User size={36} color={Color.Gray.gray50} />
                    )}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.profileName}
                      >
                        {user?.user?.nickname}
                      </Text>
                      <Text
                        style={{
                          ...BODY_2_REGULAR,
                          color: Color.Gray.gray100,
                        }}
                      >
                        Tier: {userTierData?.name}
                      </Text>
                    </View>
                    <View>
                      <ArrowRight2 color={Color.Gray.gray100} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.profileStatsContainer}>
                <View style={styles.profileStats}>
                  <View
                    style={{
                      justifyContent: "center",
                      gap: 8,
                      alignItems: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={{ color: Color.Gray.gray100, ...BODY_2_REGULAR}}>
                      Check-ins
                    </Text>
                    <Text
                      style={{
                        color: Color.Gray.gray50,
                        ...H5,
                      }}
                    >
                      {taps?.data?.taps.length === 0
                        ? "00"
                        : taps?.data?.taps.length}
                    </Text>
                  </View>
                </View>
                <View
                  style={{ width: 1, backgroundColor: Color.Gray.gray300 }}
                />
                <TouchableOpacity
                  style={styles.profileStats}
                  onPress={() => router.push("/MyAcards")}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      gap: 8,
                      alignItems: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={{ color: Color.Gray.gray100, ...BODY_2_REGULAR }}>
                      Memberships
                    </Text>
                    <Text
                      style={{
                        color: Color.Gray.gray50, 
                        ...H5,
                      }}
                    >
                      {cards?.data?.cards.length === 0
                        ? "00"
                        : cards?.data?.cards.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileConfig}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16 }}
              >
                <TouchableOpacity
                  style={styles.configContainer}
                  onPress={() => router.push("profileSection/ProfileEdit")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <User size={24} color={Color.Gray.gray100} />
                    <Text style={{ ...BODY_1_REGULAR, color: Color.Gray.gray50 }}>
                      Account
                    </Text>
                  </View>
                  <ArrowRight2 color={Color.Gray.gray100} />
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16 }}
              >
                <TouchableOpacity
                  style={styles.configContainer}
                  onPress={() =>
                    Linking.openURL("mailto:itnumadlabs@gmail.com")
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Sms size={24} color={Color.Gray.gray100} />
                    <Text style={{ ...BODY_1_REGULAR, color: Color.Gray.gray50 }}>
                      Contact
                    </Text>
                  </View>
                  <ArrowRight2 color={Color.Gray.gray100} />
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16 }}
              >
                <TouchableOpacity
                  style={styles.configContainer}
                  onPress={() => router.navigate("/Faq")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <MessageQuestion size={24} color={Color.Gray.gray100} />
                    <Text style={{ ...BODY_1_REGULAR, color: Color.Gray.gray50 }}>
                      FAQ
                    </Text>
                  </View>
                  <ArrowRight2 color={Color.Gray.gray100} />
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16 }}
              >
                <TouchableOpacity
                  style={styles.configContainer}
                  onPress={() => router.navigate("/TermsAndCondo")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <NoteText size={24} color={Color.Gray.gray100} />
                    <Text style={{  ...BODY_1_REGULAR, color: Color.Gray.gray50 }}>
                      Terms and Conditions
                    </Text>
                  </View>
                  <ArrowRight2 color={Color.Gray.gray100} />
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16 }}
              >
                <TouchableOpacity
                  style={styles.configContainer}
                  onPress={() => router.push("PrivacyPolicy")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Lock size={24} color={Color.Gray.gray100} />
                    <Text style={{  ...BODY_1_REGULAR, color: Color.Gray.gray50 }}>
                      Privacy
                    </Text>
                  </View>
                  <ArrowRight2 color={Color.Gray.gray100} />
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity onPress={onLogout}>
                <View style={styles.logout}>
                  <LogoutCurve color={Color.Gray.gray100} />
                  <Text
                    style={{
                      color: Color.Gray.gray50,
                      ...BUTTON_48,
                    }}
                  >
                    Log out
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    marginTop: 16,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  logout: {
    borderRadius: 48,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Color.Gray.gray400,
    paddingVertical: 12,
    marginBottom: 24,
  },
  profilePic: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
    padding: 10,
    borderRadius: 200,
    backgroundColor: Color.Gray.gray300,
  },
  profileName: {
    ...H6,
    color: Color.base.White,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileStatsContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    justifyContent: "center",
  },
  profileStats: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  profileConfig: {
    gap: 16,

    marginTop: 24,
  },
  configContainer: {
    borderWidth: 1,
    borderColor: Color.Gray.gray300,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
});
