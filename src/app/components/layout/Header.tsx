import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ShoppingCart, Notification } from 'iconsax-react-native'

interface NavbarProps{
    title: string
}

const Header: React.FC<NavbarProps> = ({title}) => {
    const navigation = useNavigation()
    return(
        <SafeAreaView>
            <View className="">
                <View>
                    <Text>{title}</Text>
                </View>
                <View >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color='#212121'/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Header