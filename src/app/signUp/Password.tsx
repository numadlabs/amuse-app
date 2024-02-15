import { View, Text, TextInput, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import FpLayout from './_layout'
import Color from '@/app/constants/Color'
import { router, useNavigation } from 'expo-router';
import Button from '@/app/components/ui/Button';
import Steps from '@/app/components/atom/Steps';
import { EyeSlash } from 'iconsax-react-native';
import Tick from '@/app/components/Tick';

const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/\d/.test(password)) {
    return false;
  }
  return true;
};

const Password = () => {
  const [buttonPosition, setButtonPosition] = useState('bottom');
  const [isFocused, setIsFocused] = useState(false)
  const navigation = useNavigation()
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;



  const isRuleSatisfied = (rule: RegExp): boolean => {
    return rule.test(password);
  };

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
    <>
      <Steps activeStep={2} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={styles.body}>
            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.topText}>
                  New password
                </Text>
                <Text style={styles.bottomText}>
                  This data will not be shared.
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                  placeholder='Password'
                  style={isFocused ? styles.inputFocused : styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TextInput
                  onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                  placeholder='Confirm password'
                  style={isFocused ? styles.inputFocused : styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
              {!doPasswordsMatch && (
                <Text style={styles.errorText}>Password doesn't match</Text>
              )}
              <View style={styles.ruleContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Tick />
                  <Text style={[styles.ruleText, isRuleSatisfied(/.{8,}/) && styles.greenRuleText]}>{'At least 8 characters'}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Tick />
                  <Text style={[styles.ruleText, isRuleSatisfied(/[A-Z]/) && styles.greenRuleText]}>{'At least 1 upper case letter (A-Z)'}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Tick />
                  <Text style={[styles.ruleText, isRuleSatisfied(/[a-z]/) && styles.greenRuleText]}>{'At least 1 lower case letter (a-z)'}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Tick />
                  <Text style={[styles.ruleText, isRuleSatisfied(/\d/) && styles.greenRuleText]}>{'At least 1 number (0-9)'}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.buttonContainer, buttonPosition === 'bottom' ? styles.bottomPosition : styles.topPosition]}>
              <Button variant='primary' textStyle='primary' size='default' onPress={() => router.push('/signUp/NickName')}>Continue</Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.base.White,
    height: '100%',
    paddingHorizontal: 16
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginTop: 16,
    elevation: 4,
    borderRadius: 32,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  topText: {
    color: Color.Gray.gray500,
    fontWeight: 'bold',
    fontSize: 24
  },
  bottomText: {
    color: Color.Gray.gray400,
    fontSize: 12
  },
  inputContainer: {
    gap: 12
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Color.Gray.gray100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16
  },
  inputFocused: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Color.Gray.gray600,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16
  },
  ruleContainer: {
    marginTop: 16,
    gap: 6
  },
  ruleText: {
    fontSize: 14,
    color: Color.Gray.gray400,
  },
  greenRuleText: {
    color: Color.System.systemSuccess,
  },
  errorText: {
    color: Color.System.systemError,
    marginTop: 8,
    paddingHorizontal: 16
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
    marginBottom: 10
  },
  bottomPosition: {
    justifyContent: 'flex-end'
  },
  topPosition: {
    justifyContent: 'flex-start',
    marginTop: 'auto',
  },
});

export default Password;
