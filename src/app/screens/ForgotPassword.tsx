import React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import Header from '../components/layout/Header';
import Steps from '../components/atom/Steps';
import Button from '../components/ui/Button';

function ForgotPassword() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
          <Header title='Forgot password?' />
          <Steps />
          <View style={{ marginTop: 20 }}>
            <View style={{ paddingBottom: 10 }}>
              <Text style={{ color: '#888', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Phone Number</Text>
              <Text style={{ color: '#aaa', fontSize: 14, textAlign: 'center' }}>We’ll send verification code to your number.</Text>
            </View>
            <TextInput defaultValue='+971' keyboardType='numeric' placeholder='Phone number' style={{ height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 20, marginTop: 10 }} />
          </View>
          <View style={{ position: 'relative', marginTop: 20 }}>
            <Button variant='primary' textStyle='primary' size='default'>Send code</Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default ForgotPassword;
