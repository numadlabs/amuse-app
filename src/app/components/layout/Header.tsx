import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from 'iconsax-react-native';

interface NavbarProps {
    title: string;
}

const Header: React.FC<NavbarProps> = ({ title }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <View className="flex flex-row items-center justify-center px-4 py-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className="absolute p-4 left-0">
                    <ArrowLeft size={24} color='#212121'/>
                </TouchableOpacity>
                <Text className="text-lg font-bold">{title}</Text>
            </View>
        </SafeAreaView>
    );
}

export default Header;
