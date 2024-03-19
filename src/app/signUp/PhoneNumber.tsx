import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SuLayout from './_layout'
import Steps from '../components/atom/Steps'
import Color from '../constants/Color'
import Button from '../components/ui/Button'
import { useNavigation, useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { useSignUpStore } from '../lib/store/signUpStore'
import { Map1 } from 'iconsax-react-native'
import PrefixList from '../components/atom/cards/PrefixCard'


const PhoneNumber = () => {
  const { prefix, setPrefix, phoneNumber, setPhoneNumber } = useSignUpStore();

  const [buttonPosition, setButtonPosition] = useState('bottom');
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const { onRegister } = useAuth()

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setButtonPosition('top')
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setButtonPosition('bottom')
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  const handleNavigation = () => {
    router.push({
      pathname: '/signUp/Password',
      params: {
        prefix: prefix,
        phoneNumber: phoneNumber,
      }
    });
  };
  return (
    <>
      <Steps activeStep={1} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.base.White }}>
            <View style={styles.body}>
              <View style={styles.textContainer}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.topText}>Phone Number</Text>
                  <Text style={styles.bottomText}>This data will not be shared.</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, alignContent: 'center', borderColor: Color.Gray.gray50, height: 48, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, marginTop: 10, width: '100%' }}>
                  <TextInput
                    value={prefix}
                    placeholder='+976'
                    defaultValue='+'
                    keyboardType='phone-pad'
                    onChangeText={setPrefix}
                    style={[styles.input, { width: '15%' }]} />
                  <TextInput onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                    keyboardType='phone-pad'
                    placeholder='XXXXXXXX'
                    value={phoneNumber}
                    style={styles.input}
                    onChangeText={setPhoneNumber}
                  // style={isFocused ? {  } : { height: 48, borderWidth: 1, borderColor: Color.Gray.gray100, borderRadius: 16, paddingHorizontal: 16, marginTop: 10, width: '100%' }} 
                  />
                </View>
              </View>
            </View>
            <View style={[styles.buttonContainer, buttonPosition === 'bottom' ? styles.bottomPosition : styles.topPosition]}>
              <Button variant='primary' textStyle='primary' size='default' onPress={handleNavigation}>Send code</Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  )
}

export default PhoneNumber

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16
  },
  textContainer: {
    marginTop: 20,
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
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
    marginBottom: 20
  },
  bottomPosition: {
    justifyContent: 'flex-end'
  },
  topPosition: {
    justifyContent: 'flex-start',
    marginTop: 'auto',
  },
  topText: {
    color: Color.Gray.gray500,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bottomText: {
    color: Color.Gray.gray400,
    fontSize: 12,
    textAlign: 'center'
  },
  input: {
    fontSize: 16,
    fontWeight: 'normal'
  }
})