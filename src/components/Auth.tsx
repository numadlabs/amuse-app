import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import * as SecureStore from "expo-secure-store";
import { useMutation } from '@tanstack/react-query';
import { signInWithGoogle } from '@/lib/service/mutationHelper';
import { router } from 'expo-router';
import Button from './ui/Button';
import Color from '@/constants/Color';
import { BUTTON_48 } from '@/constants/typography';
import { Google } from 'iconsax-react-native';
import { SERVER_SETTING } from '@/constants/serverSettings';
import { axiosClient } from '@/lib/axios';

const Auth = () => {
  const [state, setState] = useState({
    isSignedIn: false,
    userInfo: null,
    isInProgress: false,
  });

  GoogleSignin.configure({
    webClientId: '102784688709-4au2h4ad48bf6un169fmc0gq6g30neqg.apps.googleusercontent.com', // client ID of type WEB for your server
    scopes: ['profile', 'email'], // what API you want to access on behalf of the user
    iosClientId: '102784688709-3ooh6h0ogu7c0psa8ip8708jvlkiap35.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS
  });

  const { mutateAsync: googleSignInMutation } = useMutation({
    mutationFn: signInWithGoogle
  })

  const signIn = async () => {
    if (state.isInProgress) return;

    setState(prevState => ({ ...prevState, isInProgress: true }));

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User signed in!', userInfo.data);
      console.log('User signed in!', userInfo.data.idToken);
      setState({
        userInfo,
        isSignedIn: true,
        isInProgress: false,
      });
      const response = await googleSignInMutation({ idToken: userInfo.data.idToken })
      if (response) {
        console.log("logged", response);
        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${response.auth.accessToken}`;
        await SecureStore.setItemAsync(
          SERVER_SETTING.TOKEN_KEY,
          response.auth.accessToken
        );
        await SecureStore.setItemAsync(
          SERVER_SETTING.REFRESH_TOKEN_KEY,
          response.auth.refreshToken
        );

        
        router.replace('(tabs)/')
      }
    } catch (error) {
      setState(prevState => ({ ...prevState, isInProgress: false }));

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Some other error happened:', error.message);
      }
    }
  };


  return (
    <View>

      <Button
        variant="tertiary"
        onPress={signIn}
      >
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', gap: 8 }}>
          <Google color={Color.base.White} size={24} />
          <Text
            style={{
              color: Color.base.White,
              ...BUTTON_48,
            }}
          >
            Sign up with Google
          </Text>
        </View>
      </Button>

    </View>
  )
}

export default Auth