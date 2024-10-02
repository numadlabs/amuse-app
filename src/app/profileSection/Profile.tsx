import { useRouter } from "expo-router";
import {
  ArrowRight2,
  Lock,
  LogoutCurve,
  MessageQuestion,
  NoteText,
  Sms,
  User,
  Warning2,
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
import {
  BODY_1_REGULAR,
  BODY_2_REGULAR,
  BUTTON_48,
  H5,
  H6,
} from "@/constants/typography";

const ContactOptions = ({ onEmailPress, onWhatsAppPress }) => (
  <View style={styles.contactOptionsContainer}>
    <TouchableOpacity style={styles.contactOption} onPress={onEmailPress}>
      <Text style={styles.contactOptionText}>Email</Text>
    </TouchableOpacity>
    <View style={styles.contactOptionDivider} />
    <TouchableOpacity style={styles.contactOption} onPress={onWhatsAppPress}>
      <Text style={styles.contactOptionText}>WhatsApp</Text>
    </TouchableOpacity>
  </View>
);

const ProfileConfigItem = ({ icon, title, onPress }) => (
  <LinearGradient
    colors={[Color.Brand.card.start, Color.Brand.card.end]}
    start={{ x: 1, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ borderRadius: 16 }}
  >
    <TouchableOpacity style={styles.configContainer} onPress={onPress}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        {icon}
        <Text style={{ ...BODY_1_REGULAR, color: Color.Gray.gray50 }}>
          {title}
        </Text>
      </View>
      <ArrowRight2 color={Color.Gray.gray100} />
    </TouchableOpacity>
  </LinearGradient>
);

const Profile = () => {
  const { currentLocation } = useLocationStore();
  const { authState, onLogout } = useAuth();
  const router = useRouter();
  const [showContactOptions, setShowContactOptions] = useState(false);

  const { data: taps = [] } = useQuery({
    queryKey: userKeys.taps,
    queryFn: () => getUserTaps(),
  });

  const { data: userTier = [], isLoading: isUserTierLoading } = useQuery({
    queryKey: userKeys.tier,
    queryFn: getUserTiers,
    enabled: !!authState.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => getUserCard(),
    enabled: !!currentLocation,
  });

  const { data: user = [] } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
  });

  const userTierData = userTier.find(
    (tier) => tier.id === user?.user?.userTierId,
  );

  const openWhatsApp = () => {
    Linking.openURL(SERVER_SETTING.WHATSAPP_LINK);
  };

  const toggleContactOptions = () => {
    setShowContactOptions(!showContactOptions);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <Header title="Profile" />
      <ScrollView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
        <View style={styles.body}>
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => ""}>
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileCardGradient}
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
                <View style={styles.profileInfo}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.profileName}
                  >
                    {user?.user?.nickname}
                  </Text>
                  <Text style={styles.profileTier}>
                    Tier: {userTierData?.name}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.profileStatsContainer}>
              <View style={styles.profileStats}>
                <Text style={styles.statsLabel}>Check-ins</Text>
                <Text style={styles.statsValue}>
                  {taps?.data?.taps.length === 0
                    ? "00"
                    : taps?.data?.taps.length}
                </Text>
              </View>
              <View style={styles.statsDivider} />
              <TouchableOpacity
                style={styles.profileStats}
                onPress={() => router.push("/MyAcards")}
              >
                <Text style={styles.statsLabel}>Memberships</Text>
                <Text style={styles.statsValue}>
                  {cards?.data?.cards.length === 0
                    ? "00"
                    : cards?.data?.cards.length}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileConfig}>
            <ProfileConfigItem
              icon={<User size={24} color={Color.Gray.gray100} />}
              title="Account"
              onPress={() => router.push("profileSection/ProfileEdit")}
            />

            <ProfileConfigItem
              icon={<Sms size={24} color={Color.Gray.gray100} />}
              title="Contact Us"
              onPress={toggleContactOptions}
            />

            {showContactOptions && (
              <ContactOptions
                onEmailPress={() =>
                  Linking.openURL("mailto:info@amusebouche.io")
                }
                onWhatsAppPress={openWhatsApp}
              />
            )}

            <ProfileConfigItem
              icon={<MessageQuestion size={24} color={Color.Gray.gray100} />}
              title="FAQ"
              onPress={() => router.navigate("/Faq")}
            />

            <ProfileConfigItem
              icon={<NoteText size={24} color={Color.Gray.gray100} />}
              title="Terms and Conditions"
              onPress={() => router.navigate("/TermsAndCondo")}
            />

            <ProfileConfigItem
              icon={<Lock size={24} color={Color.Gray.gray100} />}
              title="Privacy"
              onPress={() => router.push("PrivacyPolicy")}
            />

            <ProfileConfigItem
              icon={<Warning2 size={24} color={Color.Gray.gray100} />}
              title="Report a Bug"
              onPress={() => router.push("BugReport")}
            />

            <TouchableOpacity onPress={onLogout}>
              <View style={styles.logout}>
                <LogoutCurve color={Color.Gray.gray100} />
                <Text style={styles.logoutText}>Log out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
  },
  profileCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray300,
    overflow: "hidden",
  },
  profileCardGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  profilePic: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Color.Gray.gray300,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...H6,
    color: Color.base.White,
  },
  profileTier: {
    ...BODY_2_REGULAR,
    color: Color.Gray.gray100,
    marginTop: 8,
  },
  profileStatsContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: Color.Gray.gray300,
  },
  profileStats: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  statsLabel: {
    ...BODY_2_REGULAR,
    color: Color.Gray.gray100,
  },
  statsValue: {
    ...H5,
    color: Color.Gray.gray50,
    marginTop: 8,
  },
  statsDivider: {
    width: 1,
    backgroundColor: Color.Gray.gray300,
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
  contactOptionsContainer: {
    flexDirection: "row",
    backgroundColor: Color.Gray.gray500,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  contactOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  contactOptionText: {
    ...BODY_1_REGULAR,
    color: Color.Gray.gray50,
  },
  contactOptionDivider: {
    width: 1,
    backgroundColor: Color.Gray.gray300,
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
  logoutText: {
    color: Color.Gray.gray50,
    ...BUTTON_48,
  },
});

export default Profile;
