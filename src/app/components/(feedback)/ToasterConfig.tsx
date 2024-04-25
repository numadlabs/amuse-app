import { ToastConfig, ToastConfigParams } from "react-native-toast-message/lib/src/types";
import { StyleSheet, View, Text, Platform } from "react-native";
import Tick from "../icons/Tick";
import Color from "@/app/constants/Color";
import { width } from "@/app/lib/utils";
import { LinearGradient } from "expo-linear-gradient";



//declare types of obj
export const toastConfig: ToastConfig = {
  perkToast: (params: ToastConfigParams<any>) => (
    <LinearGradient
      colors={[Color.Brand.main.start, Color.Brand.main.end]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{padding:1, 
        borderRadius: 24,
        flex:1,
        top:4,
      }}
    >
      <View style={styles.toastContainer}>
        <Tick size={24} color={Color.System.systemSuccess} />
        <Text style={styles.toastText}>{params.text1}</Text>
      </View>
    </LinearGradient>
  )
};



const styles = StyleSheet.create({
  toastContainer: {
    zIndex:999,
    gap: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    minWidth: width / 2,
    backgroundColor: Color.Gray.gray500,
    padding: 12,
    borderRadius: 24,
  },
  toastText: {
    fontSize: 16,
    color: Color.base.White,
    fontWeight: '600',
    lineHeight: 20,
  }
})