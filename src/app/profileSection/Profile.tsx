import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Color from "../constants/Color";
import {
  ArrowRight2,
  Lock1,
  MessageQuestion,
  NoteText,
  Sms,
  User,
} from "iconsax-react-native";
import { router, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "react-query";
import { getUserCard, getUserTaps } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";

const Profile = () => {
  const { currentLocation } = useLocationStore();
  const router = useRouter()
  const {data: taps = []} = useQuery({
    queryKey: ["userTaps"],
    queryFn: () => {
      return getUserTaps()
    },
  })

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
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries("userCards");
  }, []); 



  
  const { authState, onLogout } = useAuth();
  return (
    <>
      <Header title="Profile" />
      <SafeAreaView style={{ flex: 1, backgroundColor:Color.base.White  }}>
        <ScrollView style={{ flex: 1, backgroundColor:Color.base.White }}>
          <View style={styles.body}>
            <View style={styles.container}>
              <View style={styles.profileContainer}>
                <View style={styles.profilePic}>
                  <User size={48} color={Color.Gray.gray400} />
                </View>
                <Text style={styles.profileName}>Satorishu</Text>
              </View>
              <View style={styles.profileStatsContainer}>
                <View style={styles.profileStats}>
                  <TouchableOpacity onPress={() => router.push('/MyAcards')}>

                
                  <Text style={{ color: Color.Gray.gray400, fontSize: 16 }}>
                    Taps
                  </Text>
                  <Text
                    style={{
                      color: Color.Gray.gray600,
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {taps?.data?.taps.length === 0 ? "00" : taps?.data?.taps.length}
                  </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{ width: 1, backgroundColor: Color.Gray.gray50 }}
                />
                <TouchableOpacity style={styles.profileStats} onPress={() => router.push('/MyAcards')}>
                  <Text style={{ color: Color.Gray.gray400, fontSize: 16 }}>
                    A-Cards
                  </Text>
                  <Text
                    style={{
                      color: Color.Gray.gray600,
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {cards?.data?.cards.length === 0 ? "00" : cards?.data?.cards.length}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.profileConfig}>
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
                  <User size={24} color={Color.Gray.gray600} />
                  <Text style={{ fontSize: 16 }}>Account</Text>
                </View>
                <ArrowRight2 color={Color.Gray.gray600} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.configContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <Sms size={24} color={Color.Gray.gray600} />
                  <Text style={{ fontSize: 16 }}>Contact</Text>
                </View>
                <ArrowRight2 color={Color.Gray.gray600} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.configContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <MessageQuestion size={24} color={Color.Gray.gray600} />
                  <Text style={{ fontSize: 16 }}>FAQ</Text>
                </View>
                <ArrowRight2 color={Color.Gray.gray600} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.configContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <NoteText size={24} color={Color.Gray.gray600} />
                  <Text style={{ fontSize: 16 }}>Terms and Conditions</Text>
                </View>
                <ArrowRight2 color={Color.Gray.gray600} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.configContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <Lock1 size={24} color={Color.Gray.gray600} />
                  <Text style={{ fontSize: 16 }}>Privacy Policy</Text>
                </View>
                <ArrowRight2 color={Color.Gray.gray600} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.configContainer} onPress={onLogout}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: Color.System.systemError, fontWeight:'bold' }}>Sign out</Text>
                </View>
                <ArrowRight2 color={Color.Gray.gray600} />
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
    backgroundColor: Color.base.White,
    paddingHorizontal: 16,
  },
  container: {
    flex:1,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
    borderRadius: 32,
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  profilePic: {
    alignItems: "center",
    width: 72,
    height: 72,
    padding: 10,
    borderRadius: 200,
    backgroundColor: Color.Gray.gray50,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileStatsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  profileStats: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 8,
  },
  profileConfig: {
    gap: 16,
    marginTop: 24,
  },
  configContainer: {
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
});
