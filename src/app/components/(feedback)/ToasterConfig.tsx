import { ToastConfig, ToastConfigParams } from "react-native-toast-message/lib/src/types";
import { StyleSheet, View, Text, Platform } from "react-native";
import Tick from "../icons/Tick";
import Color from "@/app/constants/Color";
import { width } from "@/app/lib/utils";



//declare types of obj
export const toastConfig: ToastConfig = {
  perkToast: (params: ToastConfigParams<any>) => (
    <View style={styles.toastContainer}>
      <Tick size={24} color={Color.System.systemSuccess} />
      <Text style={styles.toastText}>{params.text1}</Text>
    </View>
  )
};



const styles = StyleSheet.create({
  toastContainer: {
    top: 4,
    gap: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    minWidth: width / 2,
    backgroundColor: Color.base.White,
    padding: 12,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: Color.Gray.gray500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 12
      },
      android: {
        elevation: 12,
      },
    }),
    zIndex: 999
  },
  toastText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  }
})