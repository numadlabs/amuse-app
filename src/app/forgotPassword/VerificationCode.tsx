import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, SafeAreaView, Text, View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/layout/Header';
import Steps from '../components/atom/Steps';
import Color from '../constants/Color';
import Button from '../components/ui/Button';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import FpLayout from './_layout';

export enum KeyBoardTypes {
  default = 'default',
  email = 'email-address',
  numeric = 'numeric',
  phone = 'phone-pad',
  url = 'url',
  number = 'number-pad',
  unset = 'unset',
}

const SplitOTP = () => {
  const {phoneNumber, prefix} = useLocalSearchParams()
  const [buttonPosition, setButtonPosition] = useState('bottom');
  const [isFocused, setIsFocused] = useState(false);
  const [text, onChangeText] = useState('');
  let inputRef = useRef(null);
  const onPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  console.log(phoneNumber, prefix)

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

  const navigation = useNavigation()

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const handleNavigation = () => {
    router.navigate({
      pathname: '/forgotPassword/NewPassword',
      params: {
        phoneNumber: phoneNumber,
        prefix: prefix,
      }
    })
  }

  const otpContent = useMemo(() =>
    <View style={styles.containerStyle}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Text
          key={i}
          onPress={onPress}
          style={[styles.textStyle, text[i] ? styles.filledStyle : {},
          text[i] ? { borderColor: Color.Gray.gray600 } : { borderColor: Color.Gray.gray100 }]}>
          {text[i]}
        </Text>
      ))}
    </View>
    , [text, isFocused]);

  return (
  
      <>
        <Steps activeStep={2}/>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.body}>
              <View style={styles.container}>
                <View style={styles.textContainer}>
                  <View>
                    <Text style={styles.topText}>Verification code</Text>
                  </View>
                  <View>
                    <Text style={styles.bottomText}>Verification code has sent to your number.</Text>
                  </View>
                </View>
                <SafeAreaView style={styles.safeAreaStyle}>
                  <TextInput
                    maxLength={4}
                    ref={inputRef}
                    style={styles.input}
                    onChangeText={text => onChangeText(text)}
                    value={text}
                    keyboardType={KeyBoardTypes.number}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  {otpContent}
                </SafeAreaView>
              </View>
              <View style={[styles.buttonContainer, buttonPosition === 'bottom' ? styles.bottomPosition : styles.topPosition]}>
                <Button variant='primary' textStyle='primary' size='default' onPress={handleNavigation}>Skip for demo</Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </>
   
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    height: '100%',
    paddingHorizontal:16
  },
  container: {
    paddingVertical: 16,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: Color.Gray.gray600,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginTop: 16,
    elevation: 4,
    borderRadius: 32
  },
  input: {
    height: 0,
    width: 0,
    color: Color.base.White
  },
  inputFocused: {
    borderColor: Color.base.White,
  },
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  textStyle: {
    height: 48,
    width: 48,
    borderColor: Color.Gray.gray100,
    borderWidth: 1,
    borderRadius: 16,
    fontSize: 16,
    textAlign: 'center',
    padding: 12,
  },
  filledStyle: {
    overflow: 'hidden',
  },
  titleStyle: {
    fontSize: 24,
    marginVertical: 14,
  },
  safeAreaStyle: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  topText: {
    color: Color.base.White,
    fontWeight: 'bold',
    fontSize: 24
  },
  bottomText: {
    color: Color.base.White,
    fontSize: 12
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
  }
});

export default SplitOTP;
