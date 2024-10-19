import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { useMutation } from '@tanstack/react-query';
import { signInWithGoogle } from '@/lib/service/mutationHelper';
import { router } from 'expo-router';

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
      if(response){
        console.log("logged", response);
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
      <Text>Sign in with Google</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        disabled={state.isInProgress}
      />

    </View>
  )
}

export default Auth