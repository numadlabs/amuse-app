import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../constants/Color";
import Balance from "../components/sections/Balance";
import QuickInfo from "../components/sections/QuickInfo";
import StackedCard from "../components/sections/StackedCard";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

const Page = () => {
  const router = useRouter()
  return (
    <ScrollView style={styles.container}>
      <Balance />
      <QuickInfo />
      <StackedCard />
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 50 }}>
        <TouchableOpacity onPress={() => router.push('/MyAcards')}>
          <View style={{ backgroundColor: Color.Gray.gray50, marginTop: 16, paddingVertical: 12, paddingHorizontal:16, borderRadius: 32 }}>
            <Text style={{fontWeight:'bold', color: Color.Gray.gray600, fontSize:16,}}>
              See all
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingHorizontal: 16
  },
});
