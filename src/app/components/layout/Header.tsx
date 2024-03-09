import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from 'iconsax-react-native';
import { StatusBar } from "expo-status-bar";
import Color from "../../constants/Color";
import { useRouter } from "expo-router";

interface NavbarProps {
    title: string;
}

const Header: React.FC<NavbarProps> = ({ title }) => {
    const router = useRouter();

    return (
        <>
        <SafeAreaView style={{backgroundColor:Color.base.White}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.icon}>
                    <ArrowLeft size={24} color={Color.base.Black}/>
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
            </View>
        </SafeAreaView>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        height:56,
        paddingHorizontal:16,
        paddingVertical:8,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor: Color.base.White
    },
    icon:{
        position:'absolute',
        left:16
    },
    title:{
        fontSize:16,
        fontWeight:'bold'
    }
})

export default Header;
