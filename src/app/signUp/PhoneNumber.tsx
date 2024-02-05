import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SuLayout from './_layout'
import Steps from '@/app/components/atom/Steps'
import Color from '@/app/constants/Color'
import Button from '@/app/components/ui/Button'
import { useNavigation } from 'expo-router'
const PhoneNumber = () => {
  const [buttonPosition, setButtonPosition] = useState('bottom');
  const [isFocused, setIsFocused] = useState(false)

  //add number checker
  
  const navigation = useNavigation()

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
  return (
    <SuLayout>
      <Steps activeStep={1}/>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.base.White }}>
            <View style={styles.body}>
              <View style={styles.textContainer}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.topText}>Phone Number</Text>
                  <Text style={styles.bottomText}>This data will not be shared.</Text>
                </View>
                <TextInput onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} defaultValue='+971' keyboardType='phone-pad' placeholder='Phone number' style={isFocused ? { borderColor: Color.Gray.gray600, height: 48, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, marginTop: 10, } : { height: 48, borderWidth: 1, borderColor: Color.Gray.gray100, borderRadius: 16, paddingHorizontal: 16, marginTop: 10, }} />
              </View>
            </View>
            <View style={[styles.buttonContainer, buttonPosition === 'bottom' ? styles.bottomPosition : styles.topPosition]}>
              <Button variant='primary' textStyle='primary' size='default' onPress={() => navigation.navigate('VerificationCode')}>Send code</Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SuLayout>
  )
}

export default PhoneNumber

const styles = StyleSheet.create({
  body:{
    paddingHorizontal:16
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
  }
})