import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Barcode, Home2, ScanBarcode } from 'iconsax-react-native';
import Color from '../../constants/Color';
import Acard from '../icons/Acard';
import { Link, router } from 'expo-router';

const Footer = ({ navigation }) => {
  const [isActive, setIsActive] = useState('/')
  const handleTabPress = (route) => {
    router.navigate(route.name);
    setIsActive(route.name);
  };
  const isTabActive = (route) => {
    return isActive === route;
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => handleTabPress({ name: '/' })}>
        <Home2 size={24} color={isTabActive('/') ? Color.Gray.gray600 : Color.Gray.gray400} variant={isTabActive('/') ? 'Bold' : 'Linear'} />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.navigate('/(modals)/QrModal')}>
        <View style={styles.qr}>
          <ScanBarcode size={32} color={Color.base.White} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleTabPress({ name: 'Acards' })}>
        <Acard variant={isTabActive('Acards') ? 'Bold' : 'Linear'} size={24} color={isTabActive('Acards') ? Color.Gray.gray600 : Color.Gray.gray400} />
        <Text>Acards</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    flexDirection: 'row',
    backgroundColor: Color.base.White,
    paddingHorizontal: 44
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    padding: 12
  },

  qr: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 32,
    bottom: 40,
    position: 'relative',
    left: 5,
    right: 10,
    alignSelf: 'center',
    marginHorizontal: 'auto'
  }
})
