import { Cake, Camera, Location, Sms, User } from "iconsax-react-native";

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Header from "../components/layout/Header";
import Color from "../constants/Color";

const ProfileEdit = () => {
  return (
    <>
      <Header title="Account" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.body}>
            <View style={styles.container}>
              <View style={styles.profileContainer}>
                <View style={styles.profilePic}>
                  <User size={48} color={Color.Gray.gray400} />
                  <View style={styles.camera}>
                    <Camera color="white" size={16}></Camera>
                  </View>
                </View>
              </View>
              <View style={styles.input}>
                <User color="black" />
                <TextInput
                  defaultValue="Satoshi"
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
              <View style={styles.input}>
                <Sms color="black" />
                <TextInput
                  defaultValue="example@gmail.com"
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
              <View style={styles.input}>
                <Location color="black" />
                <TextInput
                  defaultValue="JLT Cluster A"
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
              <View style={styles.input}>
                <Cake color="black" />
                <TextInput
                  defaultValue="Jan 24, 2000"
                  style={{ fontSize: 20 }}
                ></TextInput>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
  },
  profilePic: {
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    height: 96,
    padding: 10,
    borderRadius: 200,
    backgroundColor: Color.Gray.gray50,
    position: "relative",
    marginBottom: 32,
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
  },
  input: {
    height: 48,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    marginBottom: 16,
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
