import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../constants/Color";
import Balance from "../components/sections/Balance";
import QuickInfo from "../components/sections/QuickInfo";
import StackedCard from "../components/sections/StackedCard";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useRouter } from "expo-router";

const Page = () => {
  const router = useRouter()
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setRefreshPage(prevState => !prevState); 
    });
    return unsubscribe;
  }, [router]);
  return (
    <ScrollView style={styles.container}>
      <Balance />
      <QuickInfo />
      <StackedCard key={refreshPage.toString()} />
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
